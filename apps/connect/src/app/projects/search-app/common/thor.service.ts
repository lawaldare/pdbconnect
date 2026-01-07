import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import * as appSettings from "../app.settings";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, of } from "rxjs";

@Injectable()
export class ThorService {
  oauthclient = "DEFAULT";
  orcIdWork: any;

  thorInfo = {
    claimingInfoData: undefined,
    userData: undefined,
    thorInitError: false,
    entriesToClaim: [],
    claimRequestData: {},
    claimedIds: [],
  };

  //THOR api url variables
  wsClaimingUrl: string;
  wsAddWorkUrl: string;
  wsAddBatchWorkUrl: string;
  wsGetClaimDataByIdsUrl: string;
  wsGetSingleClaimData: string;

  constructor(private location: Location, private http: HttpClient) {
    // Thor Hub Project WebService to get claiming information
    this.wsClaimingUrl = appSettings.thorUrl + "api/dataclaiming/claiming";

    // Thor Hub Project WebService to claim new work
    this.wsAddWorkUrl = appSettings.thorUrl + "api/dataclaiming/claimWork";

    // Thor Hub Project WebService to claim new work
    this.wsAddBatchWorkUrl =
      appSettings.thorUrl + "api/dataclaiming/claimWorkBatch";

    // Webservice to get claiming data by pdbIds
    this.wsGetClaimDataByIdsUrl =
      appSettings.thorUrl + "api/dataclaiming/findClaimByDataset/PDB";

    // Webservice to get single entry claim data
    this.wsGetSingleClaimData =
      appSettings.thorUrl + "api/orcid/find/pdb-self:";
  }

  resetEntriesToClaim() {
    this.thorInfo.entriesToClaim = [];
    this.thorInfo.claimRequestData = {};
  }

  getThorInfo() {
    return this.thorInfo;
  }

  buildUrl(base, key, value) {
    var sep = base.indexOf("?") > -1 ? "&" : "?";
    return base + sep + key + "=" + value;
  }

  getServerNamePort() {
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    return result;
  }

  loadClaimingInfo(dbName) {
    //set oauthclient
    if (typeof dbName != "undefined" && dbName != "") this.oauthclient = dbName;

    //build url
    var url = this.buildUrl(
      this.wsClaimingUrl,
      "clientAddress",
      this.getServerNamePort()
    );

    // To load the claiming information we only need the dataset Id
    // and avoid sending long fields such as description.
    var orcIdWorkAux = {};
    if (typeof this.orcIdWork != "undefined") {
      orcIdWorkAux = {
        workExternalIdentifiers: this.orcIdWork.workExternalIdentifiers,
      };
    }

    url = url + "&ordIdWorkJson=" + JSON.stringify(orcIdWorkAux);

    const options = {
      headers: new HttpHeaders({
        oauthclient: this.oauthclient,
      }),
      withCredentials: true,
    };
    return this.http.get(url, options).pipe(
      map((resp) => {
        if (typeof resp != "undefined" && resp != "" && resp != null) {
          this.thorInfo.claimingInfoData = resp;
          this.thorInfo.userData = resp["orcIdRecord"];
        }
        //save claimed PDB Ids
        if (
          typeof resp["orcIdRecord"] != "undefined" &&
          resp["orcIdRecord"] != null &&
          resp["orcIdRecord"].works != null &&
          resp["orcIdRecord"].works.length > 0
        ) {
          resp["orcIdRecord"].works.forEach((workRec) => {
            if (
              typeof workRec.workExternalIdentifiers != "undefined" &&
              workRec.workExternalIdentifiers.length > 0 &&
              workRec.workExternalIdentifiers[0].workExternalIdentifierType ==
                "pdb"
            ) {
              this.thorInfo.claimedIds.push(
                workRec.workExternalIdentifiers[0].workExternalIdentifierId
              );
            }
          });
        }
        return resp;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  doBatchClaimRequest() {
    const options = {
      headers: new HttpHeaders({
        oauthclient: this.oauthclient,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      withCredentials: true,
    };
    let dataArr = [];
    for (let dataKey in this.thorInfo.claimRequestData) {
      dataArr.push(this.thorInfo.claimRequestData[dataKey]);
    }

    let body = JSON.stringify({ orcIdWorkLst: dataArr });
    return this.http.post(this.wsAddBatchWorkUrl, body, options).pipe(
      map((response) => response),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getLoginUrl(dataUrlValue, remember) {
    var url = dataUrlValue;
    // adds remember me checked to loginlink
    if (remember) {
      url = this.buildUrl(url, "remind", "true");
    }
    // Add client server name + port to login URL so the javascript from server
    // can communicate via postMessage with the javascript from client.
    if (url != "") {
      url = this.buildUrl(url, "clientAddress", this.getServerNamePort());
    }
    return url;
  }

  getClaimDataByIdentifier(identifiers) {
    const options = {
      headers: new HttpHeaders({
        oauthclient: this.oauthclient,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      withCredentials: true,
    };

    let body = JSON.stringify({ orcIdWorkLst: identifiers });
    return this.http.post(this.wsGetClaimDataByIdsUrl, body, options).pipe(
      map((response) => response),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getSingleClaimData(pdbId) {
    const options = {
      headers: new HttpHeaders({
        oauthclient: this.oauthclient,
      }),
      withCredentials: true,
    };
    return this.http.get(this.wsGetSingleClaimData + "" + pdbId, options).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
