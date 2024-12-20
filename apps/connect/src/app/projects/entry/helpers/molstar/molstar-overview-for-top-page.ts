import { Injectable } from '@angular/core';
import { MolstarBaseClass } from './molstar-base-class';
import { addRepresentationToComponent, changeComponentVisibility } from './molstar-helpers';
import { Color } from 'molstar/lib/mol-util/color';

@Injectable({
  providedIn: 'root',
})
export class MolstarOverviewForTopPage extends MolstarBaseClass {
  public async showDomainsWholeAssembly() {
    await changeComponentVisibility(this.molstarViewInstance(), 'whole-entry/polymer', false);
  }

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
