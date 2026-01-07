import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ThorService } from "../common/thor.service";

@Component({
    selector: "orcid-claim-dialog",
    templateUrl: "./orcid-claim-dialog.component.html",
    styleUrls: ["./orcid-claim-dialog.component.css"],
    standalone: false
})
export class OrcidClaimDialogComponent implements OnInit, OnDestroy {
  // claimData: any[];
  thorInfo: any;
  serviceAvailable = false;
  orcidPopupListener: any;
  successMessage = false;
  errorMessage = false;
  loading = false;
  selectedPdbIds = [];
  alreadyClaimedEntries = [];

  constructor(
    public renderer: Renderer2,
    public dialogRef: MatDialogRef<OrcidClaimDialogComponent>,
    private thorService: ThorService
  ) {
    //Initialise Thor
    this.thorInfo = Object.assign({}, thorService.getThorInfo());
    //Retry loading data if undefined
    if (
      typeof this.thorInfo.claimingInfoData == "undefined" ||
      this.thorInfo.thorInitError
    ) {
      thorService.loadClaimingInfo("PDB").subscribe(() => {
        this.thorInfo = Object.assign({}, thorService.getThorInfo());
      });
    }

    //Set service available flag
    if (typeof this.thorInfo == "undefined") {
      this.serviceAvailable = false;
    } else {
      this.serviceAvailable = true;
    }

    //subscribe to ORCiD popup close event
    this.orcidPopupListener = renderer.listen("window", "message", (event) => {
      if (event.data == "thor.popup.closed") {
        this.loading = true;
        thorService.loadClaimingInfo("PDB").subscribe(
          () => {
            // console.log(this.thorInfo);
            this.loading = false;
            this.thorInfo = Object.assign({}, thorService.getThorInfo());

            //checked for already claimed entries
            this.checkClaimedRecords();
          },
          (err) => {
            this.loading = false;
            this.thorInfo = Object.assign({}, thorService.getThorInfo());
          }
        );
      }
    });
  }

  checkClaimedRecords() {
    if (this.thorInfo.claimedIds.length > 0) {
      this.alreadyClaimedEntries = [];
      let actualEntriesToClaim = [];
      let actualClaimRequestData = {};
      this.thorInfo.entriesToClaim.forEach((idToClaim) => {
        if (this.thorInfo.claimedIds.indexOf(idToClaim) > -1) {
          this.alreadyClaimedEntries.push(idToClaim);
        } else {
          actualEntriesToClaim.push(idToClaim);
          actualClaimRequestData[idToClaim] =
            this.thorInfo.claimRequestData[idToClaim];
        }
      });

      this.thorInfo.entriesToClaim = actualEntriesToClaim;
      this.thorInfo.claimRequestData = actualClaimRequestData;
    }
  }

  ngOnInit() {
    this.checkClaimedRecords();
  }

  ngOnDestroy() {
    //Unsubscript the popup close listener
    if (typeof this.orcidPopupListener != "undefined") {
      this.orcidPopupListener();
    }
  }

  loginOrcid() {
    var rememberUser = false;
    var loginUrl = this.thorService.getLoginUrl(
      this.thorInfo.claimingInfoData["loginUrl"],
      rememberUser
    );

    //open in popup window
    window.open(loginUrl, "ORCID", "height=900,width=800");
  }

  triggerClaim() {
    this.loading = true;
    this.thorService.doBatchClaimRequest().subscribe(
      (claimResp) => {
        this.thorService.loadClaimingInfo("PDB");
        this.thorService.resetEntriesToClaim();
        this.loading = false;
        this.errorMessage = false;
        this.successMessage = true;

        setTimeout(() => {
          this.dialogRef.close();
        }, 1000);
      },
      (err) => {
        this.loading = false;
        this.successMessage = false;
        this.errorMessage = true;
      }
    );
  }
}
