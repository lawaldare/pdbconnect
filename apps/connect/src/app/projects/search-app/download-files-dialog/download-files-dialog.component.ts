import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DownloadService } from "../common/download.service";
import { Subject, takeUntil } from "rxjs";

declare var gtag: any;

@Component({
    selector: "download-files-dialog",
    templateUrl: "./download-files-dialog.component.html",
    styleUrls: ["./download-files-dialog.component.css"],
    standalone: false
})
export class DownloadFilesDialogComponent implements OnInit {
  componentDestroyed$: Subject<boolean> = new Subject();
  downloadApiData: any;
  serviceHook: any;
  downloadOrder = ["PDB", "map", "assembly", "molecule", "validation", "SIFTS"];
  isExpanded = [true, false, false, false, false];
  availableLabels = [];

  constructor(
    private downloadService: DownloadService,
    public dialogRef: MatDialogRef<DownloadFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit() {
    //Get view and download file details from api
    this.serviceHook = this.downloadService
      .downloadFilesInfo(this.dialogData.pdbId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        if (res && res[this.dialogData.pdbId]) {
          this.formatDownloadJson(res[this.dialogData.pdbId]);
        }
      });
  }

  formatDownloadJson(respJson) {
    let formattedData = {};
    this.availableLabels = [];

    this.downloadOrder.forEach((category, ci) => {
      if (typeof respJson[category] != "undefined") {
        formattedData[category] = {};
        this.availableLabels[ci] = [];

        //Assign download url
        if (typeof respJson[category].downloads != "undefined") {
          respJson[category].downloads.forEach((downloadRec) => {
            formattedData[category][downloadRec.label] = {};
            formattedData[category][downloadRec.label]["downloadUrl"] =
              downloadRec.url;

            //Add available label
            if (this.availableLabels[ci].indexOf(downloadRec.label) == -1)
              this.availableLabels[ci].push(downloadRec.label);
          });
        }

        //Assign view url
        if (typeof respJson[category].views != "undefined") {
          respJson[category].views.forEach((viewRec) => {
            if (typeof formattedData[category][viewRec.label] == "undefined")
              formattedData[category][viewRec.label] = {};
            formattedData[category][viewRec.label]["viewUrl"] = viewRec.url;

            //Add available label
            if (this.availableLabels[ci].indexOf(viewRec.label) == -1)
              this.availableLabels[ci].push(viewRec.label);
          });
        }
      }
    });

    this.downloadApiData = formattedData;
  }

  headingClick(index) {
    if (this.isExpanded[index] == true) {
      this.isExpanded[index] = false;
      return;
    }

    this.isExpanded[this.isExpanded.indexOf(true)] = false;

    this.isExpanded[index] = !this.isExpanded[index];

    gtag("event", "download_files_dialog_toggle_section");
  }

  closeDialog() {
    gtag("event", "download_files_dialog_close");

    this.dialogRef.close("Cancel");
  }

  captureUserAction(action) {
    const formattedAction = action
      .toLowerCase()
      .replace("(", "")
      .replace(")", "")
      .replace(";", "");
    gtag("event", "download_files_" + formattedAction);
  }

  ngOnDestroy() {
    this.serviceHook.unsubscribe();
    this.serviceHook = undefined;
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
