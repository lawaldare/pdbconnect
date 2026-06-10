import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { serverUrlInterceptor } from './services/server-url.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: APP_BASE_HREF,
      useValue: process.env['APP_BASE_HREF'] || '/pdbe-srv/pdbechem/chemicalCompound/',
    },
    provideHttpClient(withInterceptors([serverUrlInterceptor])),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
