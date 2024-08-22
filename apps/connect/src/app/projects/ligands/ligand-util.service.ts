import { Injectable } from '@angular/core';
import { LigandStructure } from './data-models/structure.model';

export interface StructureFilter {
  cofactorLike: boolean;
  reactantLike: boolean;
  drugLike: boolean;
  unannotated: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LigandUtilService {
  public filterStructures(data: LigandStructure[], values: StructureFilter): LigandStructure[] {
    let cofactorLike: LigandStructure[] = [];
    let drugLike: LigandStructure[] = [];
    let reactantLike: LigandStructure[] = [];
    let unannotated: LigandStructure[] = [];
    if (values.cofactorLike) {
      cofactorLike = data.filter((c) => c.annotations?.includes('cofactor-like')) ?? [];
    } else {
      cofactorLike = [];
    }

    if (values.drugLike) {
      drugLike = data.filter((c) => c.annotations?.includes('drug-like')) ?? [];
    } else {
      drugLike = [];
    }

    if (values.reactantLike) {
      reactantLike = data.filter((c) => c.annotations?.includes('reactant-like')) ?? [];
    } else {
      reactantLike = [];
    }

    if (values.unannotated) {
      unannotated = data.filter((c) => c.annotations === null || c.annotations.length === 0);
    } else {
      unannotated = [];
    }

    if (values.cofactorLike === false && values.drugLike === false && values.reactantLike === false && values.unannotated === false) {
      return data;
    }

    const result = [...cofactorLike, ...reactantLike, ...drugLike, ...unannotated];
    return result;
  }
}
