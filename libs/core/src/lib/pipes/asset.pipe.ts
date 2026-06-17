import { isPlatformBrowser } from '@angular/common';
import { inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';

@Pipe({
  name: 'asset',
  standalone: true, // optional if you’re using standalone components
})
export class AssetPipe implements PipeTransform {
  private readonly platformId = inject(PLATFORM_ID);

  transform(file: string): any {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const { hostname, pathname } = window.location;

    // Local dev
    if (hostname === 'localhost' || hostname.startsWith('127.')) {
      return `assets/${file}`;
    }

    // Complex Pages
    if (pathname.includes('complexes')) {
      return `complexes/assets/${file}`;
    }

    // Entry Pages
    // if (pathname.includes('chemicalCompound/show')) {
    //   return `/pdbe/entry/assets/${file}`;
    // }

    // Ligand Pages (pdbechem)
    if (pathname.includes('/pdbe-srv/pdbechem/')) {
      return `/pdbe-srv/pdbechem/chemicalCompound/${file}`;
    }

    // Default fallback
    return `assets/${file}`;
  }
}
