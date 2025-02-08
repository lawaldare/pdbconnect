import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveTablesComponent } from '../interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../details-dashboard/details-dashboard.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-domains-tab',
  imports: [CommonModule, InteractiveTablesComponent, DetailsDashboardComponent, NgxSkeletonLoaderModule],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent implements OnInit {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.molstarVisualisation.renderMolstarInitial(this.entryId() ?? '', this.molstarViewer.nativeElement);
    });
    console.log('DomainsTabComponent initialized');
  }
}
