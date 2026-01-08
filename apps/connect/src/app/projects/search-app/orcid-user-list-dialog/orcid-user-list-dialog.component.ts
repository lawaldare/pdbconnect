import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThorService } from '../common/thor.service';
import * as appSettings from '../app.settings';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-orcid-user-list-dialog',
  templateUrl: './orcid-user-list-dialog.component.html',
  styleUrls: ['./orcid-user-list-dialog.component.css'],
  imports: [CommonModule, MaterialModule],
})
export class OrcidUserListDialogComponent implements OnInit {
  thorInfo: any;
  heading!: string;
  list!: any[];
  currentUserClaimLflag = false;
  loadingData = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public entryData: any,
    private thorService: ThorService
  ) {
    //Initialise Thor
    this.thorInfo = Object.assign({}, thorService.getThorInfo());
    //Retry loading data if undefined
    if (typeof this.thorInfo.claimingInfoData == 'undefined' || this.thorInfo.thorInitError) {
      thorService.loadClaimingInfo('PDB').subscribe(() => {
        this.thorInfo = Object.assign({}, thorService.getThorInfo());
      });
    }
  }

  ngOnInit() {
    this.loadingData = true;
    this.currentUserClaimLflag = false;
    this.list = [];
    //Get claim details for the pdb id
    /*this.thorService.getSingleClaimData(this.entryData.pdbId).then((orchidRespData)=>{
      this.currentUserClaimLflag = false;

      if(orchidRespData['orcid-search-results']['num-found'] > 0){

          for(var uli=0; uli < orchidRespData['orcid-search-results']['num-found']; uli++){

            if(orchidRespData['orcid-search-results']['num-found'] == 1){
              var userOrcId = orchidRespData['orcid-search-results']['orcid-search-result']['orcid-profile']['orcid-identifier']['path'];
              var userOrcUrl = orchidRespData['orcid-search-results']['orcid-search-result']['orcid-profile']['orcid-identifier']['uri'];
              var userFamilyName = orchidRespData['orcid-search-results']['orcid-search-result']['orcid-profile']['orcid-bio']['personal-details']['family-name']['value'];
              var userGivenNames = orchidRespData['orcid-search-results']['orcid-search-result']['orcid-profile']['orcid-bio']['personal-details']['given-names']['value'];
              var userOrcName = userGivenNames+' '+userFamilyName;
            }else{
              var userOrcId = orchidRespData['orcid-search-results']['orcid-search-result'][uli]['orcid-profile']['orcid-identifier']['path'];
              var userOrcUrl = orchidRespData['orcid-search-results']['orcid-search-result'][uli]['orcid-profile']['orcid-identifier']['uri'];
              var userFamilyName = orchidRespData['orcid-search-results']['orcid-search-result'][uli]['orcid-profile']['orcid-bio']['personal-details']['family-name']['value'];
              var userGivenNames = orchidRespData['orcid-search-results']['orcid-search-result'][uli]['orcid-profile']['orcid-bio']['personal-details']['given-names']['value'];
              var userOrcName = userGivenNames+' '+userFamilyName;
            }

            if(this.thorInfo.userData != null &&  this.thorInfo.userData.orcId == userOrcId){
              this.currentUserClaimLflag = true;
            }else{
              this.list.push({
                name: userOrcName,
                url: userOrcUrl
              });
            }

          }
      }

      this.loadingData = false;

    }, (err) => this.loadingData = false );*/
    const totalClaims = this.entryData.claimData.length;
    for (let uli = 0; uli < totalClaims; uli++) {
      if (this.thorInfo.userData != null && this.thorInfo.userData.orcId == this.entryData.claimData[uli].orcId) {
        this.currentUserClaimLflag = true;
      } else {
        this.list.push({
          name: this.entryData.claimData[uli].givenName + ' ' + this.entryData.claimData[uli].familyName,
          url: appSettings.pdbeUrl + 'entry/timeline/' + this.entryData.claimData[uli].orcId,
        });
      }
    }

    this.loadingData = false;
  }
}
