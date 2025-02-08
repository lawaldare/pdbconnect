import { Component, computed, ElementRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveTablesComponent } from '../interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../details-dashboard/details-dashboard.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { TableNames } from '../../pages/main/main.component';

@Component({
  selector: 'pdbc-common-tab',
  imports: [CommonModule, InteractiveTablesComponent, DetailsDashboardComponent, NgxSkeletonLoaderModule],
  templateUrl: './common-tab.component.html',
  styleUrl: './common-tab.component.scss',
})
export class CommonTabComponent implements OnInit {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  public readonly tabName = input.required<TableNames>();
  public molstarViewerEl = input.required<HTMLElement>(); // Molstar global instance div
  public molstarParent = input.required<HTMLElement>(); // Parent to send back the molstar global instance

  ngOnInit(): void {
    setTimeout(() => {
      // this.molstarVisualisation.renderMolstarInitial(this.entryId() ?? '', this.molstarViewer.nativeElement);
    });
    console.log('LigandsTabComponent initialized');
  }
}
