import { Injectable } from '@angular/core';
import { MolstarBaseClass } from './molstar-base-class';
import { addRepresentationToComponent, changeComponentVisibility } from './molstar-helpers';
import { Color } from 'molstar/lib/mol-util/color';

@Injectable({
  providedIn: 'root',
})
export class MolstarOverviewForTopPage extends MolstarBaseClass {
  /**
   * Component extends MolstarBaseClass and contains functions for
   * manipulating Molstar views specific to the overview tabs (page top)
   */

  /**
   * When domains are shown in image gallery the whole assembly is hidden.
   * This function enables the whole assembly to be viewed
   */
  public async showDomainsWholeAssembly() {
    await changeComponentVisibility(this.molstarViewInstance(), 'whole-entry/polymer', false);
  }

  /**
   * When ligands are shown in image gallery they are shown as spheres.
   * This function switches this representation to ball-and-stick
   */
  public async showLigandsAsSticks(entityId: string, chemCompId: string, colorsFromMolj: { [key: string | number]: string }) {
    const ligandColor = colorsFromMolj[entityId];
    const hexColor = parseInt(ligandColor.replace(/^#/, ''), 16);

    if (chemCompId.length === 3) {
      const reprNonSelectionLigand = {
        type: 'ball-and-stick',
        color: 'element-symbol',
        colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
      };
      const componentName = `/entities/entity-${entityId}`;
      await addRepresentationToComponent(this.molstarViewInstance(), componentName, reprNonSelectionLigand, true);
    }
  }
  /**
   * When modifications are shown in image gallery they are shown as spheres.
   * This function switches this representation to ball-and-stick
   */
  public async showModificationsAsSticks(imgName: string, colorsFromMolj: { [key: string | number]: string }) {
    const chemCompId = imgName.split('_')[2];
    const modificationColor = colorsFromMolj[chemCompId];
    const hexColor = parseInt(modificationColor.replace(/^#/, ''), 16);

    const reprNonSelectionLigand = {
      type: 'ball-and-stick',
      color: 'element-symbol',
      colorParams: { carbonColor: { name: 'uniform', params: { value: Color(hexColor) } } },
    };
    const componentName = `/modified-residues/${chemCompId}`;
    await addRepresentationToComponent(this.molstarViewInstance(), componentName, reprNonSelectionLigand, true);
  }
}
