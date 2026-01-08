import { Component, OnInit, Inject, OnDestroy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as appSettings from '../app.settings';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MolstarPluginService } from '@pdbe-lib/molstar-for-apps';

declare const PDBeMolstarPlugin: any;
@Component({
  selector: 'pdbc-molstar-dialog-dialog',
  templateUrl: './molstar-dialog.component.html',
  styleUrls: ['./molstar-dialog.component.scss'],
  imports: [CommonModule],
})
export class MolstarDialogComponent implements OnInit, OnDestroy {
  private readonly molstarPluginService = inject(MolstarPluginService);

  componentDestroyed$: Subject<boolean> = new Subject();
  downloadApiData: any;
  serviceHook: any;
  downloadOrder = ['PDB', 'assembly', 'molecule', 'validation', 'SIFTS'];
  isExpanded = [true, false, false, false, false];
  pdbeUrl = 'https://www.ebi.ac.uk/pdbe/';
  pdbeMolstar: any;

  constructor(
    public dialogRef: MatDialogRef<MolstarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.pdbeUrl = appSettings.pdbeUrl;
  }

  async ngOnInit() {
    let fullscreen = false;
    let horizontal = true;
    if (window.screen.width <= 480) {
      fullscreen = true;
      horizontal = false;
    }

    const initParams: any = {
      moleculeId: this.dialogData.pdbId,
      pdbeUrl: this.pdbeUrl,
      loadMaps: true,
      validationAnnotation: true,
      domainAnnotation: true,
      symmetryAnnotation: true,
      expanded: fullscreen,
      landscape: horizontal,
      sequencePanel: true,
      hideQuickControls: ['expand'],
      loadingOverlay: true,
      bgColor: { r: 255, g: 255, b: 255 },
    };

    if (this.dialogData.assemblyId) initParams['assemblyId'] = this.dialogData.assemblyId;

    const element = <HTMLInputElement>document.getElementById('app');

    await this.molstarPluginService.loadPlugin();
    const pluginInstance = this.molstarPluginService.createInstance();

    // this.pdbeMolstar = new PDBeMolstarPlugin();
    pluginInstance.render(element, initParams);
  }

  closeDialog() {
    this.dialogRef.close('Close');
  }

  ngOnDestroy() {
    //Exit expand
    this.pdbeMolstar.canvas.toggleExpanded(false);
  }
}
