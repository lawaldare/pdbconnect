import { Component, input, Input, ViewChild, ElementRef, AfterViewInit, viewChild, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first, firstValueFrom } from 'rxjs';
import { Molecule } from '../../data-models/molecule.model';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import {
  MolstarSelectionObj,
  clearHighlightLoci,
  focusLoci,
  createComponent,
  getResidues,
  highlightLoci,
  unfocusLoci,
  changeComponentVisibility,
  addRepresentationToComponent,
  changeRepresentationVisibility,
  getComponentList,
  MolstarResidueInfo,
} from '../../helpers/molstar/molstar-helpers';
import { OverviewMolstarFacade } from './overview-molstar-facade';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { CathMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { Color } from 'molstar/lib/mol-util/color';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../interactive-tables/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../services/component-comm.service';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatLabel, FormsModule],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  // javascript functions exposed to template for parsing domains nested data
  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  // data inputs from parent component
  public readonly entryId = input.required<string>();
  public readonly complexDetails = input.required<ComplexDetails[]>();
  public readonly macromolecules = input.required<Molecule[]>();
  public readonly ligands = input.required<Molecule[]>();
  public readonly inputModifications = input.required<ModifiedResidue[]>();
  public readonly pfamMappings = input.required<PfamMappings>();
  public readonly cathMappings = input.required<CathMappings>();
  public readonly scopMappings = input.required<ScopMappings>();

  public totalDomains = 0;

  // data processing facade and it's signals (processed data)
  public readonly facade = inject(OverviewMolstarFacade);
  public readonly signals = inject(ComponentCommunicationService);

  // residue listing information retrieved using molstar
  private molstarResidueInfo = this.signals.molstarResidueInfo;
  private molstarResiduesForAssembly: MolstarResidueInfo[] = [];

  public assemblyData = this.facade.assemblyData;
  public moleculesDescription = this.facade.moleculesDescription;
  public entryContentsDescription = this.facade.entryContentsDescription;
  public modifications = this.facade.modifications;
  public colorsFromMolj = this.facade.colorsFromMolj;
  public moleculeNameByEntityId = this.facade.moleculeNameByEntityId;
  public domainsByEntityAndResource = this.facade.domainsByEntityAndResource;
  public domainCountByResource = this.facade.domainCountByResource;

  // public viewContainer = viewChild.required<ElementRef>('viewContainer');

  // reference to template molstar container and list container
  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  // molstar and molstar gallery manager instances
  private molstarViewInstance: any;
  private galleryManager: any;

  // molsta image gallery images and images by their names
  public imageList: string[] = [];
  public imagesByName: {
    [key: string]: { [key: string]: string };
  } = {};

  // name of image displayed on default state ('Main') for all tabs
  public preferredAssemblyImgName?: string;

  // these are variables used in the template for each tab
  public currentTab = 'Assembly';
  public currentTabSelection = 'Main'; // default state
  public currentDomainResource = 'CATH';
  public currentMolstarSelectionName: string | undefined;
  public currentMolstarSelectionInfo: string | undefined;
  public currentMolstarSelectionInfoList: string[] = [];
  public currentMolstarSelection?: MolstarSelectionObj;
  public currentMolstarSelections: MolstarSelectionObj[] = [];

  // this is a variable to save tabs states
  // some are loaded/used for the template variables above when a tab is switched
  // in function switchCurrentTab
  public tabsStates: {
    [key: string]: {
      isInactive: boolean;
      lastScroll: number;
      imgName: string;
      currentListSelection: string;
      currentDomainResource?: string;
      currentMolstarSelectionName: string | undefined;
      // currentSelectionObj?: Molecule | ModifiedResidue | undefined;
      currentMolstarSelection: MolstarSelectionObj | undefined;
      molstarSelectionObjs: MolstarSelectionObj[];
    };
  } = {
    Assembly: {
      isInactive: false,
      lastScroll: 0,
      imgName: '',
      currentListSelection: 'Main',
      // currentSelectionObj: undefined,
      currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      molstarSelectionObjs: [],
    },
    Macromolecules: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      currentListSelection: 'Main',
      // currentSelectionObj: undefined,
      currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      molstarSelectionObjs: [],
    },
    Ligands: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      currentListSelection: 'Main',
      // currentSelectionObj: undefined,
      currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      molstarSelectionObjs: [],
    },
    Domains: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      currentListSelection: 'Main',
      // currentSelectionObj: undefined,
      currentMolstarSelectionName: undefined,
      currentDomainResource: 'CATH',
      currentMolstarSelection: undefined,
      molstarSelectionObjs: [],
    },
    Modifications: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      currentListSelection: 'Main',
      currentMolstarSelectionName: undefined,
      // currentSelectionObj: undefined,
      currentMolstarSelection: undefined,
      molstarSelectionObjs: [],
    },
  };

  private async initMolstarInstance() {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred : '1';

    // const containerElementRef = this.molstarContainer.get(); // Unwrap the signal
    const container = this.molstarContainer.nativeElement;
    this.molstarViewInstance.render(container, {
      moleculeId: this.entryId(),
      assemblyId: assemblyToUse,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: false,
    });
    await firstValueFrom(this.molstarViewInstance.events.loadComplete);
    this.buttonsShowHide();
  }

  private async initMolstarImageGallery() {
    this.galleryManager = await PDBeMolstarPlugin.extensions.StateGallery.StateGalleryManager.create(this.molstarViewInstance.plugin, this.entryId());

    for (const imageObj of this.galleryManager.images) {
      this.imagesByName[imageObj.filename] = imageObj;
      if (imageObj.clean_description.includes('this domain is out of the observed residue ranges!')) {
        continue;
      }

      // await this.galleryManager.load(imageObj.filename);
      this.imageList.push(imageObj.filename);
    }

    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred : '1';
    this.preferredAssemblyImgName = `${this.entryId().toLowerCase()}_assembly_${assemblyToUse}_chemically_distinct_molecules_front`;
    // this.preferredAssemblyImgName = `${this.entryId().toLowerCase()}_deposited_chemically_distinct_molecules_front`;

    this.tabsStates['Assembly'].imgName = this.preferredAssemblyImgName;
    this.tabsStates['Macromolecules'].imgName = this.preferredAssemblyImgName;
    this.tabsStates['Ligands'].imgName = this.preferredAssemblyImgName;
    this.tabsStates['Domains'].imgName = this.preferredAssemblyImgName;
    this.tabsStates['Modifications'].imgName = this.preferredAssemblyImgName;

    await this.loadImg(this.preferredAssemblyImgName);
  }

  // private async generateResidueListing() {
  //   // TODO: Take into account that this is only for the preferred assembly so some ligands will bug (merge this with ligand tab Molstar isntance)
  //   // TODO: Could be optimized by filtering non macromolecules and non ligands data
  //   const data = await getResidues(this.molstarViewInstance);
  //   this.signals.molstarResidueInfo.set(data);
  //   this.signals.molstarResidueInfoLoaded.set(true);
  // }

  async ngAfterViewInit() {
    // generate assembly related data
    this.facade.parseComplexDetails(this.complexDetails());

    // generate text strings related to macromolecule types count
    this.facade.generateMoleculeCountText(this.macromolecules());

    // map entity id to molecule name for domains
    this.facade.mapEntityIdToMoleculeName([...this.macromolecules(), ...this.ligands()]);

    // initialise molstar and the image gallery functionality
    await this.initMolstarInstance();
    await this.initMolstarImageGallery();
    // await this.generateResidueListing();

    this.molstarResiduesForAssembly = getResidues(this.molstarViewInstance);

    // parse modifications data to match gallery states
    this.facade.parseModifications(this.entryId(), this.inputModifications(), this.imageList);

    // get domain specific images
    const imagesForDomains = this.imageList.filter((eachImg) => {
      return eachImg.includes('CATH') || eachImg.includes('SCOP') || eachImg.includes('Pfam');
    });

    // count total domains to check if domain section is active
    this.totalDomains = imagesForDomains.length;

    // get a single modres image
    let modresImg = this.imageList.filter((eachImg) => {
      return eachImg.includes('_modres_');
    });
    if (modresImg.length > 1) modresImg = [modresImg[0]];

    // retrieve entity and domain colors from molj files of image gallery
    this.facade.getColorsFromMolj([this.preferredAssemblyImgName!, ...imagesForDomains, ...modresImg]);

    // parse domain data to object that renders domains in template
    this.facade.parseMolstarGalleryDomains(this.entryId(), this.imageList, {
      CATH: this.cathMappings(),
      Pfam: this.pfamMappings(),
      SCOP: this.scopMappings(),
    });

    // set initial domain selection based on order and number of classification accessions mapped
    if (this.domainCountByResource()['CATH'] > 0) this.currentDomainResource = 'CATH';
    else if (this.domainCountByResource()['Pfam'] > 0) this.currentDomainResource = 'Pfam';
    else if (this.domainCountByResource()['SCOP'] > 0) this.currentDomainResource = 'SCOP';

    // set sections as active if they contain any data mapped to them
    if (this.macromolecules().length > 0) this.tabsStates['Macromolecules'].isInactive = false;
    if (this.ligands().length > 0) this.tabsStates['Ligands'].isInactive = false;
    if (this.totalDomains > 0) this.tabsStates['Domains'].isInactive = false;
    if (this.modifications().length > 0) this.tabsStates['Modifications'].isInactive = false;
  }

  private buttonsShowHide() {
    const btnToContent = {
      animation: 'Select Animation',
      screenshot: 'Screenshot / State Snapshot',
      controlToggle: 'Toggle Controls Panel',
      selection: 'Toggle Selection Mode',
      controlInfo: 'Settings / Controls Info',
    };
    for (const [_currentBtn, contentKey] of Object.entries(btnToContent)) {
      const currentBtnEle = <HTMLInputElement>document.querySelector(`button[title="${contentKey}"]`);
      if (!currentBtnEle) continue;
      currentBtnEle.style.display = 'none';
    }
  }

  public onDomainSelect(event: MatSelectChange) {
    this.currentDomainResource = event.value;
  }

  public async switchCurrentTab(newView: string) {
    if (this.tabsStates[newView].isInactive) return;

    // save scroll of current tab
    this.tabsStates[this.currentTab].lastScroll = this.infoControls.nativeElement.scrollTop;

    // load last state of new tab
    this.currentTab = newView;
    this.currentTabSelection = this.tabsStates[newView].currentListSelection;
    this.currentMolstarSelection = this.tabsStates[newView].currentMolstarSelection;
    this.currentMolstarSelections = this.tabsStates[newView].molstarSelectionObjs;
    this.currentMolstarSelectionName = this.tabsStates[newView].currentMolstarSelectionName;

    // generate last state of new tab
    this.currentMolstarSelectionInfo = this.molstarSelectionToName(this.currentMolstarSelection);
    this.currentMolstarSelectionInfoList = this.currentMolstarSelections.map((eachSelection) => <string>this.molstarSelectionToName(eachSelection));

    // load image gallery saved image state for new tab
    await this.loadImg(this.tabsStates[this.currentTab].imgName);

    // if tab is domains and something is selected, show the whole polymer
    if (newView === 'Domains' && this.currentTabSelection !== 'Main') {
      await changeComponentVisibility(this.molstarViewInstance, 'whole-entry/polymer', false);
    }
    // if tab is ligands and something is selected, show as sticks
    if (newView === 'Ligands' && this.currentTabSelection !== 'Main') {
      await this.showLigandsAsSticks();
    }
    // if tab is modifications and something is selected, show as sticks
    if (newView === 'Modifications' && this.currentTabSelection !== 'Main') {
      await this.showModificationsAsSticks();
    }

    // zoom to the saved molstar selection
    await this.switchMolstarZoomed(this.currentMolstarSelection);

    // load saved list scroll for new tab
    this.infoControls.nativeElement.scrollTo(0, this.tabsStates[this.currentTab].lastScroll);
  }

  public async switchTabListSelection(tabView: string, objectId: string) {
    let imgName = this.preferredAssemblyImgName!;

    let selectedMods: ModifiedResidue[] | undefined = undefined;
    let entity: Molecule | undefined = undefined;
    if (this.tabsStates[tabView].currentListSelection === objectId) {
      this.tabsStates[tabView].currentListSelection = 'Main';
    } else {
      this.tabsStates[tabView].currentListSelection = objectId;
      if (tabView === 'Macromolecules' || tabView === 'Ligands') {
        const allMolecules = [...this.macromolecules(), ...this.ligands()];
        entity = allMolecules.filter((mol) => {
          return mol.entity_id === parseInt(objectId);
        })[0];
        imgName = `${this.entryId()}_entity_${entity.entity_id}_front`;
      } else if (tabView === 'Modifications') {
        const modResId = objectId.split('_')[2];
        selectedMods = this.inputModifications().filter((mod) => mod.chem_comp_id === modResId);
        imgName = objectId;
      } else {
        imgName = objectId;
      }
    }

    this.currentTabSelection = this.tabsStates[tabView].currentListSelection;

    await this.loadImg(imgName);

    this.tabsStates[tabView].currentMolstarSelection = undefined;
    this.tabsStates[tabView].molstarSelectionObjs = [];

    if (this.currentTabSelection !== 'Main') {
      // const data = this.facade.getSelectionsFromImg(tabView, imgName, this.molstarResidueInfo(), entity, selectedMods);
      const data = this.facade.getSelectionsFromImg(tabView, imgName, this.molstarResiduesForAssembly, entity, selectedMods);

      const molstarSelections = data.selections;
      const firstMolstarSelection = molstarSelections.length > 0 ? molstarSelections[0] : undefined;

      this.tabsStates[tabView].currentMolstarSelectionName = data.name;
      this.tabsStates[tabView].currentMolstarSelection = firstMolstarSelection;
      this.tabsStates[tabView].molstarSelectionObjs = molstarSelections;

      this.currentMolstarSelectionInfo = this.molstarSelectionToName(firstMolstarSelection);
      this.currentMolstarSelectionInfoList = molstarSelections.map((eachSelection) => <string>this.molstarSelectionToName(eachSelection));
    }

    this.currentMolstarSelection = this.tabsStates[tabView].currentMolstarSelection;
    this.currentMolstarSelections = this.tabsStates[tabView].molstarSelectionObjs;
    this.currentMolstarSelectionName = this.tabsStates[tabView].currentMolstarSelectionName;

    if (tabView === 'Domains') {
      await changeComponentVisibility(this.molstarViewInstance, 'whole-entry/polymer', false);
    }
    if (tabView === 'Ligands') {
      await this.showLigandsAsSticks();
    }
    if (tabView === 'Modifications') {
      await this.showModificationsAsSticks();
    }

    await this.switchMolstarZoomed(this.currentMolstarSelection);
  }

  private async showLigandsAsSticks() {
    const ligandColor = this.colorsFromMolj()[this.currentMolstarSelection!.entityId!];
    const hexColor = parseInt(ligandColor.replace(/^#/, ''), 16);

    const entity = this.ligands().filter((mol) => {
      return mol.entity_id === parseInt(this.currentMolstarSelection!.entityId!);
    })[0];

    const chemCompId = entity!.chem_comp_ids[0];
    if (chemCompId.length === 3) {
      const reprNonSelectionLigand = {
        type: 'ball-and-stick',
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
      };
      const componentName = `/entities/entity-${entity.entity_id}`;
      await addRepresentationToComponent(this.molstarViewInstance, componentName, reprNonSelectionLigand, true);
      // await changeRepresentationVisibility(this.molstarViewInstance, componentName, false, 0);
    }
  }

  private async showModificationsAsSticks() {
    const chemCompId = this.currentTabSelection.split('_')[2];
    const modificationColor = this.colorsFromMolj()[chemCompId];
    const hexColor = parseInt(modificationColor.replace(/^#/, ''), 16);

    const reprNonSelectionLigand = {
      type: 'ball-and-stick',
      color: 'element-symbol',
      colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
    };
    const componentName = `/modified-residues/${chemCompId}`;
    await addRepresentationToComponent(this.molstarViewInstance, componentName, reprNonSelectionLigand, true);
  }

  public async onMolstarSelect(event: MatSelectChange) {
    // get index of dropdown value
    const idx = this.currentMolstarSelectionInfoList.indexOf(event.value);
    // use index to update current selection in tabs states obj
    this.tabsStates[this.currentTab].currentMolstarSelection = this.currentMolstarSelections[idx];
    // update current from tabs states obj
    this.currentMolstarSelection = this.tabsStates[this.currentTab].currentMolstarSelection;
    // refresh display of current
    await this.switchMolstarZoomed(this.currentMolstarSelection);
  }

  async loadImg(imgString: string) {
    if (imgString) {
      this.tabsStates[this.currentTab].imgName = imgString;
      await this.galleryManager.load(imgString);
      // await getComponentList(this.molstarViewInstance);
    }
  }

  async switchMolstarZoomed(molstarSelection?: MolstarSelectionObj) {
    if (molstarSelection) {
      // if (this.currentGallerySelectionByView[this.currentTab] !== molstarSelection) {
      await focusLoci(this.molstarViewInstance, molstarSelection);
      // } else {
      //   await unfocusLoci(this.molstarViewInstance);
      // }
    } else {
      await unfocusLoci(this.molstarViewInstance);
    }
    // this.currentGallerySelectionByView[this.currentTab] = molstarSelection;
  }

  async focusSelection(molstarSelection: MolstarSelectionObj) {
    await highlightLoci(this.molstarViewInstance, molstarSelection);
  }

  async unfocusSelection() {
    await clearHighlightLoci(this.molstarViewInstance);
  }

  public molstarSelectionToName(molstarSelection: MolstarSelectionObj | undefined) {
    if (molstarSelection === undefined) return undefined;

    let name = '';
    if (this.currentTab === 'Macromolecules') {
      name = `Chain: ${molstarSelection!.authChainId}`;
    } else if (this.currentTab === 'Ligands' || this.currentTab === 'Modifications') {
      const chain = molstarSelection!.authChainId;
      const resNum = molstarSelection!.residues[0].authBegin;
      const resIns = molstarSelection!.residues[0].authBeginIns;
      name = `Chain: ${chain} - Res: ${resNum}${resIns}`;
    } else if (this.currentTab === 'Domains') {
      const imgName = this.tabsStates[this.currentTab].imgName;

      const entityId = parseInt(imgName.split('_')[1]);
      const resource = imgName.split('_')[3];
      const resourceId = imgName.split('_')[4];
      const domainInfo = this.domainsByEntityAndResource()[resource][entityId][resourceId];
      name = Object.keys(domainInfo.domains).join(', ');
    }
    return name;
  }

  public viewDetails() {
    let tabName = this.currentTab;
    if (tabName === 'Modifications') tabName = 'Ligands';

    const rowData = this.signals.getTabData(tabName);

    let rowIdx = -1;
    for (let idx = 0; idx < rowData.length; idx++) {
      if (this.currentTab === 'Macromolecules' && this.currentMolstarSelection) {
        const rowDatum = rowData[idx] as MacromoleculesRowData;
        const isSameEntity = rowDatum.additionalData.molecule.entity_id + '' === this.currentMolstarSelection.entityId!;
        if (isSameEntity) {
          rowIdx = idx;
          break;
        }
      } else if (this.currentTab === 'Ligands' && this.currentMolstarSelection) {
        const rowDatum = rowData[idx] as LigandsRowData;
        if (rowDatum.type !== 'ligand') continue;
        const isSameEntity = (rowDatum.additionalData.source as Molecule).entity_id + '' === this.currentMolstarSelection.entityId!;
        if (isSameEntity) {
          rowIdx = idx;
          break;
        }
      } else if (this.currentTab === 'Modifications') {
        const rowDatum = rowData[idx] as LigandsRowData;
        if (rowDatum.type !== 'modification') continue;
        const sourceModifications = rowDatum.additionalData.source as ModifiedResidue[];
        let found = false;
        for (const mod of sourceModifications) {
          const isSameEntity = mod.entity_id + '' === this.currentMolstarSelection!.entityId!;
          const isSameChain = mod.chain_id + '' === this.currentMolstarSelection!.authChainId!;
          const isSameResidueSt = mod.author_residue_number + '' === this.currentMolstarSelection!.residues[0].authBegin;
          const isSameResidueStIns = mod.author_insertion_code === this.currentMolstarSelection!.residues[0].authBeginIns;
          // const isSameResidueEnd = mod.author_residue_number+'' === this.currentMolstarSelection!.residues[0].authEnd;
          // const isSameResidueEndIns = mod.author_insertion_code === this.currentMolstarSelection!.residues[0].authEndIns;
          if (isSameEntity && isSameChain && isSameResidueSt && isSameResidueStIns) {
            found = true;
            break;
          }
        }
        if (found) {
          rowIdx = idx;
          break;
        }
      }
      // This follows assumptions that one chain => one entity id which might not always hold truth
      else if (this.currentTab === 'Domains') {
        const rowDatum = rowData[idx] as DomainsRowData;

        const domainEntity = this.currentTabSelection.split('_')[1];
        const domainChain = this.currentTabSelection.split('_')[2];
        const domainSource = this.currentTabSelection.split('_')[3];
        const domainAccession = this.currentTabSelection.split('_')[4];
        const domainSegments = this.currentMolstarSelection!.residues.filter((resMolSel) => resMolSel.authChainId! === domainChain).map((resMolSel) => {
          return `${resMolSel.authBegin}${resMolSel.authBeginIns} - ${resMolSel.authEnd}${resMolSel.authEndIns}`;
        });

        const isSameEntity = domainEntity === rowDatum.additionalData.boundaries[0].entity + '';
        const hasAccession = rowDatum.domainName.includes(domainAccession);
        const hasSource = rowDatum.resource.includes(domainSource);
        const hasChain = rowDatum.segments.join(' ').includes(`${domainChain}:`);

        const trimmedSegments = rowDatum.segments.map((domainSegment) => {
          if (domainSegment.includes(':')) {
            domainSegment = domainSegment.split(':')[1];
          }
          return domainSegment.trim();
        });
        const hasSegments = trimmedSegments.every((domainSegment) => domainSegments.join(' ').includes(domainSegment));

        if (isSameEntity && hasAccession && hasSource && hasChain && hasSegments) {
          rowIdx = idx;
          break;
        }
      }
    }
    if (rowIdx > -1) {
      this.signals.setTabState(tabName, rowIdx);
      if (this.signals.currentTab() !== tabName) {
        this.signals.currentTab.set(tabName);
        this.signals.tabSwitchOrigin.set('explorer');
      }
    }
  }
}
