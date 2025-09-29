import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MacromoleculesTabFacade {
  public async updateMolstarUI(event: any, molstarInstance: any, entityId: string, chainId: string) {
    molstarInstance.events.loadComplete.subscribe(async () => {
      const libColor = [255, 0, 0]; // [70, 130, 180];
      const bestChainColor = { r: libColor[0], g: libColor[1], b: libColor[2] };
      const defaultChainColor = { r: 231, g: 200, b: 200 };
      await molstarInstance.visual.select({ data: [{ auth_asym_id: chainId, color: bestChainColor }], nonSelectedColor: defaultChainColor });
    });

    switch (event.type) {
      case 'PDB.RNA.viewer.click':
        await molstarInstance.visual.focus([{ entity_id: entityId, auth_asym_id: chainId, residue_number: event.eventData.label_seq_id }]);
        break;
      case 'PDB.RNA.viewer.mouseover':
        await molstarInstance.visual.highlight({ data: [{ entity_id: entityId, auth_asym_id: chainId, residue_number: event.eventData.label_seq_id }] });
        break;
      case 'PDB.RNA.viewer.mouseout':
        await molstarInstance.visual.clearHighlight();
        break;
    }
  }
}
