import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureExplorerService, extraInfoObj } from './struc-explorer-ecm-2024.service';
import { firstValueFrom } from 'rxjs';
import { clearHighlightLoci, focusLoci, getResidues, highlightLoci, unfocusLoci } from './get-residues-for-components';

declare let PDBeMolstarPlugin: any;

// TODO: Color coding

const DARK2_COLORS = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];
const BOLD_COLORS = ['#7f3c8d', '#11a579', '#3969ac', '#f2b701', '#e73f74', '#80ba5a', '#e68310', '#008695', '#cf1c90', '#f97b72'];
const PASTEL_COLORS = ['#66c5cc', '#f6cf71', '#f89c74', '#dcb0f2', '#87c55f', '#9eb9f3', '#fe88b1', '#c9db74', '#8be0a4', '#b497e7'];

@Component({
  selector: 'pdbe-struc-explorer-ecm-2024',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './struc-explorer-ecm-2024.component.html',
  styleUrl: './struc-explorer-ecm-2024.component.scss',
})
export class StrucExplorerEcm2024Component {
  private readonly apiService = inject(StructureExplorerService);

  @Input() public entryId = '1trn'; //'7v08', '3d12', '5tj5', '4zqo'
  public assemblyId = '';
  public assemblyComposition = '';
  public complexId = '';
  // public viewData$ = this.setViewData();

  @ViewChild('viewContainer') viewContainer!: ElementRef;
  private molstarViewInstance: any;
  private galleryManager: any;

  public molstarHeight = '447px';
  public molstarWidth = '100%';
  public imagesByName: {
    [key: string]: { [key: string]: string };
  } = {};

  public sectionsData: any = {
    Default: {
      name: 'Assembly',
      img: '',
    },
    Macromolecules: {
      img: '',
      entities: [],
    },
    Ligands: {
      img: '',
      entities: [],
    },
    Domains: {
      SCOP: {},
      CATH: {},
      Pfam: {},
      isEmpty: true,
    },
    Modifications: [],
  };

  public currentSection = '';
  public currentSectionImg = '';
  public expandedSections = false;
  public currentImg = '';
  public prevCurrentImg = '';
  public explorerCurrentTitle?: string;
  public explorerCurrentOption?: string;
  public explorerCurrentSubTitle?: string;
  public hasBackOpt: boolean = false;
  public hasBackToStartOpt: boolean = false;
  public menuType?: string;
  public currentExtraInfo: extraInfoObj[] = [];
  public allowedMenuTypes = ['navigation', 'selection', 'domains'];

  public menuData: any = [];
  public mainMenuData: { name: string; isActive?: boolean }[] = [];
  // public menuData?: {name: string, img?: string, envImg?: string, isActive?: boolean} [] | {
  //   "SCOP": {name: string, img: string}[],
  //   "CATH": {name: string, img: string}[],
  //   "Pfam": {name: string, img: string}[],
  //   "isEmpty": true
  // }
  // public kbLinkOut?: {name: string, url: string};
  public kbLinkData?: {
    txt: string;
    src: string;
  };

  public uniqueMoleculesCountString = '';
  public uniqueLigandsCountString = '';
  public uniqueDomainsCountString = '';
  public uniqueModificationsCountString = '';
  public entityIdsToProteinNames: any;

  async ngAfterViewInit() {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;
    this.molstarViewInstance.render(container, {
      moleculeId: this.entryId,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: false,
    });
    await firstValueFrom(this.molstarViewInstance.events.loadComplete);
    this.buttonsShowHide();

    const assemblyData = await firstValueFrom(this.apiService.getPreferredAssembly(this.entryId));

    this.assemblyId = assemblyData.preferred + '';
    this.assemblyComposition = assemblyData.composition;
    this.complexId = assemblyData.complexId;

    const uniprotsByEntityId = await firstValueFrom(this.apiService.getUniprotsByEntityId(this.entryId));
    // console.log("uniprotsByEntityId")
    // console.log(uniprotsByEntityId)
    const macromoleculeLigandsData = await firstValueFrom(this.apiService.getMacromoleculesLigands(this.entryId, uniprotsByEntityId));
    // console.log("macromoleculeLigandsData")
    // console.log(macromoleculeLigandsData)
    this.sectionsData['Macromolecules'].entities = macromoleculeLigandsData.macromolecules;
    this.sectionsData['Ligands'].entities = macromoleculeLigandsData.ligands;
    this.entityIdsToProteinNames = macromoleculeLigandsData.entityIdsToProteinNames;

    this.uniqueMoleculesCountString = macromoleculeLigandsData.macromoleculeCountsStr;
    // const toBeLigands = macromoleculeLigandsData.ligands.length > 1 ? "are" : "is";
    const pluralLigands = macromoleculeLigandsData.ligands.length > 1 ? 'ligands' : 'ligand';
    // this.uniqueLigandsCountString = `There ${toBeLigands} ${macromoleculeLigandsData.ligands.length} unique ${pluralLigands} in this assembly.`;
    this.uniqueLigandsCountString = `${macromoleculeLigandsData.ligands.length} unique ${pluralLigands}`;

    let modificationsData = [];
    try {
      modificationsData = await firstValueFrom(this.apiService.getModifications(this.entryId, this.entityIdsToProteinNames));
    } catch (_error) {}

    this.sectionsData['Modifications'] = modificationsData;

    // const toBeModifications = modificationsData.length > 1 ? "are" : "is";
    const pluralModifications = modificationsData.length > 1 ? 'modifications' : 'modification';
    // this.uniqueModificationsCountString = `There ${toBeModifications} ${modificationsData.length} unique ${pluralModifications} in this assembly.`;
    this.uniqueModificationsCountString = `${modificationsData.length} unique ${pluralModifications}`;

    this.galleryManager = await PDBeMolstarPlugin.extensions.stateGallery.StateGalleryManager.create(this.molstarViewInstance.plugin, this.entryId);
    let imageList = [];
    for (const imageObj of this.galleryManager.images) {
      this.imagesByName[imageObj.filename] = imageObj;
      if (imageObj.clean_description.includes('this domain is out of the observed residue ranges!')) {
        continue;
      }
      // await this.galleryManager.load(imageObj.filename);
      imageList.push(imageObj.filename);
    }

    let scopData = { domains: [], count: 0 };
    try {
      scopData = (await firstValueFrom(this.apiService.getScop(this.entryId, imageList, this.entityIdsToProteinNames))) || { domains: [], count: 0 };
    } catch (_error) {}

    let cathData = { domains: [], count: 0 };
    try {
      cathData = (await firstValueFrom(this.apiService.getCath(this.entryId, imageList, this.entityIdsToProteinNames))) || { domains: [], count: 0 };
    } catch (_error) {}

    let pfamData = { domains: [], count: 0 };
    try {
      pfamData = (await firstValueFrom(this.apiService.getPfam(this.entryId, imageList, this.entityIdsToProteinNames))) || { domains: [], count: 0 };
    } catch (_error) {}

    this.sectionsData['Domains']['SCOP'] = scopData.domains;
    this.sectionsData['Domains']['CATH'] = cathData.domains;
    this.sectionsData['Domains']['Pfam'] = pfamData.domains;

    this.sectionsData['Domains']['isEmpty'] = false;

    let totalDomains = scopData.count + cathData.count + pfamData.count;
    // const toBeDomains = totalDomains > 1 ? "are" : "is";
    // this.uniqueDomainsCountString = `There ${toBeDomains} `;
    let toAppend = [];
    if (cathData.count > 0) {
      toAppend.push(`${cathData.count} unique CATH`);
      this.sectionsData['Domains']['isEmpty'] = false;
    }
    if (scopData.count > 0) {
      if (toAppend.length === 1) toAppend.push(' and ');
      toAppend.push(`${scopData.count} unique SCOP 1.75`);
      this.sectionsData['Domains']['isEmpty'] = false;
    }
    if (pfamData.count > 0) {
      if (toAppend.length === 3) {
        toAppend[1] = ', '; // first and becomes comma
        toAppend.push(' and ');
      }
      if (toAppend.length === 1) toAppend.push(' and ');
      toAppend.push(`${pfamData.count} unique Pfam`);
      this.sectionsData['Domains']['isEmpty'] = false;
    }
    // const pluralDomains = totalDomains > 1 ? "mappings" : "mapping";
    const pluralDomains = totalDomains > 1 ? 'domains' : 'domain';
    // this.uniqueDomainsCountString += toAppend.join('') + ` domain ${pluralDomains} in this assembly.`;
    this.uniqueDomainsCountString += toAppend.join('') + ` ${pluralDomains}`;

    this.sectionsData['Default'].img = `${this.entryId.toLowerCase()}_deposited_chemically_distinct_molecules_front`;
    this.sectionsData['Ligands'].img = `${this.entryId.toLowerCase()}_deposited_chemically_distinct_molecules_front`;
    // await this.galleryManager.load(this.sectionsData["Default"].img);

    this.mainMenuData = [
      { name: 'Macromolecules', isActive: this.sectionsData.Macromolecules.entities.length > 0 },
      { name: 'Ligands', isActive: this.sectionsData.Ligands.entities.length > 0 },
      { name: 'Domains', isActive: this.sectionsData.Domains.isEmpty === false },
      { name: 'Modifications', isActive: this.sectionsData.Modifications.length > 0 },
    ];
    this.setStateAndLoadImg('Default');
  }

  async setStateAndLoadImg(newState: string) {
    this.currentSection = newState;
    const newStateList = newState.split('___');
    let currentImg = this.sectionsData;
    for (const stateStr of newStateList) {
      currentImg = currentImg[stateStr];
    }
    currentImg = currentImg.img;
    this.setExtraInfo([]);
    this.loadImg(currentImg);
    this.setControls();
  }

  loadSelectedData(menuItem: any) {
    if (this.currentImg !== menuItem.img) {
      this.setExtraInfo(menuItem.extraInfo);
      this.loadImg(menuItem.img);
    } else {
      this.setExtraInfo([]);
      this.loadImg(this.currentSectionImg);
    }
  }

  async loadImg(imgString: string) {
    if (imgString) {
      this.prevCurrentImg = `${this.currentImg}`;
      this.currentImg = imgString;
      await this.galleryManager.load(imgString);
    }
  }

  setExtraInfo(extraInfoObj: any) {
    this.currentExtraInfo = JSON.parse(JSON.stringify(extraInfoObj));
    const kbLink = this.currentExtraInfo.filter((eachInfo) => eachInfo.type === 'kb-link');
    if (kbLink.length > 0) {
      this.kbLinkData = kbLink[0].link;
    } else {
      this.kbLinkData = undefined;
    }
  }

  expandedDictionary: { [key: string]: boolean } = {};
  setExpandable(expandableName: string) {
    // if (this.expandedSections === expandableName) {
    //   if (expandableName.split('___').length > 0) {
    //     this.expandedSections = expandableName.split('___')[0];
    //   } else  {
    //     this.expandedSections = "";
    //   }
    // } else {
    //   this.expandedSections = expandableName;
    // }
    if (Object.keys(this.expandedDictionary).indexOf(expandableName) === -1) {
      this.expandedDictionary[expandableName] = false;
    }
    if (!this.expandedDictionary[expandableName]) {
      this.expandedDictionary[expandableName] = true;
    } else {
      this.expandedDictionary[expandableName] = false;
    }
  }

  easyNav(navType: string) {
    const newStateList = this.currentSection.split('___');
    if (navType === 'start' || newStateList.length < 2) {
      this.setStateAndLoadImg('Default');
    } else {
      newStateList.pop();
      this.setStateAndLoadImg(newStateList.join(','));
    }
  }

  setControls() {
    this.explorerCurrentTitle = 'Explore in this entry:';
    this.explorerCurrentSubTitle = undefined;
    this.explorerCurrentOption = undefined;
    this.hasBackOpt = false;
    this.hasBackToStartOpt = false;
    this.menuType = 'navigation';
    this.kbLinkData = undefined;
    this.currentSectionImg = `${this.entryId.toLowerCase()}_deposited_chemically_distinct_molecules_front`;
    if (this.currentSection === 'Default') {
      this.currentExtraInfo = [
        { value: 'Assembly composition', type: 'title' },
        { value: `${this.assemblyComposition}`, type: 'text' },
        { value: 'PDBe Complex ID', type: 'title' },
        { value: `${this.complexId}`, type: 'search-link' },
      ];
    }
    if (this.currentSection === 'Macromolecules') {
      if (this.sectionsData.Macromolecules.length === 0) return;
      this.explorerCurrentTitle = 'Explore macromolecules';
      this.explorerCurrentSubTitle = this.uniqueMoleculesCountString;
      this.explorerCurrentOption = undefined;
      this.hasBackOpt = true;
      this.hasBackToStartOpt = false;
      this.menuType = 'selection';
      let menuDataMacromolecules = this.sectionsData.Macromolecules.entities;
      this.menuData = menuDataMacromolecules;
    }
    if (this.currentSection === 'Ligands') {
      if (this.sectionsData.Ligands.length === 0) return;
      this.explorerCurrentTitle = 'Explore ligands';
      this.explorerCurrentSubTitle = this.uniqueLigandsCountString;
      this.explorerCurrentOption = undefined;
      this.hasBackOpt = true;
      this.hasBackToStartOpt = false;
      this.menuType = 'selection';
      let menuDataLigands = this.sectionsData.Ligands.entities;
      this.menuData = menuDataLigands;
    }
    if (this.currentSection.includes('Ligands___')) {
      const currentLigand = this.currentSection.split('___')[1];
      this.explorerCurrentTitle = undefined;
      this.explorerCurrentSubTitle = undefined;
      this.explorerCurrentOption = currentLigand;
      this.hasBackOpt = true;
      this.hasBackToStartOpt = false;
      this.menuType = undefined;
    }
    if (this.currentSection === 'Domains') {
      if (this.sectionsData.Domains.length === 0) return;
      this.explorerCurrentTitle = 'Explore domains';
      this.explorerCurrentSubTitle = this.uniqueDomainsCountString;
      this.explorerCurrentOption = undefined;
      this.hasBackOpt = true;
      this.hasBackToStartOpt = false;
      this.menuType = 'domains';
      if (this.expandedSections === false) {
        let stopLooking = false;
        for (const domainKey of ['CATH', 'Pfam', 'SCOP']) {
          for (const domainDatum of this.sectionsData.Domains[domainKey]) {
            if (!stopLooking) {
              this.setExpandable(domainKey);
              stopLooking = true;
            }
            this.setExpandable(`${domainKey}___${domainDatum.name}`);
            // break;
          }
          // if (stopLooking) break;
        }
        this.expandedSections = true;
      }
    }
    if (this.currentSection === 'Modifications') {
      if (this.sectionsData.Modifications.length === 0) return;
      this.explorerCurrentTitle = 'Explore modifications';
      this.explorerCurrentSubTitle = this.uniqueModificationsCountString;
      this.explorerCurrentOption = undefined;
      this.hasBackOpt = true;
      this.hasBackToStartOpt = false;
      this.menuType = 'selection';
      let menuDataModifications = this.sectionsData.Modifications;
      this.menuData = menuDataModifications;
    }
  }

  async showLigandsEnv(ligandName: string, ligandImg: string) {
    this.currentSection = `Ligands___${ligandName}`;
    this.explorerCurrentTitle = `Ligand environment for ${ligandName}`;
    this.explorerCurrentSubTitle = undefined;
    this.explorerCurrentOption = undefined;
    this.hasBackOpt = true;
    this.hasBackToStartOpt = true;
    this.menuType = undefined;
    // this.currentExtraInfo = [
    //   {value: "Test:", type: "title"},
    //   {value: `Testing you`, type: "text"},
    // ];
    await this.loadImg(ligandImg);
    const info = await this.getInfoForEnvironment(ligandName);
    this.explorerCurrentTitle = info.title;
    this.currentExtraInfo = info.extraInfo;
    const kbLink = this.currentExtraInfo.filter((eachInfo) => eachInfo.type === 'kb-link');
    if (kbLink.length > 0) {
      this.kbLinkData = kbLink[0].link;
    } else {
      this.kbLinkData = undefined;
    }
  }

  async getInfoForEnvironment(ccdId: string) {
    let returnData: {
      title: string;
      extraInfo: extraInfoObj[];
    } = {
      title: '',
      extraInfo: [],
    };
    // let allowedKeyNames = [
    //   `lig-${ccdId}`,`env-${ccdId}`,`wide-${ccdId}`,`link-${ccdId}`
    // ]
    let structureData = [this.molstarViewInstance.plugin.managers.structure.hierarchy.current.structures[0]];
    for await (const s of structureData) {
      for (const comp of s.components) {
        const keySplit = comp.key.split('/');
        const keyName = keySplit[keySplit.length - 1];

        if (keyName === `lig-${ccdId}`) {
          const ligand = getResidues(comp.cell.obj.data)[0];
          returnData.title = `Ligand environment for ${ligand.label_comp_id} ${ligand.auth_asym_id} ${ligand.auth_seq_id}:`;
        }
        if (keyName === `env-${ccdId}`) {
          returnData.extraInfo.push({ value: 'Residues within 5Å of this ligand:', type: 'title' });
          const resids = getResidues(comp.cell.obj.data);
          const residRows = resids.map((resid) => {
            let moleculeName = this.entityIdsToProteinNames[resid.label_entity_id!];
            moleculeName = moleculeName !== undefined ? moleculeName : '';

            let labelSeqId = resid.label_seq_id !== null ? resid.label_seq_id : '';

            let authorInsertionCode = resid.pdbx_PDB_ins_code !== null ? resid.pdbx_PDB_ins_code : '';

            return {
              molstarSelection: {
                entityId: `${resid.label_entity_id!}`,
                authChainId: `${resid.auth_asym_id}`,
                residues: [
                  {
                    authBegin: `${resid.auth_seq_id}`,
                    authBeginIns: `${resid.pdbx_PDB_ins_code}`,
                    authEnd: `${resid.auth_seq_id}`,
                    authEndIns: `${resid.pdbx_PDB_ins_code}`,
                  },
                ],
              },
              data: [
                `${moleculeName}`,
                `${resid.label_comp_id}`,
                `${resid.auth_asym_id}`,
                `${resid.auth_seq_id}${authorInsertionCode}`,
                // `${resid.label_asym_id}`,
                // `${labelSeqId}`,
              ],
            };
          });
          returnData.extraInfo.push({
            value: '',
            values: {
              // colNames: ['Molecule', 'Residue', 'Chain', 'Resid. Id (Auth)', 'Asym Id', 'Resid. Id'],
              colNames: ['Molecule', 'Residue', 'Chain', 'Resid. Id'],
              rows: residRows,
            },
            type: 'table',
            molstarInteractivity: true,
          });
        }
      }
    }
    // returnData.extraInfo.push({
    //   value: "",
    //   type: "kb-link",
    //   link: {
    //       txt: `Learn more about ${ccdId} in PDBe-KB`,
    //       src: `https://wwwdev.ebi.ac.uk/pdbe/connect/ligands/${ccdId}`
    //   }
    // });
    return returnData;
  }

  lastZoomedIn?: {
    entityId: string;
    authChainId: string;
    residues: {
      authBegin: string;
      authBeginIns: string;
      authEnd: string;
      authEndIns: string;
    }[];
  };
  async zoomCell(molstarSelection: {
    entityId: string;
    authChainId: string;
    residues: {
      authBegin: string;
      authBeginIns: string;
      authEnd: string;
      authEndIns: string;
    }[];
  }) {
    if (!this.lastZoomedIn || this.lastZoomedIn !== molstarSelection) {
      await focusLoci(this.molstarViewInstance, molstarSelection);
      this.lastZoomedIn = molstarSelection;
    } else {
      await unfocusLoci(this.molstarViewInstance);
      this.lastZoomedIn = undefined;
    }
  }

  async focusCell(molstarSelection: {
    entityId: string;
    authChainId: string;
    residues: {
      authBegin: string;
      authBeginIns: string;
      authEnd: string;
      authEndIns: string;
    }[];
  }) {
    await highlightLoci(this.molstarViewInstance, molstarSelection);
  }

  async unfocusCell() {
    await clearHighlightLoci(this.molstarViewInstance);
  }

  buttonsShowHide() {
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
}
