/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild, ElementRef, AfterViewInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, timer } from 'rxjs';
import { OverviewMolstarFacade } from './data-processing.facade';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { OverviewStateManagementService } from './state-management.service';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
// import { MolstarConfigObject } from '../../../../helpers/molstar/molstar-base-class';
import { OverviewMolstarControBarComponent } from './sub-components/molstar-control-bar/molstar-control-bar.component';
import { OverviewMolstarTabListViewComponent } from './sub-components/tab-listview-content/tab-listview-content.component';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabNames } from '../../../../helpers/tab-names.enum';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MolstarConfigObject } from '@pdbe-lib/molstar-for-apps';
import { MolstarExtendedForEntryPages } from '../../../../helpers/molstar/molstar-extended-for-entry-pgs';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, OverviewMolstarControBarComponent, NgxSkeletonLoaderModule, OverviewMolstarTabListViewComponent],
  //imports: [CommonModule, NgxSkeletonLoaderModule, OverviewMolstarTabListViewComponent],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly stateManagement = inject(OverviewStateManagementService);
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  public readonly molstarExtendedInstance = inject(MolstarExtendedForEntryPages);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  public assemblyData = this.dataProcessing.assemblyData;

  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public imageList: string[] = [];

  public preferredAssemblyImgName?: string;

  public isOverviewSectionDisplayed = signal(false);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly inputModifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  public molstarIsInit = signal(false);

  constructor() {
    effect(async () => {
      const macromoleculesData = this.signals.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
      const ligandsRawData = this.signals.getTabData('Ligands').tableRows() as LigandsRowData[];
      const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
      const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');
      if (this.molstarIsInit() && this.molstarOverview.hasChecked === false) {
        await this.molstarOverview.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);
      }
    });
  }

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
    this.molstarIsInit.set(true);

    // ?TODO: Could be optimized by filtering non macromolecules and non ligands data
    this.molstarOverview.parseInstanceResidues();
    await firstValueFrom(timer(50));

    this.molstarOverview.buttonsShowHide();
  }

  async ngAfterViewInit() {
    this.stateManagement.infoControls.set(this.infoControls);
    this.dataProcessing.parseRelatedEntries();

    await this.initMolstarInstance();

    this.processComplexDetails();
    this.isOverviewSectionDisplayed.set(true);
  }

  private processComplexDetails() {
    this.dataProcessing.parseComplexDetails();
    // this.dataProcessing.generateListSelectable(this.imageList, this.molstarResiduesForAssembly());
  }
}
