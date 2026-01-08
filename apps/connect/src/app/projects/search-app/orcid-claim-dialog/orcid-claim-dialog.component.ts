import { Component, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ThorService } from '../common/thor.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-orcid-claim-dialog',
  templateUrl: './orcid-claim-dialog.component.html',
  styleUrls: ['./orcid-claim-dialog.component.css'],
  imports: [CommonModule, MaterialModule],
})
export class OrcidClaimDialogComponent implements OnInit, OnDestroy {
  private readonly thorService = inject(ThorService);
  private readonly dialogRef = inject(MatDialogRef<OrcidClaimDialogComponent>);
  private readonly renderer = inject(Renderer2);
  // claimData: any[];
  thorInfo: any;
  serviceAvailable = false;
  orcidPopupListener: any;
  successMessage = false;
  errorMessage = false;
  loading = false;
  selectedPdbIds: any[] = [];
  alreadyClaimedEntries: any[] = [];

  constructor() {
    //Initialise Thor
    this.thorInfo = Object.assign({}, this.thorService.getThorInfo());
    //Retry loading data if undefined
    if (typeof this.thorInfo.claimingInfoData == 'undefined' || this.thorInfo.thorInitError) {
      this.thorService.loadClaimingInfo('PDB').subscribe(() => {
        this.thorInfo = Object.assign({}, this.thorService.getThorInfo());
      });
    }

    //Set service available flag
    if (typeof this.thorInfo == 'undefined') {
      this.serviceAvailable = false;
    } else {
      this.serviceAvailable = true;
    }

    //subscribe to ORCiD popup close event
    this.orcidPopupListener = this.renderer.listen('window', 'message', (event: any) => {
      if (event.data == 'thor.popup.closed') {
        this.loading = true;
        this.thorService.loadClaimingInfo('PDB').subscribe(
          () => {
            // console.log(this.thorInfo);
            this.loading = false;
            this.thorInfo = Object.assign({}, this.thorService.getThorInfo());

            //checked for already claimed entries
            this.checkClaimedRecords();
          },
          (err) => {
            this.loading = false;
            this.thorInfo = Object.assign({}, this.thorService.getThorInfo());
          }
        );
      }
    });
  }

  checkClaimedRecords() {
    if (this.thorInfo.claimedIds.length > 0) {
      this.alreadyClaimedEntries = [];
      const actualEntriesToClaim: any[] = [];
      const actualClaimRequestData: any = {};
      this.thorInfo.entriesToClaim.forEach((idToClaim: any) => {
        if (this.thorInfo.claimedIds.indexOf(idToClaim) > -1) {
          this.alreadyClaimedEntries.push(idToClaim);
        } else {
          actualEntriesToClaim.push(idToClaim);
          actualClaimRequestData[idToClaim] = this.thorInfo.claimRequestData[idToClaim];
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
    if (typeof this.orcidPopupListener != 'undefined') {
      this.orcidPopupListener();
    }
  }

  loginOrcid() {
    const rememberUser = false;
    const loginUrl = this.thorService.getLoginUrl(this.thorInfo.claimingInfoData['loginUrl'], rememberUser);

    //open in popup window
    window.open(loginUrl, 'ORCID', 'height=900,width=800');
  }

  triggerClaim() {
    this.loading = true;
    this.thorService.doBatchClaimRequest().subscribe(
      (claimResp) => {
        this.thorService.loadClaimingInfo('PDB');
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
