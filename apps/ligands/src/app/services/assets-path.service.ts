import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LigandsAssetPathService {
  public setAbsolutePath(partLink: string): string {
    return `${environment.baseUrl}pdbe-srv/pdbechem/chemicalCompound/${partLink}`;
  }
}
