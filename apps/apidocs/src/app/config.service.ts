import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  openApiJsonUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig;
  constructor(private http: HttpClient) {
    this.config = {} as AppConfig;
  }

  loadConfig(): Promise<any> {
    return firstValueFrom(this.http.get<AppConfig>('app.config.json')).then((config) => {
      this.config = config;
    });
  }

  getConfig(): AppConfig {
    return this.config;
  }
}
