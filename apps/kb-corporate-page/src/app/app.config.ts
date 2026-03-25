import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

export function getBaseHref(): string {
  if (typeof window !== 'undefined') {
    const base = document.querySelector('base');
    return base ? base.getAttribute('href') || '/' : '/';
  }
  // Fallback for SSR
  return '/pdbe/pdbe-kb/';
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useFactory: () => getBaseHref() },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideClientHydration(withEventReplay()),
  ],
};
