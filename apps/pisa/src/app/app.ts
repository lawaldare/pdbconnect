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
  public onStartButtonClicked(): void {
    console.log('Start button clicked in App component');
  }
}
