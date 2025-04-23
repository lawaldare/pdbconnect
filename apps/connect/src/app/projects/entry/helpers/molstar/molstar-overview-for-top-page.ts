import { Injectable } from '@angular/core';
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
} from '@pdbe-lib/molstar-for-apps';
import { addRepresentationToComponent, changeComponentVisibility } from '@pdbe-lib/molstar-for-apps';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { groupDomainSelectionsByAccession } from '../domain-helpers';

@Injectable({
  providedIn: 'root',
})
export class MolstarOverviewForTopPage extends MolstarBaseClass {
  /**
   * Component extends MolstarBaseClass and contains functions for
   * manipulating Molstar views specific to the overview tabs (page top)
   */
  public currentViewName = 'none';
  public addedRepresentationsAndIndexes: { [key: string]: number } = {};

  public async checkAndCreateComponents(macromolecules: MacromoleculesRowData[], ligands: LigandsRowData[], modifications: LigandsRowData[]) {
    // get component list
    const componentList = await getComponentList(this.molstarViewInstance());

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
  }

  private async cleanView(noGreyout?: boolean) {
    noGreyout = noGreyout ? noGreyout : false;

    // Cancel previous timeout loop
    this.stopDomainCycle();

    // greyout everything
    if (!noGreyout) await this.greyoutEverything();

    // erase temporary component
    await removeComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary');

    // reset camera to focus whole structure if sub selection or sub-sub selection
    if (this.currentViewName.includes('/')) {
      await this.focusStructure();
    } else {
      await this.unfocusLoci();
    }
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
    // TODO: Check if component does not exist and create it if necessary using selections
    getComponentList(this.molstarViewInstance());

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

  public async viewPreferredAssembly() {
    if (!this.currentViewName.includes('Preferred Assembly')) {
      await this.showPreferredAssembly();
      this.currentViewName = 'Preferred Assembly';
    }
  }

  private async showPreferredAssembly() {
    // greyout everything but macromolecules
    await this.showAllMacromolecules();

    // TODO: Show symmetry view if possible
  }

  public async viewMacromolecules(macromolecule?: MacromoleculesRowData, macromoleculeIdx?: number, chainIndex?: number) {
    if (!this.currentViewName.includes('Macromolecules')) {
      await this.showAllMacromolecules();
      this.currentViewName = 'Macromolecules';
    }
    if (macromolecule !== undefined && macromoleculeIdx !== undefined) {
      if (chainIndex === undefined) chainIndex = 0;
      await this.showSpecificMacromolecule(macromolecule, macromoleculeIdx, chainIndex);
      this.currentViewName = `Macromolecules/${macromoleculeIdx}/${chainIndex}`;
    }
    return this.currentViewName;
  }

  private async showAllMacromolecules() {
    // clean up view
    await this.cleanView();

    // show all macromolecules colored by entity id with
    // cartoon and illustrative surface for protein
    // cartoon for RNA/DNA
    // sticks for carbohydrates
    await this.viewRepresentationByName('structure-component-static-polymer', 'polymeric-cartoon-by-entityid', SELECTED_CARTOON_COLOR_BY_ENTITY);
  }

  private async showSpecificMacromolecule(macromolecule: MacromoleculesRowData, macromoleculeIdx: number, chainIndex: number) {
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

  public async viewLigands(ligand?: LigandsRowData, ligandIdx?: number, ligandResidueIndex?: number) {
    if (!this.currentViewName.includes('Ligands')) {
      await this.showAllLigands();
      this.currentViewName = 'Ligands';
    }
    if (ligand !== undefined) {
      if (ligandIdx === undefined) throw 'ligandIdx required';
      if (ligandResidueIndex === undefined) ligandResidueIndex = 0;
      await this.showSpecificLigand(ligand, ligandIdx, ligandResidueIndex);
      this.currentViewName = `Ligands/${ligandIdx}/${ligandResidueIndex}`;
    }
    return this.currentViewName;
  }

  private async showAllLigands() {
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

  private async showSpecificLigand(ligand: LigandsRowData, ligandIdx: number, ligandResidueIndex: number) {
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

  public async viewDomains(domainsOfResource: DomainsRowData[], domainColors: string[], domain?: DomainsRowData, domainColor?: string, domainIdx?: number) {
    if (!this.currentViewName.includes('Domains')) {
      await this.showAllDomains(domainsOfResource, domainColors);
      this.currentViewName = 'Domains';
    }
    if (domain !== undefined) {
      if (domainColor === undefined) throw 'domainColor required';
      if (domainIdx === undefined) throw 'domainIdx required';
      await this.showSpecificDomain(domain, domainColor, domainIdx);
      this.currentViewName = `Domains/${domainIdx}`;
    }
    return this.currentViewName;
  }

  private domainCycleTimeout: ReturnType<typeof setTimeout> | null = null;
  private domainCycleIndex = 0;

  private async showAllDomains(domainsOfResource: DomainsRowData[], domainColors: string[]) {
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

    this.domainCycleIndex = 0;

    const loop = async () => {
      const mergedSelection = mergedSelections[this.domainCycleIndex];
      const selections = selectionsByAccession[this.domainCycleIndex];
      const color = Object.values(domainColorsByAccession)[this.domainCycleIndex];

      const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
      domainRepresentation.colorParams.value = hexColorToMolstar(color);

      await removeComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary');

      for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
        const selection = selections[selectionIdx];

        await createComponent(this.molstarViewInstance(), `structure-component-dynamic-temporary-${selectionIdx}`, selection, domainRepresentation);
      }

      await this.focusLoci(mergedSelection);

      this.domainCycleIndex++;

      if (this.domainCycleIndex === mergedSelections.length) {
        this.domainCycleIndex = 0;
      }

      this.domainCycleTimeout = setTimeout(loop, 2500); // Schedule next
    };

    loop(); // Start the loop
  }

  private stopDomainCycle() {
    if (this.domainCycleTimeout) {
      clearTimeout(this.domainCycleTimeout);
      this.domainCycleTimeout = null;
    }
    this.domainCycleIndex = 0;
  }

  private async showSpecificDomain(domain: DomainsRowData, domainColor: string, domainIdx: number) {
    const selection = domain.additionalData.selections[0];

    // clean up view
    await this.cleanView();

    const domainRepresentation = SELECTED_CARTOON_CUSTOM_COLOR as any;
    domainRepresentation.colorParams.value = hexColorToMolstar(domainColor);

    await createComponent(this.molstarViewInstance(), 'structure-component-dynamic-temporary', selection, domainRepresentation);

    // focus camera on modification
    await this.focusLoci(selection);
  }

  public async viewModifications(modification?: LigandsRowData, modificationIdx?: number, modificationResidueIndex?: number) {
    if (!this.currentViewName.includes('Modifications')) {
      await this.showAllModifications();
      this.currentViewName = 'Modifications';
    }
    if (modification !== undefined) {
      if (modificationIdx === undefined) throw 'modificationIdx required';
      if (modificationResidueIndex === undefined) modificationResidueIndex = 0;
      await this.showSpecificModification(modification, modificationIdx, modificationResidueIndex);
      this.currentViewName = `Modifications/${modificationIdx}/${modificationResidueIndex}`;
    }
    return this.currentViewName;
  }

  private async showAllModifications() {
    // clean up view
    await this.cleanView();

    // show modification as sticks with carbon color by entity id and atom colors
    await this.viewRepresentationByName('structure-component-static-non-standard', 'non-standard-sticks-colored', SELECTED_STICKS_COLOR_BY_ENTITY_SET25);
  }

  private async showSpecificModification(modification: LigandsRowData, modificationIdx: number, modificationResidueIndex: number) {
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

  // /**
  //  * When domains are shown in image gallery the whole assembly is hidden.
  //  * This function enables the whole assembly to be viewed
  //  */
  // public async showDomainsWholeAssembly() {
  //   await changeComponentVisibility(this.molstarViewInstance(), 'whole-entry/polymer', false);
  // }

  // /**
  //  * When ligands are shown in image gallery they are shown as spheres.
  //  * This function switches this representation to ball-and-stick
  //  */
  // public async showLigandsAsSticks(entityId: string, chemCompId: string, colorsFromMolj: { [key: string | number]: string }) {
  //   const ligandColor = colorsFromMolj[entityId];
  //   const hexColor = parseInt(ligandColor.replace(/^#/, ''), 16);

  //   if (chemCompId.length === 3) {
  //     const reprNonSelectionLigand = {
  //       type: 'ball-and-stick',
  //       color: 'element-symbol',
  //       colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
  //     };
  //     const componentName = `/entities/entity-${entityId}`;
  //     await addRepresentationToComponent(this.molstarViewInstance(), componentName, reprNonSelectionLigand, true);
  //   }
  // }
  // /**
  //  * When modifications are shown in image gallery they are shown as spheres.
  //  * This function switches this representation to ball-and-stick
  //  */
  // public async showModificationsAsSticks(imgName: string, colorsFromMolj: { [key: string | number]: string }) {
  //   const chemCompId = imgName.split('_')[2];
  //   const modificationColor = colorsFromMolj[chemCompId];
  //   const hexColor = parseInt(modificationColor.replace(/^#/, ''), 16);

  //   const reprNonSelectionLigand = {
  //     type: 'ball-and-stick',
  //     color: 'element-symbol',
  //     colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
  //   };
  //   const componentName = `/modified-residues/${chemCompId}`;
  //   await addRepresentationToComponent(this.molstarViewInstance(), componentName, reprNonSelectionLigand, true);
  // }
}
