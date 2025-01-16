// processPDBRedoQualityScores(data: PDBRedoQualityScores, typeToProcess: 'geometry' | 'modelfit' | 'basepairs') {
//     // Taken from: https://github.com/PDBeurope/pdb-redo/blob/master/src/app/index.ts#L55-L86
//     // and https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/web-app/js/widgets/validation_summary.js#L204-233
//     let dataToProcess:
//       | {
//           drmsz?: number;
//           zdfree?: number;
//           dzscore?: number;
//           'range-lower': number;
//           'range-upper': number;
//         }
//       | undefined = undefined;
//     let score: number | undefined = undefined;
//     if (typeToProcess === 'geometry') {
//       dataToProcess = data.geometry;
//       if (!dataToProcess) {
//         return undefined;
//       }
//       score = dataToProcess.dzscore!;
//     } else if (typeToProcess === 'modelfit') {
//       dataToProcess = data.ddatafit;
//       if (!dataToProcess) {
//         return undefined;
//       }
//       score = dataToProcess.zdfree!;
//     }
//     // else if (typeToProcess === "basepairs") {
//     else {
//       dataToProcess = data['base-pairs'];
//       if (!dataToProcess) {
//         return undefined;
//       }
//       score = dataToProcess.drmsz;
//     }
//     if (!score) {
//       return undefined;
//     }

import { Injectable } from '@angular/core';

//     const dataRange = dataToProcess['range-upper'] - dataToProcess['range-lower'];
//     const dataUnitRange = dataRange / 5;

//     let subtractor = 1;
//     for (let i = 4; i > 0; i--) {
//       if (score > dataToProcess['range-upper'] - dataUnitRange * subtractor) {
//         return i;
//       }
//       subtractor++;
//     }
//     return 0;
// }

// TODO: Code facade for struc quality gradients properly
@Injectable({
  providedIn: 'root',
})
export class StrucQualityGradientsComponentFacade {
  //     if (data.PDBRedoQualityScores) {
  //         PDBRedoQualityScores = {
  //           geometry: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'geometry'),
  //           modelfit: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'modelfit'),
  //         };
  //         if (data.PDBRedoQualityScores['base-pairs']) PDBRedoQualityScores['basepairs'] = this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'basepairs');
  //       }
}
