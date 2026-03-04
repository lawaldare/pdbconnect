import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BaseHrefService } from './base-href.service';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ligandReducer } from './projects/ligands/store/ligand.reducer';
import { LigandEffects } from './projects/ligands/store/ligand.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ComplexEffects } from './projects/complex/store/complex.effects';
import { complexReducer } from './projects/complex/store/complex.reducer';
import { EntryEffects } from './projects/entry/store/entry.effects';
import { entryReducer } from './projects/entry/store/entry.reducer';
import { provideNativeDateAdapter } from '@angular/material/core';

export function initializeApp(baseHrefService: BaseHrefService) {
  return () => baseHrefService.setBaseHref();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideEffects([LigandEffects, ComplexEffects, EntryEffects]),
    provideStore({ ligand: ligandReducer, complex: complexReducer, entry: entryReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [BaseHrefService], multi: true },
    BaseHrefService,
  ],
};
