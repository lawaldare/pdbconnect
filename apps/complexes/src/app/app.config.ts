import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { ComplexEffects } from './store/complex.effects';
import { complexReducer } from './store/complex.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BaseHrefService, ssrBrowserLogInterceptor } from '@pdbc/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export function initializeApp(baseHrefService: BaseHrefService) {
  return () => baseHrefService.setBaseHref();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([ssrBrowserLogInterceptor])),
    provideEffects([ComplexEffects]),
    provideStore({ complex: complexReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [BaseHrefService], multi: true },
    BaseHrefService,
    provideClientHydration(withEventReplay()),
  ],
};
