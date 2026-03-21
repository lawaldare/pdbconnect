import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { APP_BASE_HREF } from '@angular/common'; // 👈 Import this
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: APP_BASE_HREF, useValue: '/pdbe/pdbe-kb/' }, // 👈 CRITICAL: Match your EBI sub-path
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
