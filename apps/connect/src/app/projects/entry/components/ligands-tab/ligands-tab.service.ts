/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class LigandsTabService {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly _ligandMonomers$ = this.globalStore.select(EntrySelectors.ligandMonomers).pipe(
    filter(Boolean),
    filter((ligandMonomers) => !(<any>ligandMonomers).empty),
    map((ligandMonomers) => {
      const result: any = {};

      ligandMonomers.forEach((item) => {
        const chemCompId = item.chem_comp_id;

        if (!result[chemCompId]) {
          result[chemCompId] = new Set();
        }

        item.annotations.forEach((annotation) => {
          result[chemCompId].add(annotation.type);
        });
      });

      // Convert sets to arrays
      Object.keys(result).forEach((key) => {
        result[key] = Array.from(result[key]);
      });

      return result;
    })
  );
  public ligandMonomers = toSignal(this._ligandMonomers$);
  private readonly _modifications$ = this.globalStore.select(EntrySelectors.modifications).pipe(
    filter(Boolean),
    filter((modifications) => !(<any>modifications).empty),
    map((modifications) => {
      const uniqueIds = new Set();

      modifications.forEach((item) => {
        uniqueIds.add(item.chem_comp_id);
      });

      return Array.from(uniqueIds);
    })
  );
  public modifications = toSignal(this._modifications$);
}
