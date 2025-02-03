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

  public totalDomains = 0;

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
  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  private async initMolstarInstance() {
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
    for (const tabName of ['Assembly', 'Macromolecules', 'Ligands', 'Domains', 'Modifications']) {
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

    const imagesForDomains = this.imageList.filter((eachImg) => {
      return eachImg.includes('CATH') || eachImg.includes('SCOP') || eachImg.includes('Pfam');
    });

    this.totalDomains = imagesForDomains.length;

    let modresImg = this.imageList.filter((eachImg) => {
      return eachImg.includes('_modres_');
    });
    if (modresImg.length > 1) modresImg = [modresImg[0]];

    await this.dataProcessing.getColorsFromMolj([this.preferredAssemblyImgName!, ...imagesForDomains, ...modresImg]);

    if (this.complexDetails()?.length) {
      this.dataProcessing.parseComplexDetails(this.complexDetails());
      this.dataProcessing.generateListSelectable(
        this.entryId()!,
        this.macromolecules()!,
        this.ligands()!,
        this.inputModifications()!,
        this.cathMappings()!,
        this.pfamMappings()!,
        this.scopMappings()!,
        this.imageList,
        this.molstarResiduesForAssembly()
      );
    }

    let firstTab = undefined;
    // set sections as active if they contain any data mapped to them
    if (this.dataProcessing.assemblyData().preferred !== undefined) {
      this.stateManagement.updateStatePropertyOfTab('Assembly', 'isInactive', false);
      firstTab = 'Assembly';
    } else {
      this.stateManagement.updateTabDisplayConfig('Assembly', 'N/A', 'na');
    }

    if (this.macromolecules()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Macromolecules', 'isInactive', false);
      if (!firstTab) firstTab = 'Macromolecules';
    } else {
      this.stateManagement.updateTabDisplayConfig('Macromolecules', 'N/A', 'na');
    }

    if (this.ligands()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Ligands', 'isInactive', false);
      if (!firstTab) firstTab = 'Ligands';
    } else {
      this.stateManagement.updateTabDisplayConfig('Ligands', 'N/A', 'na');
    }

    if (this.totalDomains > 0) {
      this.stateManagement.updateStatePropertyOfTab('Domains', 'isInactive', false);
      if (!firstTab) firstTab = 'Domains';
    } else {
      this.stateManagement.updateTabDisplayConfig('Domains', 'N/A', 'na');
    }

    if (this.inputModifications()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Modifications', 'isInactive', false);
      if (!firstTab) firstTab = 'Modifications';
    } else {
      this.stateManagement.updateTabDisplayConfig('Modifications', 'N/A', 'na');
    }
    if (!firstTab) firstTab = 'Assembly';

    await this.stateManagement.switchCurrentTab(firstTab);
  }
}
