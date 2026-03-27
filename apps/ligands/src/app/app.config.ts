import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { LigandEffects } from './store/ligand.effects';
import { ligandReducer } from './store/ligand.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { LigandsBaseHrefService } from './services/ligands-base-href.service';

export function initializeApp(baseHrefService: LigandsBaseHrefService) {
  return () => baseHrefService.setBaseHref();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideEffects([LigandEffects]),
    provideStore({ ligands: ligandReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [LigandsBaseHrefService], multi: true },
    LigandsBaseHrefService,
  ],
};
