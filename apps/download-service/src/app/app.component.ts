import { Component } from '@angular/core';
import { descriptorStructure, descriptorSmallMolecules, descriptorSifts, dataContentSmallMolecules, dataContentStructure, dataContentSifts } from './constants';
import { DataContentComponent } from './components/data-content/data-content.component';
import { DataTypeBoxComponent } from './components/data-type-box/data-type-box.component';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { MaterialModule } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { DataType } from './models/data-type-box.model';

@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, DataContentComponent, DataTypeBoxComponent, PdbeHeaderLogoMenuComponent, MaterialModule, ToolTipComponent],
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
    backgroundColor: '#085F5C',
    logoType: 'PDBe-KB',
  };
}
