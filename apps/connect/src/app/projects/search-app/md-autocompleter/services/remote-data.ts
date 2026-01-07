import { CompleterBaseData } from "./completer-base-data";
import { catchError, map, Subscription } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class RemoteData extends CompleterBaseData {
  private _remoteUrl: string;
  private remoteSearch: Subscription;
  private _urlFormater: (term: string) => string = null;
  private _dataField: string = null;
  private _headers: Headers;

  constructor(private http: HttpClient) {
    super();
  }

  public remoteUrl(remoteUrl: string) {
    this._remoteUrl = remoteUrl;
    return this;
  }

  public urlFormater(urlFormater: (term: string) => string) {
    this._urlFormater = urlFormater;
  }

  public dataField(dataField: string) {
    this._dataField = dataField;
  }

  public headers(headers: Headers) {
    this._headers = headers;
  }

  //Function to clean/encode special characters in the URL
  fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }

  escapeSplChars(str: string) {
    return str.replace(
      /(!|"|\&\&|\|\||\{|\}|\[|\]|\^|\~|\*|\+|\-|\/|\\|\?|\(|\)|:)/g,
      function ($1, $2) {
        return "\\" + $2;
      }
    );
  }

  escapeSpaces(str: string) {
    return str.replace(/\s+/g, function ($1, $2) {
      return "\\" + $1;
    });
  }

  public search(term: string): void {
    let qFieldMatch = this._remoteUrl.match(/facet\.field\=(.*)/);
    let qTerm = this.escapeSplChars(term);
    qTerm = qTerm.replace(/\s/g, "*");
    qTerm = qFieldMatch[1] + ":*" + this.fixedEncodeURIComponent(qTerm) + "*";

    this.cancel();
    // let params = {};
    let url = "";
    if (this._urlFormater) {
      url = this._urlFormater(term);
    } else {
      let encodedTerm = encodeURIComponent(term);
      url =
        this._remoteUrl +
        "&facet.contains.ignoreCase=true&facet.threads:-1&facet.contains=" +
        encodedTerm +
        "&q=" +
        qTerm;
      //url = this._remoteUrl; // + encodeURIComponent(term);
    }

    const options = {
      headers: new HttpHeaders(this._headers),
    };

    this.remoteSearch = this.http
      .get(url, options)
      .pipe(
        map((data: any) => {
          // let matchaes = this.extractValue(data, this._dataField);
          // return this.extractMatches(matchaes, term);

          let matches = [];
          for (let field in data.facet_counts.facet_fields) {
            if (data.facet_counts.facet_fields.hasOwnProperty(field)) {
              matches = data.facet_counts.facet_fields[field];
            }
          }

          // let filteredMatches = matches.filter(function(matches, i) {
          //    return (i % 2) === 0 && matches.match(new RegExp(term, 'gi'));
          // });

          let filteredMatches = [];
          matches.forEach((matchValue, i) => {
            if (i % 2 === 0) {
              let matchWithoutPipe = matchValue.split("|");
              let escapedVal = term.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"); //Bracket issue fix
              if (new RegExp(escapedVal, "gi").test(matchValue)) {
                filteredMatches.push({
                  title: matchWithoutPipe[0] + " (" + matches[i + 1] + ")",
                  originalObject: matchWithoutPipe[0],
                });
              }
            }
          });

          return filteredMatches;
        }),
        map((matches: any[]) => {
          let results = this.processResults(matches);
          this.next(results);
          return results;
        }),
        catchError((err) => {
          this.error(err);
          return null;
        })
      )
      .subscribe();
  }

  public cancel() {
    if (this.remoteSearch) {
      this.remoteSearch.unsubscribe();
    }
  }
}
