import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  openApiJsonUrl: string;
  searchSchemaUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig;
  constructor(private http: HttpClient) {
    this.config = {} as AppConfig;
  }

  /**
   * Function loads configuration file from PDBe's Kubernetes Clusters that points to openapi.json for apidocs application
   * See:
   * 1. https://gitlab.ebi.ac.uk/pdbe/backend/k8s-deploy-configs/-/blob/main/apps/base/connect-apidocs/deployment.yaml?ref_type=heads#L34
   * 2. https://gitlab.ebi.ac.uk/search?search=app.config.json&nav_source=navbar&project_id=4103&group_id=473&search_code=true&repository_ref=main
   * @param isLocal param to make sure appConfig returns valid openapi.json URLs when testing this app in localhost
   * @returns
   */
  loadConfig(isLocal: boolean): Promise<any> {
    if (isLocal) {
      this.config = {
        openApiJsonUrl: '/assets/pdbe-openapi.json',
        searchSchemaUrl: 'https://www.ebi.ac.uk/pdbe/static/files/search_schema.json',
      };
      return Promise.resolve(this.config); // ✅
    }
    return firstValueFrom(this.http.get<AppConfig>('app.config.json')).then((config) => {
      this.config = config;
    });
  }

  getConfig(): AppConfig {
    return this.config;
  }
}
