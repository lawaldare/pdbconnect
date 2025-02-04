/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, timer } from 'rxjs';
import { OverviewMolstarFacade } from './data-processing.facade';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { OverviewStateManagementService } from './state-management.service';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { MolstarConfigObject } from '../../helpers/molstar/molstar-base-class';
import { OverviewMolstarControBarComponent } from './sub-components/molstar-control-bar/molstar-control-bar.component';
import { OverviewMolstarTabNavComponent } from './sub-components/tab-nav-menu/tab-nav-menu.component';
import { OverviewMolstarTabListViewComponent } from './sub-components/tab-listview-content/tab-listview-content.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabNames } from '../../helpers/tab-names.enum';

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, OverviewMolstarTabNavComponent, OverviewMolstarControBarComponent, OverviewMolstarTabListViewComponent],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly stateManagement = inject(OverviewStateManagementService);
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  private imagesForDomains!: string[];

  private molstarResiduesForAssembly = this.molstarOverview.residues;
  public assemblyData = this.dataProcessing.assemblyData;

  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public imageList: string[] = [];

  public preferredAssemblyImgName?: string;

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly inputModifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  // public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  // public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  // public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  private async initMolstarInstance() {
    console.log('Initializing Mol* instance...', this.assemblyData());
    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred + '' : '1';

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: this.entryId(),
      assemblyId: assemblyToUse,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: false,
    };

    await this.molstarOverview.initMolstar(molstarConfigObject, this.molstarContainer);

    // ?TODO: Could be optimized by filtering non macromolecules and non ligands data
    this.molstarOverview.parseInstanceResidues();
    await firstValueFrom(timer(50));

    this.molstarOverview.buttonsShowHide();
  }

  private async initMolstarImageGallery() {
    await this.molstarOverview.initImageGallery(this.entryId() ?? '');

    for (const imageObj of this.molstarOverview.galleryManager().images) {
      if (imageObj.clean_description.includes('this domain is out of the observed residue ranges!')) {
        continue;
      }
      this.imageList.push(imageObj.filename);
    }

    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred : '1';
    this.preferredAssemblyImgName = `${this.entryId()?.toLowerCase()}_assembly_${assemblyToUse}_chemically_distinct_molecules_front`;
    for (const tabName of [TabNames.Assembly, TabNames.Macromolecules, TabNames.Ligands, TabNames.Domains, TabNames.Modifications]) {
      this.stateManagement.updateStatePropertyOfTab(tabName, 'initialStateImgName', this.preferredAssemblyImgName);
      this.stateManagement.updateStatePropertyOfTab(tabName, 'imgName', this.preferredAssemblyImgName);
    }

    await this.molstarOverview.loadImage(this.preferredAssemblyImgName);
    this.stateManagement.updateStatePropertyOfTab('current', 'imgName', this.preferredAssemblyImgName);
  }

  async ngAfterViewInit() {
    this.stateManagement.infoControls.set(this.infoControls);
    this.dataProcessing.parseRelatedEntries(this.primaryPublication());
    this.dataProcessing.generateMoleculeCountText(this.macromolecules() ?? []);

    await this.initMolstarInstance();
    await this.initMolstarImageGallery();

    this.imagesForDomains = this.imageList.filter((img) => /(CATH|SCOP|Pfam)/.test(img));

    let modresImg = this.imageList.filter((eachImg) => {
      return eachImg.includes('_modres_');
    });
    if (modresImg.length > 1) modresImg = [modresImg[0]];

    await this.dataProcessing.getColorsFromMolj([this.preferredAssemblyImgName!, ...this.imagesForDomains, ...modresImg]);

    this.processComplexDetails();
    this.setActiveTab();
  }

  private processComplexDetails() {
    if (!this.complexDetails()?.length) return;
    this.dataProcessing.parseComplexDetails(this.complexDetails());
    this.dataProcessing.generateListSelectable(this.imageList, this.molstarResiduesForAssembly());
  }

  private setActiveTab() {
    const tabMapping = [
      { name: TabNames.Assembly, check: this.dataProcessing.assemblyData().preferred !== undefined },
      { name: TabNames.Macromolecules, check: (this.macromolecules() ?? []).length > 0 },
      { name: TabNames.Ligands, check: (this.ligands() ?? []).length > 0 },
      { name: TabNames.Domains, check: this.imagesForDomains.length > 0 },
      { name: TabNames.Modifications, check: (this.inputModifications() ?? []).length > 0 },
    ];

    const firstActiveTab = tabMapping.find((tab) => tab.check)?.name || TabNames.Assembly;
    tabMapping.forEach((tab) => {
      tab.check ? this.stateManagement.updateStatePropertyOfTab(tab.name, 'isInactive', false) : this.stateManagement.updateTabDisplayConfig(tab.name, 'N/A', 'na');
    });
    this.stateManagement.switchCurrentTab(firstActiveTab);
  }
}
