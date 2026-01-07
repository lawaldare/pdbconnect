import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as appSettings from "../app.settings";
import { Subject } from "rxjs";

declare var PDBeMolstarPlugin: any;
@Component({
    selector: "molstar-dialog-dialog",
    templateUrl: "./molstar-dialog.component.html",
    styleUrls: ["./molstar-dialog.component.css"],
    standalone: false
})
export class MolstarDialogComponent implements OnInit {
  componentDestroyed$: Subject<boolean> = new Subject();
  downloadApiData: any;
  serviceHook: any;
  downloadOrder = ["PDB", "assembly", "molecule", "validation", "SIFTS"];
  isExpanded = [true, false, false, false, false];
  pdbeUrl = "https://www.ebi.ac.uk/pdbe/";
  pdbeMolstar: any;

  constructor(
    public dialogRef: MatDialogRef<MolstarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.pdbeUrl = appSettings.pdbeUrl;
  }

  ngOnInit() {
    let fullscreen = false;
    let horizontal = true;
    if (window.screen.width <= 480) {
      fullscreen = true;
      horizontal = false;
    }

    const initParams = {
      moleculeId: this.dialogData.pdbId,
      pdbeUrl: this.pdbeUrl,
      loadMaps: true,
      validationAnnotation: true,
      domainAnnotation: true,
      symmetryAnnotation: true,
      expanded: fullscreen,
      landscape: horizontal,
      sequencePanel: true,
      hideQuickControls: ["expand"],
      loadingOverlay: true,
    };

    if (this.dialogData.assemblyId)
      initParams["assemblyId"] = this.dialogData.assemblyId;

    let ele = <HTMLInputElement>document.getElementById("app");

    this.pdbeMolstar = new PDBeMolstarPlugin();
    this.pdbeMolstar.render(ele, initParams);
  }

  closeDialog() {
    this.dialogRef.close("Close");
  }

  ngOnDestroy() {
    //Exit expand
    this.pdbeMolstar.canvas.toggleExpanded(false);
  }
}
