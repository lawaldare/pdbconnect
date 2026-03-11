import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SearchService } from '../common/search.service';
import { CommonModule, DatePipe } from '@angular/common';
import { EventBrokerService, IEventListener } from '../common/EventBroker.service';
import { MatDialog } from '@angular/material/dialog';
import { OrcidUserListDialogComponent } from '../orcid-user-list-dialog/orcid-user-list-dialog.component';
import { DownloadFilesDialogComponent } from '../download-files-dialog/download-files-dialog.component';
import { MolstarDialogComponent } from '../molstar-dialog/molstar-dialog.component';
import * as appSettings from '../app.settings';
import { MaterialModule } from '@pdbc/core';
import { GalleryService } from '../gallery/service/gallery.service';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { RoundPipe } from '../common/round.pipe';
import { ValidationSliderComponent } from '../validation-slider/validation-slider.component';
import { FormatSpacingPipe } from '../common/formatMatchSeq.pipe';

declare const gtag: any;

@Component({
  selector: 'pdbc-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule, TooltipDirective, RoundPipe, ValidationSliderComponent, FormatSpacingPipe],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() resultData: any;
  @Input() grayBackground: any;
  galleryImages: any[] = [];

  @Input() thorInfo!: any;
  @Output() thorInfoChange = new EventEmitter<any[]>();

  @Input() thorClaimInfoById: any;

  @Input() phmmerSequenceData: any;
  @Input() fastaSequenceData: any;

  claimIt = false;
  private allEntriesSelectEventListener: IEventListener;

  validationSliderData: any;
  assemblyComposition: any;
  orgSciName: any;
  orcidMessageUser1: any;
  orcidMessageUser2: any;
  orcidMessageMultipleUser!: number;
  hasCurrentUserClaimed!: boolean;
  identicalEntries!: any[];
  otherEntriesShow = false;
  showLoader = false;
  clusterNumber!: string;
  clusterRank!: string;
  uniprotAccessions: any[] = [];
  displayUnpAccessions: any[] = [];
  carbPolymers: any[] = [];
  carbPolmerEntities: any[] = [];
  shortComplexName!: string;
  showFull = false;

  serviceHook: any;

  pdbeUrl: string;

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

  constructor(
    private cd: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private gallery: GalleryService,
    private searchService: SearchService,
    private datePipe: DatePipe,
    private _eventBroker: EventBrokerService,
    public dialog: MatDialog
  ) {
    this.pdbeUrl = appSettings.pdbeUrl;

    this.allEntriesSelectEventListener = _eventBroker.listen<boolean>('select-all-entries-updated', (selectAllValue: any) => {
      if (typeof selectAllValue == 'undefined') return;
      this.claimIt = selectAllValue;
      this.claimChange();
    });
  }

  ngOnInit() {
    if (this.resultData.doclist.docs[0].preferred_complex_name && this.resultData.doclist.docs[0].preferred_complex_name[0].length > 150) {
      this.shortComplexName = this.resultData.doclist.docs[0].preferred_complex_name[0].substring(0, 150) + '...';
    }

    //format validation slider data
    this.validationSliderData = this.formatValidationResponse(this.resultData.doclist.docs[0]);

    //format assembly data
    if (this.resultData.doclist.docs[0].assembly_composition && this.resultData.doclist.docs[0].assembly_composition.length > 0) {
      this.assemblyComposition = this.getAssemblyComposition(this.resultData.doclist.docs[0].assembly_composition);
    }

    // //format organism Scientific Name
    // this.orgSciName = this.getOrganismScientificName(this.resultData.doclist.docs[0].entry_organism_scientific_name);

    if (this.thorInfo && this.thorInfo['entriesToClaim'] && this.thorInfo['entriesToClaim'].indexOf(this.resultData.doclist.docs[0].pdb_id) > -1) {
      this.claimIt = true;
    }

    //combined uniprot accessions
    if (this.resultData.doclist.docs[0].uniprot_accession_best) {
      this.uniprotAccessions = this.resultData.doclist.docs[0].uniprot_accession_best;
    }
    if (this.resultData.doclist.docs[0].entry_uniprot_accession) {
      this.resultData.doclist.docs[0].entry_uniprot_accession.forEach((intUnpAcc: any) => {
        if (this.uniprotAccessions.indexOf(intUnpAcc) === -1) {
          this.uniprotAccessions.push(intUnpAcc);
        }
      });
    }
    this.displayUnpAccessions = this.uniprotAccessions;
    if (this.displayUnpAccessions.length > 6) this.displayUnpAccessions = this.uniprotAccessions.slice(0, 6);

    this.setCarbPolymers();

    this.setClusteringData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    if (changes['thorClaimInfoById'] || changes['thorInfo']) {
      this.getOrcidClaimMessageDetails();
    }

    const resultData = changes['resultData']?.currentValue;

    //format organism Scientific Name
    this.orgSciName = this.getOrganismScientificName(resultData?.doclist.docs[0].entry_organism_scientific_name);
  }

  getOrcidClaimMessageDetails() {
    if (!this.thorClaimInfoById && this.thorInfo && this.thorInfo['claimedIds'].indexOf(this.resultData.doclist.docs[0].pdb_id) > -1) {
      this.hasCurrentUserClaimed = true;

      this.orcidMessageUser1 = {
        name: 'You',
        orcId: this.thorInfo['userData'].orcId,
      };
    } else if (this.thorClaimInfoById && this.thorClaimInfoById.length > 0) {
      const totalClaims = this.thorClaimInfoById.length;

      //check for logged in user
      let isCurrentUserInList = false;

      if (this.thorInfo && this.thorInfo['userData']) {
        for (let i = 0; i < totalClaims; i++) {
          if (this.thorClaimInfoById[i].orcId == this.thorInfo['userData'].orcId) {
            isCurrentUserInList = true;
            this.hasCurrentUserClaimed = true;
            break;
          }
        }

        if (this.thorInfo['claimedIds'].indexOf(this.resultData.doclist.docs[0].pdb_id) > -1) {
          this.hasCurrentUserClaimed = true;
        }
      }

      if (totalClaims == 1) {
        if (isCurrentUserInList) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };
        } else if (!isCurrentUserInList && this.hasCurrentUserClaimed) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };

          this.orcidMessageUser2 = {
            name: this.thorClaimInfoById[0].givenName + ' ' + this.thorClaimInfoById[0].familyName,
            orcId: this.thorClaimInfoById[0].orcId,
          };
        } else if (!this.hasCurrentUserClaimed && !isCurrentUserInList) {
          this.orcidMessageUser1 = {
            name: this.thorClaimInfoById[0].givenName + ' ' + this.thorClaimInfoById[0].familyName,
            orcId: this.thorClaimInfoById[0].orcId,
          };
        }
      } else if (totalClaims == 2) {
        let otherUserIndex = 0;
        if (this.hasCurrentUserClaimed && this.thorClaimInfoById[0].orcId == this.thorInfo['userData'].orcId) otherUserIndex = 1;

        if (isCurrentUserInList && this.hasCurrentUserClaimed) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };

          this.orcidMessageUser2 = {
            name: this.thorClaimInfoById[otherUserIndex].givenName + ' ' + this.thorClaimInfoById[otherUserIndex].familyName,
            orcId: this.thorClaimInfoById[otherUserIndex].orcId,
          };
        } else if (!isCurrentUserInList && this.hasCurrentUserClaimed) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };

          this.orcidMessageMultipleUser = 2;
        } else {
          this.orcidMessageUser1 = {
            name: this.thorClaimInfoById[0].givenName + ' ' + this.thorClaimInfoById[0].familyName,
            orcId: this.thorClaimInfoById[0].orcId,
          };

          this.orcidMessageUser2 = {
            name: this.thorClaimInfoById[1].givenName + ' ' + this.thorClaimInfoById[1].familyName,
            orcId: this.thorClaimInfoById[1].orcId,
          };
        }
      } else if (totalClaims > 2) {
        if (isCurrentUserInList && this.hasCurrentUserClaimed) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };

          this.orcidMessageMultipleUser = totalClaims - 1;
        } else if (!isCurrentUserInList && this.hasCurrentUserClaimed) {
          this.orcidMessageUser1 = {
            name: 'You',
            orcId: this.thorInfo['userData'].orcId,
          };

          this.orcidMessageMultipleUser = totalClaims;
        } else {
          let otherUserIndex = 0;
          if (this.hasCurrentUserClaimed && this.thorClaimInfoById[0].orcId == this.thorInfo['userData'].orcId) otherUserIndex = 1;

          this.orcidMessageUser1 = {
            name: this.thorClaimInfoById[otherUserIndex].givenName + ' ' + this.thorClaimInfoById[otherUserIndex].familyName,
            orcId: this.thorClaimInfoById[otherUserIndex].orcId,
          };

          this.orcidMessageMultipleUser = totalClaims - 1;
        }
      }
    }
  }

  openOrcidDialog() {
    const dialogRef = this.dialog.open(OrcidUserListDialogComponent, {
      disableClose: false,
      data: {
        pdbId: this.resultData.doclist.docs[0].pdb_id,
        claimData: this.thorClaimInfoById,
      },
    });
  }

  sortImageJson(jsonImagesArr: any[], pdbId: string) {
    const imagesArr: { src: string; thumbnail: string; text: any; description: any; pdbId: string; showText: boolean }[] = [];
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
    const sortedImagesArr = imagesArr.sort(function (a, b) {
      const x = a.src.toLowerCase();
      const y = b.src.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });

    return sortedImagesArr;
  }

  openImageGallery(galleryType: string | number, pdbId: string, selectedImageIndex: number) {
    const imageTypes: any = {
      entry: ['assembly', 'entry', 'EM', 'entity'],
    };

    if (this.galleryImages.length > 0) {
      this.gallery.load(this.galleryImages);
      this.gallery.set(selectedImageIndex);
    } else {
      //load images from api
      this.serviceHook = this.searchService.getGalleryImages(pdbId).subscribe((res) => {
        let galleryImagesArr: any[] = [];
        imageTypes[galleryType].forEach((imageType: string) => {
          if (typeof res[pdbId][imageType] == 'undefined') return;

          let imagesArr = [];

          if (imageType == 'entry') {
            imagesArr = this.sortImageJson(res[pdbId].entry.all.image, pdbId);
            galleryImagesArr = galleryImagesArr.concat(imagesArr);
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
              src: 'https://www.ebi.ac.uk/pdbe/static/frontier/images/notFound.jpg',
              thumbnail: 'https://www.ebi.ac.uk/pdbe/static/frontier/images/notFound.jpg',
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

        this.serviceHook.unsubscribe();
      });
    }
  }

  getOrganismScientificName(sciNameResult: any) {
    let label = '<strong>Source organism: </strong>';
    if (sciNameResult && sciNameResult.length > 1) label = '<strong>Source organisms: </strong>';

    if (typeof sciNameResult == 'undefined') {
      if (this.resultData.doclist.docs[0].status != 'REL') {
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
              '<a class="ext-1" style="font-size: 13px; border-bottom-width: 0px" target="_blank" href="http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' +
              itemArr[1] +
              '"  (click)="recordUserInteraction(\'sci_organism_link\')">' +
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

  formatValidationResponse(apiData: any) {
    const pdbeValidationData = apiData;

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

  createOrcidClaimObject() {
    //ORCiD Data Object
    const orcidDescriptionArr = [
      'Experimental Method: ' + this.resultData.doclist.docs[0].experimental_method,
      'Deposited: ' + this.resultData.doclist.docs[0].deposition_date,
      'Released: ' + this.datePipe.transform(this.resultData.doclist.docs[0].release_date, 'd MMM y'),
    ];

    const orcidClaimData = {
      title: this.resultData.doclist.docs[0].title,
      workType: 'data-set',
      publicationYear: +this.resultData.doclist.docs[0].release_year,
      url: 'https://pdbe.org/' + this.resultData.doclist.docs[0].pdb_id,
      workExternalIdentifiers: [
        {
          workExternalIdentifierType: 'pdb',
          workExternalIdentifierId: this.resultData.doclist.docs[0].pdb_id,
        },
      ],
      shortDescription: orcidDescriptionArr.join(', '),
      clientDbName: 'PDB',
    };

    return orcidClaimData;
  }

  claimChange() {
    const entryId = this.resultData.doclist.docs[0].pdb_id;
    const recIndex = this.thorInfo['entriesToClaim'].indexOf(entryId);
    if (this.claimIt) {
      if (recIndex == -1) {
        this.thorInfo['entriesToClaim'].push(entryId);
      }

      if (typeof this.thorInfo['claimRequestData'][entryId] !== 'undefined') {
        this.thorInfo['claimRequestData'][entryId] = this.createOrcidClaimObject();
      }
    } else {
      if (recIndex > -1) {
        this.thorInfo['entriesToClaim'].splice(recIndex, 1);
      }

      if (typeof this.thorInfo['claimRequestData'][entryId] !== 'undefined') {
        delete this.thorInfo['claimRequestData'][entryId];
      }
    }

    this.cd.markForCheck();

    //Fire change event
    // this.thorInfoChange.emit(this.thorInfo);
  }

  openDownloadDialog() {
    this.dialog.open(DownloadFilesDialogComponent, {
      disableClose: false,
      data: {
        pdbId: this.resultData.doclist.docs[0].pdb_id,
      },
    });
    this.recordUserInteraction('open_download_files');
  }

  openMolstarDialog() {
    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: {
        pdbId: this.resultData.doclist.docs[0].pdb_id,
        assemblyId: this.resultData.doclist.docs[0].prefered_assembly_id,
      },
    });
    this.recordUserInteraction('open_3d_view');
  }

  ngOnDestroy() {
    this.allEntriesSelectEventListener.ignore();
  }

  getIdenticalPDB() {
    if (this.otherEntriesShow) {
      this.otherEntriesShow = !this.otherEntriesShow;
    } else {
      this.otherEntriesShow = true;
    }

    //if other entries data already exist don't query API again
    if (typeof this.identicalEntries != 'undefined') return;

    this.identicalEntries = [];
    this.showLoader = true;
    //get validation slider data
    this.searchService.getPdbByIdenticalSeq(this.phmmerSequenceData.doc.target_sequence).subscribe(
      (resp) => {
        this.showLoader = false;
        if (resp && resp.grouped && resp.grouped.pdb_id && resp.grouped.pdb_id.groups && resp.grouped.pdb_id.groups.length > 0) {
          resp.grouped.pdb_id.groups.forEach((otherEntryRec: any, oei: any) => {
            const formattedResData = this.formatValidationResponse(otherEntryRec.doclist.docs[0]);
            if (otherEntryRec.doclist.docs[0].pdb_id != this.resultData.doclist.docs[0].pdb_id) {
              const formattedboundLingands =
                typeof otherEntryRec.doclist.docs[0].compound_id != 'undefined' ? otherEntryRec.doclist.docs[0].compound_id.slice(0, 3) : undefined;
              const totalBoundLingands = typeof otherEntryRec.doclist.docs[0].compound_id != 'undefined' ? otherEntryRec.doclist.docs[0].compound_id.length : 0;
              this.identicalEntries.push({
                pdbId: otherEntryRec.doclist.docs[0].pdb_id,
                sliderData: formattedResData,
                chainId: otherEntryRec.doclist.docs[0].struct_asym_id.join(', '),
                sourceOrg: this.getOrganismScientificName(otherEntryRec.doclist.docs[0].entry_organism_scientific_name),
                asmComposition: this.getAssemblyComposition(otherEntryRec.doclist.docs[0].assembly_composition),
                boundLingands: formattedboundLingands,
                totalBoundLingands: totalBoundLingands,
              });
            }
          });
        }
        this.cd.markForCheck();
      },
      (e) => (this.identicalEntries = [])
    );

    this.recordUserInteraction('get_identical_pdb');
  }

  setClusteringData() {
    const percentArr = ['30', '40', '50', '70', '90', '95', '100'];

    percentArr.forEach((percent) => {
      if (typeof this.resultData.doclist.docs[0]['seq_' + percent + '_cluster_number'] != 'undefined') {
        this.clusterNumber = this.resultData.doclist.docs[0]['seq_' + percent + '_cluster_number'];
      }
      if (typeof this.resultData.doclist.docs[0]['seq_' + percent + '_cluster_rank'] != 'undefined') {
        this.clusterRank = this.resultData.doclist.docs[0]['seq_' + percent + '_cluster_rank'];
      }
    });
  }

  setCarbPolymers() {
    if (typeof this.resultData.doclist.docs[0]['carb_compound_id_entity'] != 'undefined') {
      const carbPolymerEntity: any[] = [];
      const carbComps: any[][] = [];
      this.resultData.doclist.docs[0]['carb_compound_id_entity'].forEach((carbEntity: string) => {
        const carbData = carbEntity.split('_');

        let entityIndex = carbPolymerEntity.indexOf(carbData[1]);
        if (entityIndex === -1) {
          carbPolymerEntity.push(carbData[1]);
          entityIndex = carbPolymerEntity.length - 1;
        }

        if (typeof carbComps[entityIndex] === 'undefined') {
          carbComps[entityIndex] = [];
        }
        carbComps[entityIndex].push(carbData[0]);
      });
      this.carbPolymers = carbComps;
      this.carbPolmerEntities = carbPolymerEntity;
    }
  }

  searchComplex(e: { stopPropagation: () => void; preventDefault: () => void }, complexParam: { var_name: string; value: any }) {
    e.stopPropagation();
    e.preventDefault();
    this._eventBroker.emit('autocomplete-select', complexParam);
    this.recordUserInteraction(complexParam.var_name + '_link');
  }

  recordUserInteraction(type: string) {
    gtag('event', 'result_click_' + type);
  }
}
