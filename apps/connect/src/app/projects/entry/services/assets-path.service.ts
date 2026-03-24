import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetPathService {
  public setAbsolutePath(partLink: string): string {
    return `${environment.baseUrl}pdbe/connect/${partLink}`;
  }

  public get setBasePath(): string {
    return `/pdbe/connect/`;
  }
}
