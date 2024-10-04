import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BaseHrefService } from './base-href.service';

export function initializeApp(baseHrefService: BaseHrefService) {
  return () => baseHrefService.setBaseHref();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [BaseHrefService], multi: true },
    BaseHrefService,
  ],
};
