/* eslint-disable no-useless-escape */
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../common/search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadFilesDialogComponent } from '../download-files-dialog/download-files-dialog.component';
import { MolstarDialogComponent } from '../molstar-dialog/molstar-dialog.component';
import * as appSettings from '../app.settings';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { GalleryService } from '../gallery/service/gallery.service';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { ValidationSliderComponent } from '../validation-slider/validation-slider.component';

declare const gtag: any;

@Component({
  selector: 'pdbc-pivot-result-card',
  templateUrl: './pivot-result-card.component.html',
  styleUrls: ['./pivot-result-card.component.scss'],
  imports: [CommonModule, MaterialModule, TooltipDirective, ValidationSliderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PivotResultCardComponent implements OnInit {
  @Input() resultData: any;
  @Input() grayBackground: any;
  @Input() pivotType: any;
  galleryImages: any[] = [];
  interactingCompsIds: any[] = [];
  interactingCompsText: any[] = [];

  monthDictionary = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };
  statusMessages: any = {
    REL: 'Released',
    WDRN: 'Entry is withdrawn',
    OBS: 'Obsolete entry',
    PROC: 'Entry being processed',
    HPUB: 'Entry withheld until publication',
    POLC: 'Entry awaiting a wwPDB policy decision',
    AUTH: 'Entry awaiting author approval',
    REFI: 'Entry is re-refinement',
    HOLD: 'Entry is currently witheld',
    WAIT: 'Entry is awaiting first processing',
    REPL: 'Awaiting reprocessing with author-provided new files.',
    AUCO: 'Entry awaiting author correspondence',
  };

  pdbeUrl = 'https://www.ebi.ac.uk/pdbe/';

  validationSliderData: any;
  assemblyComposition: any;
  orgSciName: any;
  image1Src: any;
  image2Src: any;
  image3Src: any;
  image1Index: any = 0;
  image2Index: any;
  image3Index: any;
  compoundId!: string;
  compoundType!: string;
  uniprotAccessions: any[] = [];
  displayUnpAccessions: any[] = [];
  otherEntrieIds: string[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private gallery: GalleryService,
    private _sanitizer: DomSanitizer,
    private searchService: SearchService,
    public dialog: MatDialog
  ) {
    this.pdbeUrl = appSettings.pdbeUrl;
  }

  ngOnInit() {
    if (this.resultData.otherEntries) {
      this.resultData.otherEntries.forEach((otherEntry: string) => {
        this.otherEntrieIds.push(otherEntry.split('_')[0]);
      });
    }

    this.compoundId = this.resultData.compoundTitle.split(' : ')[0];
    if (this.resultData.bound_compound_id && this.resultData.bound_compound_id.indexOf(this.compoundId) > -1) {
      this.compoundType = 'bound';
    } else {
      this.compoundType = 'modified';
    }

    //format validation slider data
    this.validationSliderData = this.formatValidationResponse(this.resultData);

    //format assembly data
    if (this.resultData.assembly_composition && this.resultData.assembly_composition.length > 0) {
      this.assemblyComposition = this.getAssemblyComposition(this.resultData.assembly_composition);
    }

    //Format interaction comps
    if (this.resultData.interacting_ligands && this.resultData.interacting_ligands.length > 0) {
      this.getInteractingComps(this.resultData.interacting_ligands, this.resultData.pdb_id);
    }

    //format organism Scientific Name
    this.orgSciName = this.getOrganismScientificName(this.resultData.entry_organism_scientific_name);

    //combined uniprot accessions
    if (this.resultData.uniprot_accession_best) this.uniprotAccessions = this.resultData.uniprot_accession_best;
    if (this.resultData.entry_uniprot_accession) {
      this.resultData.entry_uniprot_accession.forEach((intUnpAcc: any) => {
        if (this.uniprotAccessions.indexOf(intUnpAcc) === -1) this.uniprotAccessions.push(intUnpAcc);
      });
    }
    this.displayUnpAccessions = this.uniprotAccessions;
    if (this.displayUnpAccessions.length > 6) this.displayUnpAccessions = this.uniprotAccessions.slice(0, 6);

    //Get tumbnail images
    this.image1Src = this.getImageSource(1);
    this.image2Src = this.getImageSource(2);
    this.image3Src = this.getImageSource(3);
  }

  sortImageJson(jsonImagesArr: any[], pdbId: string) {
    const imagesArr: any[] = [];
    jsonImagesArr.forEach((image) => {
      let imgUrl = this.pdbeUrl + 'static/entry/' + image.filename + '_image-800x800.png';
      let imgThumbUrl = this.pdbeUrl + 'static/entry/' + image.filename + '_image-100x100.png';

      if (/http:\/\//.test(image.filename)) {
        imgUrl = image.filename.replace(/\d{3,4}x\d{3,4}/, '800x800');
        imgThumbUrl = image.filename.replace(/\d{3,4}x\d{3,4}/, '100x100');
      }

      const formattedImage = {
        src: imgUrl,
        thumbnail: imgThumbUrl,
        text: image.alt,
        description: image.description,
        pdbId: pdbId,
        showText: false,
      };

      imagesArr.push(formattedImage);
    });

    //sort by image name
    /*let sortedImagesArr = imagesArr.sort(function(a,b) {
                            var x = a.src.toLowerCase();
                            var y = b.src.toLowerCase();
                            return x < y ? -1 : x > y ? 1 : 0;
                        });

    return sortedImagesArr;*/

    return imagesArr;
  }

  //get entity-id for compounds
  escapeSplChars(str: string) {
    return str.replace(/(!|"|\&\&|\|\||\{|\}|\[|\]|\^|\~|\*|\+|\-|\/|\\|\?|\(|\)|:)/g, function ($1, $2) {
      return '\\' + $2;
    });
  }

  getEntityId(entityImages: { [x: string]: { image: { alt: string }[] } }, defaultId: any) {
    const compName = this.escapeSplChars(this.resultData.compoundTitle.split(' : ')[1]);
    const compExp = new RegExp(compName);
    let compEntityIndex;
    for (const entityIndex in entityImages) {
      if (compExp.test(entityImages[entityIndex].image[0].alt)) {
        compEntityIndex = entityIndex;
        break;
      }
    }

    if (typeof compEntityIndex == 'undefined') compEntityIndex = defaultId;

    return compEntityIndex;
  }

  openImageGallery(galleryType: string, pdbId: string, selectedImageIndex: number) {
    if (typeof selectedImageIndex == 'undefined') return;

    const entityId = this.resultData.bestEntry.split('_')[1];
    const imageTypes: any = {
      entry: ['entry', 'EM', 'entity', 'assembly'],
      macromolecules: ['entity'],
      compounds: ['entity', 'ligands'],
      proteinFamilies: ['entity'],
    };

    if (this.compoundType == 'modified') {
      imageTypes.compounds = ['mod_res'];
    }

    if (this.galleryImages.length > 0) {
      this.gallery.load(this.galleryImages);
      this.gallery.set(selectedImageIndex);
    } else {
      //load images from api
      this.searchService.getGalleryImages(pdbId).subscribe((res) => {
        let galleryImagesArr: any[] = [];
        imageTypes[galleryType].forEach((imageType: string) => {
          if (typeof res[pdbId][imageType] == 'undefined' && imageType != 'ligands' && imageType != 'mod_res') return;

          let imagesArr = [];

          if (imageType == 'entry') {
            imagesArr = this.sortImageJson(res[pdbId].entry.all.image, pdbId);
            galleryImagesArr = galleryImagesArr.concat(imagesArr);
          } else if (imageType == 'entity' && (galleryType == 'macromolecules' || galleryType == 'proteinFamilies')) {
            imagesArr = this.sortImageJson(res[pdbId][imageType][entityId].image, pdbId);
            galleryImagesArr = galleryImagesArr.concat(imagesArr);

            //Get database images
            if (typeof res[pdbId][imageType][entityId].database != 'undefined') {
              for (const dbname in res[pdbId][imageType][entityId].database) {
                for (const dbId in res[pdbId][imageType][entityId].database[dbname]) {
                  if (
                    galleryType == 'proteinFamilies' &&
                    dbname == 'Pfam' &&
                    dbId == this.resultData.pfam_accession[this.resultData.pfam_name.indexOf(this.resultData.compoundTitle)]
                  ) {
                    imagesArr = this.sortImageJson(res[pdbId][imageType][entityId].database[dbname][dbId].image, pdbId);
                    galleryImagesArr = imagesArr.slice(0, 1).concat(galleryImagesArr);
                  } else {
                    imagesArr = this.sortImageJson(res[pdbId][imageType][entityId].database[dbname][dbId].image, pdbId);
                    galleryImagesArr = galleryImagesArr.concat(imagesArr.slice(0, 1));
                  }
                }
              }
            }
          } else if (imageType == 'entity' && galleryType == 'compounds') {
            const compEntityId = this.getEntityId(res[pdbId][imageType], entityId);
            imagesArr = this.sortImageJson(res[pdbId][imageType][compEntityId].image, pdbId);
            galleryImagesArr = galleryImagesArr.concat(imagesArr);
          } else if (imageType == 'ligands' || imageType == 'mod_res') {
            const hetId = this.compoundId;

            if (
              typeof res[pdbId]['entry'] != 'undefined' &&
              typeof res[pdbId].entry[imageType] != 'undefined' &&
              typeof res[pdbId].entry[imageType][hetId] != 'undefined'
            ) {
              imagesArr = this.sortImageJson(res[pdbId].entry[imageType][hetId].image, pdbId);
              galleryImagesArr = galleryImagesArr.concat(imagesArr);
            }

            galleryImagesArr.unshift({
              src: this.pdbeUrl + 'static/files/pdbechem_v2/' + hetId + '_500.svg',
              thumbnail: this.pdbeUrl + 'static/files/pdbechem_v2/' + hetId + '_500.svg',
              text: 'A representation of the model coordinates provided in the wwPDB chemical component dictionary',
              description: 'A representation of the model coordinates provided in the wwPDB chemical component dictionary',
              pdbId: pdbId,
              showText: false,
            });
          } else {
            for (const imageTypeKey in res[pdbId][imageType]) {
              if (imageType == 'assembly') {
                if (imageTypeKey == '1') {
                  imagesArr = this.sortImageJson(res[pdbId][imageType][imageTypeKey].image, pdbId);
                  galleryImagesArr = galleryImagesArr.concat(imagesArr.slice(0, 3));
                }
              } else {
                imagesArr = this.sortImageJson(res[pdbId][imageType][imageTypeKey].image, pdbId);
                galleryImagesArr = galleryImagesArr.concat(imagesArr.slice(0, 1));
              }
            }
          }
        });

        if (galleryImagesArr.length == 0) {
          galleryImagesArr = [
            {
              src: this.pdbeUrl + 'entry/static/images/notFound.jpg',
              thumbnail: this.pdbeUrl + 'entry/static/images/notFound.jpg',
              text: 'Image not available',
              description: 'Image not available',
              pdbId: pdbId,
              showText: false,
            },
          ];
        }

        this.galleryImages = galleryImagesArr;
        this.gallery.load(this.galleryImages);
        this.gallery.set(selectedImageIndex);
      });
    }
  }

  getOrganismScientificName(sciNameResult: any) {
    const label = '<strong>' + (sciNameResult && sciNameResult.length > 1) ? 'Source organisms: </strong>' : 'Source organism: </strong>';

    if (typeof sciNameResult == 'undefined') {
      if (this.resultData.status != 'REL') {
        return this._sanitizer.bypassSecurityTrustHtml(label + '<span style="white-space: nowrap;"><i>Not available</i></span>');
      } else {
        return this._sanitizer.bypassSecurityTrustHtml(label + '<span style="white-space: nowrap;"><i>None provided</i></span>');
      }
    } else {
      const nameArr = [];
      const seen: any = {};
      const len = sciNameResult.length;
      let j = 0;
      for (let i = 0; i < len; i++) {
        const item = sciNameResult[i];
        const itemArr = item.split('|');

        if (seen[item] !== 1) {
          seen[item] = 1;

          if (item.indexOf('|-1') < 0) {
            nameArr[j++] =
              '<span style="white-space: nowrap;">' +
              '<a class="ext-1" style="color:#0932d6; border-bottom-width: 0px" target="_blank" href="http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' +
              itemArr[1] +
              '">' +
              '<i>' +
              itemArr[0] +
              '</i>&nbsp;<span class="icon icon-generic" data-icon="x" style="font-size:9px;">&nbsp;</span></a></span>';
          } else {
            nameArr[j++] = '<span style="white-space: nowrap;"><i>Synthetic construct</i></span>';
          }
        }
      }
      return this._sanitizer.bypassSecurityTrustHtml(label + '' + nameArr.join(', '));
    }
  }

  getAssemblyComposition(assemblyData: any) {
    if (typeof assemblyData == 'undefined') {
      return '';
    } else {
      const out = [];
      const seen: any = {};
      const len = assemblyData.length;
      let j = 0;
      for (let i = 0; i < len; i++) {
        let item = assemblyData[i];
        if (item == 'protein structure') {
          item = 'protein only structure';
        }

        if (seen[item] !== 1) {
          seen[item] = 1;
          out[j++] = item;
        }
      }
      return this._sanitizer.bypassSecurityTrustHtml('<strong>Assembly composition:</strong> ' + out.join(', '));
    }
  }

  getInteractingComps(ligandData: any, pdbId: string) {
    const ligandIdArr = [];
    const ligandTextArr = [];
    if (typeof ligandData != 'undefined') {
      const seen: any = {};
      const len = ligandData.length;
      let j = 0;
      for (let i = 0; i < len; i++) {
        const item = ligandData[i];
        const itemArr = item.split(/\s+:\s+/);

        if (seen[itemArr[0]] !== 1) {
          seen[itemArr[0]] = 1;
          const newIndex = j++;
          ligandIdArr[newIndex] = itemArr[0];
          ligandTextArr[newIndex] = itemArr[1];
        }
      }
    }

    this.interactingCompsIds = ligandIdArr.slice();
    this.interactingCompsText = ligandTextArr.slice();
  }

  loadOtherEntriesSummary() {
    if (this.resultData.otherEntriesShow) {
      this.resultData.otherEntriesShow = !this.resultData.otherEntriesShow;
    } else {
      this.resultData.otherEntriesShow = true;
    }

    //if other entries data already exist don't query API again
    if (typeof this.resultData.otherEntriesData != 'undefined') {
      return;
    }

    const otherEntryIds: any[] = [];
    this.resultData.otherEntries.forEach((otherEntry: string) => {
      otherEntryIds.push(otherEntry.split('_')[0]);
    });
    this.resultData.otherEntriesData = {};

    if (otherEntryIds.length > 0) {
      //get validation slider data
      this.searchService.getValidationSliderDataFromSolr(otherEntryIds).subscribe((resp) => {
        if (resp && resp.grouped && resp.grouped.pdb_id && resp.grouped.pdb_id.groups && resp.grouped.pdb_id.groups.length > 0) {
          resp.grouped.pdb_id.groups.forEach((otherEntryRec: any, oei: any) => {
            const formattedResData = this.formatValidationResponse(otherEntryRec.doclist.docs[0]);
            const formattedinteractingLIngands =
              typeof otherEntryRec.doclist.docs[0].compound_id != 'undefined' ? otherEntryRec.doclist.docs[0].compound_id.slice(0, 3) : undefined;
            const totalInteractingLingands = typeof otherEntryRec.doclist.docs[0].compound_id != 'undefined' ? otherEntryRec.doclist.docs[0].compound_id.length : 0;
            // let recIndex = otherEntryIds.indexOf(otherEntryRec.groupValue);

            this.resultData.otherEntriesData[otherEntryRec.groupValue] = {
              pdbId: otherEntryRec.groupValue,
              sliderData: formattedResData,
              chainId: otherEntryRec.doclist.docs[0].struct_asym_id.join(', '),
              sourceOrg: this.getOrganismScientificName(otherEntryRec.doclist.docs[0].entry_organism_scientific_name),
              asmComposition: this.getAssemblyComposition(otherEntryRec.doclist.docs[0].assembly_composition),
              interactingLingands: formattedinteractingLIngands,
              totalInteractingLingands: totalInteractingLingands,
              boundLigands: otherEntryRec.doclist.docs[0].bound_compound_id,
            };
          });
        }

        this.cd.markForCheck();
      });
    }
  }

  formatValidationResponse(apiData: any) {
    const pdbeValidationData = apiData;

    if (apiData.experimental_method && apiData.experimental_method[0] != 'X-ray diffraction') return undefined;

    const validationData = [
      { label: 'Model geometry', value: null, message: '' },
      { label: 'Fit model/data', value: null, message: '' },
    ];

    if (typeof pdbeValidationData.model_quality != 'undefined' && pdbeValidationData.model_quality != null && pdbeValidationData.model_quality >= 0) {
      validationData[0].value = pdbeValidationData.model_quality;
    } else {
      validationData[0].message =
        pdbeValidationData.experiment_data_available && pdbeValidationData.experiment_data_available == 'y' ? 'Data not analysed' : 'Data not deposited';
    }

    if (typeof pdbeValidationData.data_quality != 'undefined' && pdbeValidationData.data_quality != null && pdbeValidationData.data_quality >= 0) {
      validationData[1].value = pdbeValidationData.data_quality;
    } else {
      validationData[1].message =
        pdbeValidationData.experiment_data_available && pdbeValidationData.experiment_data_available == 'y' ? 'Data not analysed' : 'Data not deposited';
    }

    return validationData;
  }

  getImageSource(imageNumber: number) {
    let imgElement = '';
    let imgSrc: any;
    const entityId = this.resultData.bestEntry.split('_')[1];
    if (this.pivotType == 'macromolecules') {
      imgSrc = {
        1: this.pdbeUrl + 'static/entry/' + this.resultData.pdb_id + '_entity_' + entityId + '_front_image-200x200.png',
        2: this.pdbeUrl + 'static/entry/' + this.resultData.pdb_id + '_entity_' + entityId + '_side_image-200x200.png',
        3: this.pdbeUrl + 'static/entry/' + this.resultData.pdb_id + '_entity_' + entityId + '_top_image-200x200.png',
      };
      this.image2Index = 2;
      this.image3Index = 1;
    } else if (this.pivotType == 'compounds') {
      imgSrc = {
        1: this.pdbeUrl + 'static/files/pdbechem_v2/' + this.compoundId + '_200.svg',
        2: this.pdbeUrl + 'entry/pdb/' + this.resultData.pdb_id + '/compoundimage?het=' + this.compoundId + '&orient=side&size=200',
        3: this.pdbeUrl + 'entry/pdb/' + this.resultData.pdb_id + '/compoundimage?het=' + this.compoundId + '&orient=top&size=200',
      };
      if (this.resultData.bound_compound_id && this.resultData.bound_compound_id.indexOf(this.compoundId) == -1) {
        imgSrc['2'] = 'https://www.ebi.ac.uk/pdbe/static/entry/' + this.resultData.pdb_id + '_modres_' + this.compoundId + '_side_image-200x200.png';
        imgSrc['3'] = 'https://www.ebi.ac.uk/pdbe/static/entry/' + this.resultData.pdb_id + '_modres_' + this.compoundId + '_top_image-200x200.png';
      }
      this.image2Index = 3;
      this.image3Index = 2;
    } else if (this.pivotType == 'proteinFamilies') {
      const entityId = this.resultData.bestEntry.split('_')[1];
      imgSrc = {
        1:
          this.pdbeUrl +
          'entry/pdb/' +
          this.resultData.pdb_id +
          '/pfamimage?pfam_id=' +
          this.resultData.pfam_accession[this.resultData.pfam_name.indexOf(this.resultData.compoundTitle)] +
          '&entity_id=' +
          entityId +
          '&size=200',
        2: this.pdbeUrl + 'static/entry/' + this.resultData.pdb_id + '_entity_' + entityId + '_front_image-200x200.png',
        3: this.pdbeUrl + 'static/entry/' + this.resultData.pdb_id + '_entity_' + entityId + '_side_image-200x200.png',
      };
      this.image2Index = 1;
      this.image3Index = 3;
    }

    return this._sanitizer.bypassSecurityTrustResourceUrl((imgElement = imgSrc[imageNumber]));
  }

  openDownloadDialog() {
    this.dialog.open(DownloadFilesDialogComponent, {
      disableClose: false,
      data: {
        pdbId: this.resultData.pdb_id,
      },
    });
  }

  openMolstarDialog() {
    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: {
        pdbId: this.resultData.pdb_id,
        assemblyId: this.resultData.prefered_assembly_id,
      },
    });
  }

  imageError(imgIndex: any) {
    switch (imgIndex) {
      case 1:
        this.image1Src = this.pdbeUrl + 'entry/static/images/notFound.jpg';
        this.image1Index = undefined;
        break;
      case 2:
        this.image2Src = this.pdbeUrl + 'entry/static/images/notFound.jpg';
        this.image2Index = undefined;
        break;
      case 3:
        this.image3Src = this.pdbeUrl + 'entry/static/images/notFound.jpg';
        this.image3Index = undefined;
        break;
    }
  }

  recordUserInteraction(type: string) {
    gtag('event', 'pivot_result_click_' + type);
  }
}
