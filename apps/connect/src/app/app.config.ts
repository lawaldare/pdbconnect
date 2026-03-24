import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { EntryEffects } from './entry/store/entry.effects';
import { entryReducer } from './entry/store/entry.reducer';
import { BaseHrefService } from '@pdbc/core';
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
    provideEffects([EntryEffects]),
    provideStore({ entry: entryReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [BaseHrefService], multi: true },
    BaseHrefService,
  ],
};
