import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pisaLogoConfig } from './pisa-constant';

@Component({
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule, PdbeHeaderLogoMenuComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly pisaLogoConfig = pisaLogoConfig;
  public readonly ccp4LogoSrc = this.assetUrl('assets/images/ccp4.png');

  public onStartButtonClicked(): void {
    const href = window.location.href;
    const hrefLink = href.split('/').slice(0, -1).join('/');
    window.open(hrefLink, '_self');
  }

  private assetUrl(path: string): string {
    const raw = (path ?? '').trim();
    if (!raw) return raw;

    // Absolute URL
    if (/^https?:\/\//i.test(raw)) return raw;

    // Normalize leading slashes for consistent checks
    const p = raw.replace(/^\/+/, ''); // removes one or many leading '/'

    // If caller already included the mount, return as absolute (prevents doubling)
    if (p === 'pdbe/pisa' || p.startsWith('pdbe/pisa/')) {
      return `/${p}`;
    }

    // Otherwise prefix with base href
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
    const base = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');

    return `${base}/${p}`;
  }
}
