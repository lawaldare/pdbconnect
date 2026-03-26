import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { ConfigService } from '@pdbe-lib/shared-services';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

export function initializeApp(appConfig: ConfigService) {
  return () => {
    // runtime hostname detection so this works on nx serve and build
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // isLocal makes sure appConfig returns openapi.json URLs when testing locally
    return appConfig.loadConfig(isLocal);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
};
