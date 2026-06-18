import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { LigandEffects } from './store/ligand.effects';
import { ligandReducer } from './store/ligand.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideEffects([LigandEffects]),
    provideStore({ ligands: ligandReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    {
      provide: APP_BASE_HREF,
      useValue: isDevMode() ? '/' : '/pdbe-srv/pdbechem/chemicalCompound/',
    },
    provideClientHydration(withEventReplay()),
  ],
};
