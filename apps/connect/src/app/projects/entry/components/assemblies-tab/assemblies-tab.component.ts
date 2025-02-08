import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveTablesComponent } from '../interactive-tables/interactive-tables.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { DetailsDashboardComponent } from '../details-dashboard/details-dashboard.component';

@Component({
  selector: 'pdbc-assemblies-tab',
  imports: [CommonModule, InteractiveTablesComponent, DetailsDashboardComponent, NgxSkeletonLoaderModule],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent implements OnInit {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  ngOnInit(): void {
    console.log('AssembliesTabComponent initialized');
    setTimeout(() => {
      this.molstarVisualisation.renderMolstarInitial(this.entryId() ?? '', this.molstarViewer.nativeElement);
      console.log('this.molstarVisualisation.renderMolstarInitial is called (1)');
    });
  }
}
