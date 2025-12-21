import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  private router = inject(Router);
  public onStartButtonClicked(): void {
    const href = window.location.href;
    const hrefLink = href.split('/').slice(0, -1).join('/');
    window.open(hrefLink, '_self');
  }
}
