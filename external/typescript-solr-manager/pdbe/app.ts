/// <reference path="../core/core.ts" />
/// <reference path="../core/manager.ts" />
/// <reference path="../core/store.ts" />
/// <reference path="../core/parameter.ts" />
namespace PDBe.SolrApp {
  export function escapeValue(value: string) {
    // If the field value has a space, colon, quotation mark or forward slash
    // in it, wrap it in quotes, unless it is a range query or it is already
    // wrapped in quotes.
    if (window.location.href.indexOf('text:') < 0) {
      if (value.match(/[ :\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
        return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      }
    } else {
      // else if it is a text search, don't put quotes around the search term when there is a space
      if (value.match(/[:\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
        return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      }
    }
    return value;
  }

  export const appManagers = AjaxSolr.createManagerStore(PDBe.SolrApp.managerConfig);

  //console.log(appManagers);
}
