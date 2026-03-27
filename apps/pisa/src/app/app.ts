import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PisaUtilService } from './services/pisa-util.service';
import { PisaNavHeaderComponent } from './components/pisa-nav-header/pisa-nav-header';

@Component({
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule, PisaNavHeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly pisaUtilService = inject(PisaUtilService);
  public readonly ccp4LogoSrc = this.pisaUtilService.getPisaAssetUrl('assets/images/ccp4.png');

  public openCCP4(): void {
    window.open('https://www.ccp4.ac.uk/', '_blank');
  }
}
