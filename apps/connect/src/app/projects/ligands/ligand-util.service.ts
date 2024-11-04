import { inject, Injectable, signal } from '@angular/core';
import { Fragment, LigandStructure } from './data-models/structure.model';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { MatDialog } from '@angular/material/dialog';
import { LigandActions } from './store/ligand.actions';
import { LigandReleasedStatus } from './enums/ligand-release.enum';
import { DescriptionData } from './services/aggregated-api.service';
import { LigandStoreState } from './store/ligand-store.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NavSection, navSections } from './ligand.constant';

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
  private readonly globalStore = inject(Store<LigandStoreState>);
  private readonly router = inject(Router);

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

  private readonly mainNavSection = signal<NavSection[]>(navSections);
  public navSection = this.mainNavSection.asReadonly();

  public setNavSections(navs: NavSection[]): void {
    this.mainNavSection.update(() => navs);
  }

  public redirectLigandPages(description: DescriptionData): void {
    if (description.released === LigandReleasedStatus.OBSOLETE && description.superseded_by) {
      const text = `The chemical component you are trying to view (${description.ligandId}) has been obsoleted. You have been redirected to the component which superceded it.`;
      this.globalStore.dispatch(LigandActions.setEmptyPageText({ text }));
      this.router.navigate(['/chemicalCompound/show', description.superseded_by]);
      return;
    }

    if (description.released === LigandReleasedStatus.OBSOLETE) {
      const text = `The chemical component you are trying to view (${description.ligandId}) has been obsoleted. Please check back later.`;
      this.globalStore.dispatch(LigandActions.setEmptyPageText({ text }));
      return;
    }

    if (description.released === LigandReleasedStatus.HOLD) {
      const text = `The chemical component you are trying to view (${description.ligandId}) has not been released yet. Please check back later.`;
      this.globalStore.dispatch(LigandActions.setEmptyPageText({ text }));
      return;
    }
  }
}
