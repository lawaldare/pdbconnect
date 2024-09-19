import { inject, Injectable, signal } from '@angular/core';
import { Fragment, LigandStructure } from './data-models/structure.model';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { MatDialog } from '@angular/material/dialog';

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
  private readonly dialog = inject(MatDialog);

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

  public openMolstarDialog(fragment: Fragment, ligandId: string): void {
    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: {
        moleculeId: ligandId,
        atoms: fragment?.atoms[0] ?? [],
      },
    });
  }

  public downloadJSON(data: any, name: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public downloadTxt(data: any, name: string) {
    const fileContent = data.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private readonly fragments = signal<Fragment[]>([]);
  public currentFragments = this.fragments.asReadonly();

  setFragments(fragments: Fragment[]): void {
    this.fragments.update(() => fragments);
  }
}
