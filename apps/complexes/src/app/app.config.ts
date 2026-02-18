import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { ComplexEffects } from './store/complex.effects';
import { complexReducer } from './store/complex.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BaseHrefService } from '@pdbc/core';

export function initializeApp(baseHrefService: BaseHrefService) {
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
    provideEffects([ComplexEffects]),
    provideStore({ complex: complexReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [BaseHrefService], multi: true },
    BaseHrefService,
  ],
};
