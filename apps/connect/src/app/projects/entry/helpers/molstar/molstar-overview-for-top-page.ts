import { Injectable, Renderer2 } from '@angular/core';
import {
  getComponentList,
  changeRepresentationVisibility,
  MolstarBaseClass,
  UNSELECTED_CARB_COLORED_ALPHA,
  UNSELECTED_STICKS_GREY_ALPHA,
  UNSELECTED_CARTOON_GREY_ALPHA,
  SELECTED_CARTOON_COLOR_BY_ENTITY,
  SELECTED_STICKS_COLOR_BY_ENTITY,
  createStaticComponent,
  ELEMENT_COLORS_HEX,
  createComponent,
  removeComponent,
  UNSELECTED_CARTOON_COLOR_BY_ENTITY_ALPHA,
  UNSELECTED_STICKS_COLOR_BY_ENTITY_ALPHA,
  SELECTED_STICKS_COLOR_BY_ENTITY_SET25,
  UNSELECTED_STICKS_COLOR_BY_ENTITY_ALPHA_SET25,
  MolstarSelectionObj,
  MolstarSelectionObjResid,
  SELECTED_CARTOON_CUSTOM_COLOR,
  hexColorToMolstar,
  UNSELECTED_SPHERES_COLOR_BY_ENTITY_ALPHA,
  MolstarConfigObject,
  createNewPolymerComponent,
  REPR_NONSELECTION_POLYMER,
  LIGANDS_REPR_NONSELECTION_POLYMER,
  LIGANDS_REPR_SELECTION,
  LIGANDS_REPR_HIGHLIGHT,
} from '@pdbe-lib/molstar-for-apps';
import { addRepresentationToComponent, changeComponentVisibility } from '@pdbe-lib/molstar-for-apps';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { groupDomainSelectionsByAccession } from '../domain-helpers';
import { BehaviorSubject, firstValueFrom, interval, map, takeWhile, timeout } from 'rxjs';

/**
 * Usage:
 * const config = MOLSTAR_CONFIG_FACTORIES['OVERVIEW']({
 *   entryId: this.entryId(),
 *   assemblyId: assemblyToUse,
 * });
 */
export const MOLSTAR_CONFIG_FACTORIES: {
  [key: string]: (params: { entryId?: string; assemblyId?: string; symmetryView?: boolean; urlToDownload?: string }) => MolstarConfigObject;
} = {
  INITIAL: ({ entryId }) => ({
    moleculeId: entryId!,
    loadMaps: false,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: true,
    granularity: 'residue',
  }),
  OVERVIEW: ({ entryId, assemblyId }) => ({
    moleculeId: entryId!,
    assemblyId: assemblyId!,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: false,
  }),
  MODEL_QUALITY: ({ entryId }) => ({
    moleculeId: entryId!,
    loadMaps: false,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: true,
    granularity: 'residue',
  }),
  ASSEMBLIES: ({ entryId, assemblyId, symmetryView }) => ({
    moleculeId: entryId!,
    loadMaps: false,
    assemblyId: assemblyId!,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: true,
    validationAnnotation: false,
    symmetryAnnotation: symmetryView,
    granularity: 'residue',
  }),
  MACROMOLECULES: ({ entryId, assemblyId }) => ({
    moleculeId: entryId!,
    bgColor: { r: 255, g: 255, b: 255 },
    loadMaps: false,
    assemblyId: assemblyId!,
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: true,
    granularity: 'residue',
    validationAnnotation: false,
  }),
  LIGANDS: ({ urlToDownload }) => ({
    customData: {
      url: urlToDownload!,
      format: 'cif',
      binary: true,
    },
    loadMaps: true,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    landscape: true,
    subscribeEvents: true,
    granularity: 'residue',
    validationAnnotation: false,
  }),
  DOMAINS: ({ entryId, assemblyId }) => ({
    moleculeId: entryId,
    loadMaps: false,
    assemblyId: assemblyId,
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: [],
    // hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
    landscape: true,
    subscribeEvents: true,
    validationAnnotation: false,
    granularity: 'residue',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MolstarOverviewForTopPage extends MolstarBaseClass {
  /**
   * Component extends MolstarBaseClass and contains functions for
   * manipulating Molstar views specific to the overview tabs (page top)
   */

  public entryId?: string;
  public preferredAssemblyId?: string;
  public currentModelId$ = new BehaviorSubject<string>('1');
  public currentMolstarContainer?: string;
  public molstarViewerElement?: HTMLElement;
  private renderer?: Renderer2;

  public setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  public currentViewName = 'none';
  public addedRepresentationsAndIndexes: { [key: string]: number } = {};
  public hasCheckedComponents = false;
  private overviewDomainsCycleTimeout: ReturnType<typeof setTimeout> | null = null;
  private overviewDomainsCycleIndex = 0;
  public currentConfigName?: string;

  private enforceMolstarInContainer(containerName: string) {
    setTimeout(async () => {
      if (this.currentMolstarContainer === containerName) return;
      const containerElement = document.querySelector(`#${containerName}-molstar-container`);
      if (!containerElement) {
        console.warn('Mol*: Container element does not exist');
        return;
      }
      if (!this.molstarViewerElement) {
        console.warn('Mol*: Element does not exist');
        return;
      }
      await this.sendMolstarToContainer(containerName, containerElement as HTMLElement);
    }, 500); // Ensure Angular digest cycle has completed before proceeding
  }

  private async sendMolstarToContainer(containerName: string, containerElement: HTMLElement) {
    if (!this.renderer) {
      console.warn('Mol*: Renderer2 not set');
      return;
    }
    if (!containerElement) {
      console.warn('Mol*: Container element does not exist');
      return;
    }
    if (!this.molstarViewerElement) {
      console.warn('Mol*: Element does not exist');
      return;
    }

    const molstarElement = document.getElementById('molstar-element');

    const canvasExists = () => !!containerElement.querySelector('div.msp-viewport > canvas');

    // Step 1: Check if canvas already exists
    if (!canvasExists()) {
      // Move the molstar WebGL container into the child component
      this.renderer.appendChild(containerElement, this.molstarViewerElement);

      // Step 2: Wait until canvas appears (poll every 100ms, max 3 seconds)
      try {
        await firstValueFrom(
          interval(100).pipe(
            map(() => canvasExists()),
            takeWhile((exists) => !exists, true), // Continue until exists === true
            timeout(3000)
          )
        );
        // console.log('Canvas detected inside .msp-viewport!');
        this.currentMolstarContainer = containerName;
      } catch (err) {
        console.error('Timeout: Canvas did not appear within 3 seconds.');
        throw err;
      }
    } else {
      console.log('Canvas already exists, no action needed.');
    }
  }

  public async renderMolstarInitial() {
    const config = MOLSTAR_CONFIG_FACTORIES['INITIAL']({
      entryId: this.entryId!,
    });
    await this.enforceConfigLoaded('INITIAL', config);
  }

  public async resetMobileMolstarInitial() {
    await this.cleanView();
    await this.unfocusLoci();
  }

  public async renderMobileMolstarInitial() {
    const config = MOLSTAR_CONFIG_FACTORIES['INITIAL']({
      entryId: this.entryId,
    });

    this.molstarViewInstance.set(undefined);

    this.addedRepresentationsAndIndexes = {};
    await this.initMolstar(config, undefined, this.molstarViewerElement);
  }

  public async enforceConfigLoaded(configName: string, config: MolstarConfigObject, forceReset?: boolean) {
    if (!forceReset && this.currentConfigName === configName) return;
    if (this.molstarViewInstance()) {
      this.addedRepresentationsAndIndexes = {};
      await this.updateMolstar(config);
    } else {
      this.addedRepresentationsAndIndexes = {};
      await this.initMolstar(config, undefined, this.molstarViewerElement);
    }
    this.currentConfigName = configName;
  }

  public async checkAndCreateComponents(macromolecules: MacromoleculesRowData[], ligands: LigandsRowData[], modifications: LigandsRowData[]) {
    // get component list
    const componentList = await this.getComponentList();

    // check whether polymers exist and create if not
    const hasMacromolecules = macromolecules.length > 0;
    const hasPolymericComponent = componentList.indexOf('structure-component-static-polymer') > -1;
    if (hasMacromolecules && !hasPolymericComponent) {
      await createStaticComponent(this.molstarViewInstance(), 'polymer');
    }

    // check whether ligands and ions exist and create if not
    const elementKeys = Object.keys(ELEMENT_COLORS_HEX);
    const ligandsNoIons = ligands.filter((lig) => elementKeys.indexOf(lig.id) === -1);
    const ligandsIons = ligands.filter((lig) => elementKeys.indexOf(lig.id) > -1);

    const hasLigands = ligandsNoIons.length > 0;
    const hasLigandsComponent = componentList.indexOf('structure-component-static-ligand') > -1;

    if (hasLigands && !hasLigandsComponent) {
      await createStaticComponent(this.molstarViewInstance(), 'ligand');
    }

    const hasIons = ligandsIons.length > 0;
    const hasIonsComponent = componentList.indexOf('structure-component-static-ligand') > -1;

    if (hasIons && !hasIonsComponent) {
      await createStaticComponent(this.molstarViewInstance(), 'ion');
    }

    // check whether branched exist and create if not
    const carbohydrates = macromolecules.filter((mol) => mol.additionalData.molecule.molecule_type === 'carbohydrate polymer');
    const hasCarbohydrates = carbohydrates.length > 0;
    const hasBranchedComponent = componentList.indexOf('structure-component-static-branched') > -1;
    if (hasCarbohydrates && !hasBranchedComponent) {
      await createStaticComponent(this.molstarViewInstance(), 'branched');
    }

    // check whether non-standard exist and create if not
    const hasModifications = modifications.length > 0;
    const hasNonStandardComponent = componentList.indexOf('structure-component-static-non-standard') > -1;
    if (hasModifications && !hasNonStandardComponent) {
      await createStaticComponent(this.molstarViewInstance(), 'non-standard');
    }
    this.hasCheckedComponents = true;
  }

  public async initializeModelIdTracking(noObserver?: boolean) {
    if (!this.molstarViewerElement) return;

    const topLeftSelector = '.msp-plugin .msp-viewport-top-left-controls';

    const topLeftElement = this.molstarViewerElement.querySelector<HTMLElement>(topLeftSelector);
    if (!topLeftElement) return;

    const getSpanText = (): string | null => {
      const spanSelector = '.msp-plugin .msp-viewport-top-left-controls .msp-traj-controls > span';
      const span = document.querySelector<HTMLSpanElement>(spanSelector);
      return span?.textContent?.trim() ?? null;
    };

    const updateCurrentModelId = () => {
      if (!this.molstarViewerElement) return;
      const text = getSpanText();
      const match = text?.match(/Model (\d+) \/ \d+/);
      if (match && match[1]) {
        this.currentModelId$.next(match[1]);
      }
    };

    // Initial check
    updateCurrentModelId();
    if (noObserver) return;

    // 2. (Optional) Watch span text for mutation
    const observer = new MutationObserver(() => {
      updateCurrentModelId();
    });
    observer.observe(topLeftElement, { characterData: true, childList: true, subtree: true });
  }

  private async cleanView(noGreyout?: boolean, noResetView?: boolean) {
    this.closeVolumeInfo();

    noGreyout = noGreyout ? noGreyout : false;
    noResetView = noResetView ? noResetView : false;

    // Cancel previous timeout loop
    this.stopOverviewDomainCycle();

    // greyout everything
    if (!noGreyout) await this.greyoutEverything();

    // erase temporary component
    await removeComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary');

    // clear any ligand interactions
    await this.clearInteractions();

    if (noResetView) return;

    // reset camera to focus whole structure if sub selection or sub-sub selection
    // if (this.currentViewName.includes('/')) {
    await this.focusStructure();
    // partial wait so slow unfocus can execute before next camera focus
    await new Promise((resolve) => setTimeout(resolve, this.cameraDuration * 0.75));
    // } else {
    //   // direct unfocus
    //   await this.unfocusLoci();
    // }
  }

  private async greyoutEverything() {
    // greyout everything
    await this.viewRepresentationByName('structure-component-static-polymer', 'polymeric-cartoon-greyed-out', UNSELECTED_CARTOON_GREY_ALPHA);
    await this.viewRepresentationByName('structure-component-static-ligand', 'ligand-sticks-greyed-out', UNSELECTED_STICKS_GREY_ALPHA);
    await this.viewRepresentationByName('structure-component-static-ion', 'ion-sticks-greyed-out', UNSELECTED_STICKS_GREY_ALPHA);
    await this.viewRepresentationByName('structure-component-static-non-standard', 'non-standard-sticks-greyed-out', UNSELECTED_STICKS_GREY_ALPHA);
    await this.viewRepresentationByName('structure-component-static-branched', 'branched-polygon-greyed-out', UNSELECTED_CARB_COLORED_ALPHA);
    await this.viewRepresentationByName('structure-component-static-branched', 'branched-sticks-greyed-out', UNSELECTED_STICKS_GREY_ALPHA, false);
  }

  private async viewRepresentationByName(componentName: string, representationName: string, representation: any, doNotHideOthers?: boolean) {
    // if representation does not exist
    if (Object.keys(this.addedRepresentationsAndIndexes).indexOf(representationName) === -1) {
      // create new representation and hide all previous others by default
      const hideOthers = doNotHideOthers !== undefined ? doNotHideOthers : true;
      const reprIdx = await addRepresentationToComponent(this.molstarViewInstance(), componentName, representation, hideOthers);
      this.addedRepresentationsAndIndexes[representationName] = reprIdx as number;
    } else {
      // if representation exists
      const reprIdx = this.addedRepresentationsAndIndexes[representationName];
      const hideRepr = false;
      const hideOthers = doNotHideOthers !== undefined ? doNotHideOthers : true;
      // switch representation visibility to TRUE (hideRepr) and hide all previous others by default
      await changeRepresentationVisibility(this.molstarViewInstance(), componentName, hideRepr, reprIdx, hideOthers);
    }
  }

  public async checkOverviewReady() {
    if (!this.entryId || !this.preferredAssemblyId) {
      console.warn('Mol*: Unset entry id or preferred assembly id');
      return;
    }
    this.enforceMolstarInContainer('overview');
    const config = MOLSTAR_CONFIG_FACTORIES['OVERVIEW']({
      entryId: this.entryId!,
      assemblyId: this.preferredAssemblyId!,
    });
    await this.enforceConfigLoaded('OVERVIEW', config);
  }

  public async checkModelQualityReady() {
    if (!this.entryId) {
      console.warn('Mol*: Unset entry id');
      return;
    }
    this.enforceMolstarInContainer('model-quality');
    const config = MOLSTAR_CONFIG_FACTORIES['MODEL_QUALITY']({
      entryId: this.entryId!,
    });
    await this.enforceConfigLoaded('MODEL_QUALITY', config);
  }

  public async checkAssembliesReady(assemblyId: string, symmetryView: boolean) {
    if (!this.entryId) {
      console.warn('Mol*: Unset entry id');
      return;
    }
    this.enforceMolstarInContainer('assemblies');
    const config = MOLSTAR_CONFIG_FACTORIES['ASSEMBLIES']({
      entryId: this.entryId!,
      assemblyId: assemblyId,
      symmetryView: symmetryView,
    });
    await this.enforceConfigLoaded(`ASSEMBLIES-${assemblyId}`, config);
    this.initializeModelIdTracking(true);
  }

  public async checkMacromoleculesReady() {
    if (!this.entryId || !this.preferredAssemblyId) {
      console.warn('Mol*: Unset entry id or preferred assembly id');
      return;
    }
    this.enforceMolstarInContainer('macromolecules');
    const config = MOLSTAR_CONFIG_FACTORIES['MACROMOLECULES']({
      entryId: this.entryId!,
      assemblyId: this.preferredAssemblyId!,
    });
    await this.enforceConfigLoaded('MACROMOLECULES', config);
  }

  public async checkLigandsReady(urlToDownload: string, forceReset: boolean) {
    if (!urlToDownload) {
      console.warn('Mol*: Unset urlToDownload');
      return;
    }
    this.enforceMolstarInContainer('ligands');
    const config = MOLSTAR_CONFIG_FACTORIES['LIGANDS']({
      urlToDownload: urlToDownload,
    });
    await this.enforceConfigLoaded('LIGANDS', config, forceReset);
  }

  public async checkDomainsReady() {
    if (!this.entryId || !this.preferredAssemblyId) {
      console.warn('Mol*: Unset entry id or preferred assembly id');
      return;
    }
    this.enforceMolstarInContainer('domains');
    const config = MOLSTAR_CONFIG_FACTORIES['DOMAINS']({
      entryId: this.entryId!,
      assemblyId: this.preferredAssemblyId!,
    });
    await this.enforceConfigLoaded('DOMAINS', config);
  }

  public async renderOverviewPreferredAssembly() {
    // greyout everything but macromolecules
    await this.renderOverviewMacromolecules();
    // TODO: Show symmetry view if possible
  }

  public async renderOverviewMacromolecules() {
    // clean up view
    await this.cleanView();

    // show all macromolecules colored by entity id with
    // cartoon and illustrative surface for protein
    // cartoon for RNA/DNA
    // sticks for carbohydrates
    await this.viewRepresentationByName('structure-component-static-polymer', 'polymeric-cartoon-by-entityid', SELECTED_CARTOON_COLOR_BY_ENTITY);
  }

  public async renderOverviewSpecificMacromolecule(macromolecule: MacromoleculesRowData, macromoleculeIdx: number, chainIndex: number) {
    // TODO: create specific component for macromolecule that is deleted on updates
    const selection = macromolecule.additionalData.selections[chainIndex];

    // clean up view
    await this.cleanView(true);

    // show other macromolecules by SEMI TRANSPARENT colors
    await this.viewRepresentationByName('structure-component-static-polymer', 'polymeric-cartoon-by-entityid-alpha', UNSELECTED_CARTOON_COLOR_BY_ENTITY_ALPHA);

    if (macromolecule.additionalData.molecule.molecule_type !== 'carbohydrate polymer') {
      // create temporary component for macromolecule
      await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_CARTOON_COLOR_BY_ENTITY);
    } else {
      // create temporary component for macromolecule (carbohydrate)
      await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_STICKS_COLOR_BY_ENTITY);
    }

    // focus camera on macromolecule
    await this.focusLoci(selection);
  }

  public async renderOverviewLigands() {
    // clean up view
    await this.cleanView();

    // show ligands as sticks with carbon color by entity id and atom colors
    await this.viewRepresentationByName('structure-component-static-ligand', 'ligand-spheres-by-entityid', UNSELECTED_SPHERES_COLOR_BY_ENTITY_ALPHA);
    // show ions as sticks with element symbol coloring
    await this.viewRepresentationByName('structure-component-static-ion', 'ion-spheres-by-element', UNSELECTED_SPHERES_COLOR_BY_ENTITY_ALPHA);

    // show ligands as sticks with carbon color by entity id and atom colors
    await this.viewRepresentationByName('structure-component-static-ligand', 'ligand-sticks-by-entityid', SELECTED_STICKS_COLOR_BY_ENTITY, false);
    // show ions as sticks with element symbol coloring
    await this.viewRepresentationByName('structure-component-static-ion', 'ion-sticks-by-element', SELECTED_STICKS_COLOR_BY_ENTITY, false);
  }

  public async renderOverviewSpecificLigand(ligand: LigandsRowData, ligandIdx: number, ligandResidueIndex: number) {
    const selection = ligand.additionalData.selections[ligandResidueIndex];

    // clean up view
    await this.cleanView();

    // show other ligands as sticks with carbon color by entity id and atom colors SEMI TRANSPARENT
    await this.viewRepresentationByName('structure-component-static-ligand', 'ligand-sticks-by-entityid-alpha', UNSELECTED_STICKS_COLOR_BY_ENTITY_ALPHA);
    await this.viewRepresentationByName('structure-component-static-ion', 'ion-sticks-by-element-alpha', UNSELECTED_STICKS_COLOR_BY_ENTITY_ALPHA);

    // create temporary component for ligand
    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_STICKS_COLOR_BY_ENTITY);

    // focus camera on ligand
    await this.focusLoci(selection);
  }

  public async renderOverviewDomains(domainsOfResource: DomainsRowData[], domainColors: string[]) {
    // clean up view
    await this.cleanView();

    // // show other macromolecules by SEMI TRANSPARENT colors
    // await this.viewRepresentationByName(
    //   'structure-component-static-polymer',
    //   'polymeric-cartoon-by-entityid-alpha',
    //   UNSELECTED_CARTOON_COLOR_BY_ENTITY_ALPHA
    // );

    const domainColorsByAccession: { [key: string]: string } = {};
    for (let domainIdx = 0; domainIdx < domainsOfResource.length; domainIdx++) {
      const domain = domainsOfResource[domainIdx];
      domainColorsByAccession[domain.accessionName] = domainColors[domainIdx];
    }

    // split all current resource domain selections into list according to accession codes
    const selectionsByAccession: MolstarSelectionObj[][] = groupDomainSelectionsByAccession(domainsOfResource);

    if (selectionsByAccession.length === 1) {
      // if single accession code, show all domains as SOLID cartoon colors
      const selection = selectionsByAccession[0][0];

      const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
      domainRepresentation.colorParams.value = hexColorToMolstar(domainColors[0]);

      // create temporary component for modification
      await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, domainRepresentation);
      return;
    }

    const mergedSelections: MolstarSelectionObj[] = selectionsByAccession.map((sel: MolstarSelectionObj[]) => ({
      residues: sel.flatMap((s) => s.residues),
    }));

    if (mergedSelections.length === 0) {
      console.warn('No merged selections to cycle through.');
      return;
    }

    this.overviewDomainsCycleIndex = 0;

    const loop = async () => {
      const mergedSelection = mergedSelections[this.overviewDomainsCycleIndex];
      const selections = selectionsByAccession[this.overviewDomainsCycleIndex];
      const color = Object.values(domainColorsByAccession)[this.overviewDomainsCycleIndex];

      const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
      domainRepresentation.colorParams.value = hexColorToMolstar(color);

      await removeComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary');

      for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
        const selection = selections[selectionIdx];

        await createComponent(this.molstarViewInstance(), `structure-component-dynamic-temporary-${selectionIdx}`, selection, domainRepresentation);
      }

      await this.focusLoci(mergedSelection);

      this.overviewDomainsCycleIndex++;

      if (this.overviewDomainsCycleIndex === mergedSelections.length) {
        this.overviewDomainsCycleIndex = 0;
      }

      this.overviewDomainsCycleTimeout = setTimeout(loop, 2500); // Schedule next
    };

    loop(); // Start the loop
  }

  private stopOverviewDomainCycle() {
    if (this.overviewDomainsCycleTimeout) {
      clearTimeout(this.overviewDomainsCycleTimeout);
      this.overviewDomainsCycleTimeout = null;
    }
    this.overviewDomainsCycleIndex = 0;
  }

  public async renderOverviewSpecificDomain(domain: DomainsRowData, domainColor: string, domainIdx: number) {
    const selection = domain.additionalData.selections[0];

    // clean up view
    await this.cleanView();

    const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
    domainRepresentation.colorParams.value = hexColorToMolstar(domainColor);

    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, domainRepresentation);

    // focus camera on domain
    await this.focusLoci(selection);
  }

  public async renderOverviewModifications() {
    // clean up view
    await this.cleanView();

    // show modification as sticks with carbon color by entity id and atom colors
    await this.viewRepresentationByName('structure-component-static-non-standard', 'non-standard-sticks-colored', SELECTED_STICKS_COLOR_BY_ENTITY_SET25);
  }

  public async renderOverviewSpecificModification(modification: LigandsRowData, modificationIdx: number, modificationResidueIndex: number) {
    const selection = modification.additionalData.selections[modificationResidueIndex];

    // clean up view
    await this.cleanView();

    // show other modifications as sticks with carbon color by entity id and atom colors SEMI TRANSPARENT
    await this.viewRepresentationByName(
      'structure-component-static-non-standard',
      'non-standard-sticks-colored-alpha',
      UNSELECTED_STICKS_COLOR_BY_ENTITY_ALPHA_SET25
    );

    // create temporary component for modification
    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_STICKS_COLOR_BY_ENTITY_SET25);

    // focus camera on modification
    await this.focusLoci(selection);
  }

  public async renderModelQualityAllIssues(
    residuesWith1Outlier: MolstarSelectionObj,
    residuesWith2Outliers: MolstarSelectionObj,
    residuesWith3OrMoreOutliers: MolstarSelectionObj
  ) {
    await this.cleanView();

    const residue0Representation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residue0Representation.colorParams.value = hexColorToMolstar('#A9ABAA');
    residue0Representation.typeParams.alpha = 0.5;

    const residue1Representation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residue1Representation.colorParams.value = hexColorToMolstar('#E5E501');

    const residue2Representation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residue2Representation.colorParams.value = hexColorToMolstar('#DA6E03');

    const residue3Representation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residue3Representation.colorParams.value = hexColorToMolstar('#B2182B');

    // await this.viewRepresentationByName('structure-component-static-polymer', 'polymeric-cartoon-grey', residue0Representation);
    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', residuesWith1Outlier, residue1Representation);
    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary-1', residuesWith2Outliers, residue2Representation);
    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary-2', residuesWith3OrMoreOutliers, residue3Representation);
    await createNewPolymerComponent(this.molstarViewInstance(), 'model-quality-polymer', residue0Representation);
  }

  public async renderModelQualitySpecificIssue(residuesForSpecificOutlier: MolstarSelectionObj) {
    await this.cleanView();

    const residue0Representation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residue0Representation.colorParams.value = hexColorToMolstar('#A9ABAA');
    residue0Representation.typeParams.alpha = 0.5;

    const residueSpecificRepresentation = JSON.parse(JSON.stringify(SELECTED_CARTOON_CUSTOM_COLOR));
    residueSpecificRepresentation.colorParams.value = hexColorToMolstar('#B2182B');

    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', residuesForSpecificOutlier, residueSpecificRepresentation);

    await createNewPolymerComponent(this.molstarViewInstance(), 'model-quality-polymer', residue0Representation);
  }

  /**
   * Function closes Molstar modal that says:
   * "Streaming enabled, click on a residue or an atom to view the data."
   * when Ligands and Environments are open with Volume Streaming enabled
   */
  public closeVolumeInfo() {
    const volumeInfoSelector =
      'div.msp-layout-hide-top.msp-layout-hide-left.msp-layout-hide-right.msp-layout-hide-bottom > div > div > div.msp-highlight-toast-wrapper > div > div > div.msp-toast-hide > button';
    const volumeInfoEl = document.querySelector(volumeInfoSelector);
    if (volumeInfoEl) {
      (<HTMLElement>volumeInfoEl).click();
    }
  }

  public async renderTabsAssemblies() {
    // might change in future
    await this.renderOverviewMacromolecules();
  }

  public async renderTabsMacromolecules(macromolecule: MacromoleculesRowData, selection: MolstarSelectionObj) {
    await this.cleanView();

    if (macromolecule.additionalData.molecule.molecule_type !== 'carbohydrate polymer') {
      // create temporary component for macromolecule
      await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_CARTOON_COLOR_BY_ENTITY);
    } else {
      // create temporary component for macromolecule (carbohydrate)
      await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_STICKS_COLOR_BY_ENTITY);
    }

    // focus camera on macromolecule
    await this.focusLoci(selection);
  }

  public async renderTabsLigands(ligand: LigandsRowData, molstarSelection: MolstarSelectionObj) {
    // no need to clean up view if url used
    // await this.cleanView();
    const reprNonSelectionPolymer = ligand.type === 'ligand' ? LIGANDS_REPR_NONSELECTION_POLYMER : REPR_NONSELECTION_POLYMER;

    // set representations of anything other than selected ligand to non selection
    // await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-polymer', reprNonSelectionPolymer, true);
    await this.viewRepresentationByName('structure-component-static-polymer', 'polymer-for-ligand-view', reprNonSelectionPolymer);

    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-ligand', true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-ion', true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-non-standard', true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-branched', true);

    // finally create ligand component with selected representation
    await createComponent(this.molstarViewInstance(), `structure-component-dynamic-temporary`, molstarSelection, LIGANDS_REPR_SELECTION);
    await createComponent(this.molstarViewInstance(), `structure-component-dynamic-temporary-1`, molstarSelection, LIGANDS_REPR_HIGHLIGHT);
    // focus camera on ligand
    await this.focusLoci(molstarSelection);
  }

  public async renderTabsDomains(selection: MolstarSelectionObj) {
    await this.cleanView();

    // const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
    // domainRepresentation.colorParams.value = hexColorToMolstar(domainColor);

    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, SELECTED_CARTOON_COLOR_BY_ENTITY);

    // focus camera on domain
    await this.focusLoci(selection);
  }
}
