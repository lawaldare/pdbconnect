/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';

@Injectable()
export class PisaEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<PisaStoreState>);
}
