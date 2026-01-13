// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // gaTag: "UA-142778242-1",
  gaTag: "G-0F9Z9LKQ19",
  // plot_data: "assets/data/plot_data.json",
  plot_data: "https://wwwdev.ebi.ac.uk/pdbe/static/kb_statistics/plot_data.json",
  // partners_last_update: "assets/data/partners_last_update.json"
  partners_last_update: "https://wwwdev.ebi.ac.uk/pdbe/static/kb_statistics/partners_last_update.json"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
