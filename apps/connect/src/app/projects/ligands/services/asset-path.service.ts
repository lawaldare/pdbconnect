import { Injectable, Inject, InjectionToken } from '@angular/core';

@Injectable()
export class AssetPathService {
  constructor(@Inject(ASSET_BASE_PATH) private basePath: string) {}

  getAssetUrl(file: string): string {
    return `${this.basePath}${file}`;
  }
}

export const ASSET_BASE_PATH = new InjectionToken<string>('ASSET_BASE_PATH');
