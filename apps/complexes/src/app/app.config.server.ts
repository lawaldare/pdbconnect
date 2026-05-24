import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_BASE_HREF } from '@angular/common';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: APP_BASE_HREF,
      // Read the environment variable directly at runtime. Fallback to local root if not set.
      useValue: process.env['APP_BASE_HREF'] || '/',
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
