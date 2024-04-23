import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { ConfigService } from '@pdbe-lib/shared-services';
import { provideHttpClient } from '@angular/common/http';

export function initConfig(appConfig: ConfigService) {
  return () => appConfig.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
  ],
};
