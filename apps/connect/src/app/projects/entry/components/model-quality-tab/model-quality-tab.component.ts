import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { ExperimentsValidationComponent } from '../experiments-validation/experiments-validation.component';

@Component({
  selector: 'pdbc-model-quality-tab',
  imports: [CommonModule, ExperimentsValidationComponent, NgxSkeletonLoaderModule],
  templateUrl: './model-quality-tab.component.html',
  styleUrl: './model-quality-tab.component.scss',
})
export class ModelQualityTabComponent implements OnInit {
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
  }
}
