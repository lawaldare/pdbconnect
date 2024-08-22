import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { descriptorStructure, descriptorSmallMolecules, descriptorSifts, dataContentSmallMolecules, dataContentStructure, dataContentSifts } from './constants';
import { DataContentComponent } from './components/data-content/data-content.component';
import { DataTypeBoxComponent } from './components/data-type-box/data-type-box.component';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { MaterialModule } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { DataType } from './models/data-type-box.model';
import { DownloadNavbarComponent } from './components/download-navbar/download-navbar.component';

@Component({
  standalone: true,
  imports: [
    VfEbiHeaderComponent,
    VfEbiFooterComponent,
    DataContentComponent,
    DataTypeBoxComponent,
    PdbeHeaderLogoMenuComponent,
    MaterialModule,
    ToolTipComponent,
    DownloadNavbarComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly title = 'PDBe Download Service';

  public readonly structureData: DataType = {
    submissionType: 'entry',
    descriptorType: descriptorStructure,
    dataContent: dataContentStructure,
  };
  public readonly moleculesData: DataType = {
    submissionType: 'compound',
    descriptorType: descriptorSmallMolecules,
    dataContent: dataContentSmallMolecules,
  };
  public readonly siftsData: DataType = {
    submissionType: 'entry',
    descriptorType: descriptorSifts,
    dataContent: dataContentSifts,
  };

  public readonly headerLogoMenuConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
  };

  @ViewChild('navbar', { read: ElementRef }) navbar!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  private onScroll($event: any): void {
    const navbar = this.navbar.nativeElement;
    const sticky = navbar.offsetTop;

    if (window.scrollY > sticky) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }
}
