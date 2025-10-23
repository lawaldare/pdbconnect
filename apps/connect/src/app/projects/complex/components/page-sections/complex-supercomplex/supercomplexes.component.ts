/* eslint-disable @typescript-eslint/no-explicit-any */

import { AfterViewInit, Component, computed, ElementRef, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { FormsModule } from '@angular/forms';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, rowSelection } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SuperpositionService } from '../../../services/superposition.service';
import { superpositionTooltip, tourIds } from '../../../complex.constant';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MbComplexComponent } from '../mb-complex-components';
import { ComplexPageTutorialTourService } from '../../../services/complex-page-tutorial-tour.service';

@Component({
  selector: 'pdbc-supercomplexes',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule, MaterialModule, FormsModule, AgGridAngular, HelpIconWithTooltipComponent, MbComplexComponent],
  templateUrl: './supercomplexes.component.html',
  styleUrl: '../sub-and-super-complex.scss',
})
export class SuperComplexesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);
  private readonly superpositionService = inject(SuperpositionService);
  private readonly util = inject(UtilService);

  public initialized = false;

  @ViewChild('molstarContainer') set container(el: ElementRef | undefined) {
    if (el && this.rowData().length && !this.initialized) {
      this.initialized = true;
      this.superpositionService.loadInitialComplexView(el.nativeElement);
    }
  }

  public isLoading = this.superpositionService.isLoading;

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public supercomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));
  public readonly tutorialTourService = inject(ComplexPageTutorialTourService);

  public searchTerm = signal('');

  public rowData = computed(() => {
    const value = this.searchTerm();
    const interactions = this.supercomplexInteractions() ?? [];
    if (value.trim()) {
      return this.utilService.filterItemsBySearchQuery(value.trim(), interactions);
    } else {
      return interactions;
    }
  });

  public hasSupercomplexes = computed(() => {
    const rows = this.rowData();
    return rows.length > 0;
  });

  public structuresPage = linkedSignal({
    source: this.rowData,
    computation: () => (this.rowData() ?? []).slice(0, this.structuresPageSize()),
  });

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public height = '400px';

  private currentComplexId = signal<string>('');

  public superpositionTooltip = superpositionTooltip;

  public structuresLength = computed(() => (this.rowData() ?? []).length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage.set((this.rowData() ?? []).slice(startIndex, endIndex));
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId, '_blank');
  }

  public async onSelectionChanged(event: SelectionChangedEvent) {
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return;
    }
    const data = selectedNodes[0].data;
    await this.updatedSelectedRow(data);
  }

  private async updatedSelectedRow(data: any) {
    if (this.currentComplexId()) {
      setTimeout(async () => {
        await this.superpositionService.deleteComplex(this.currentComplexId());
      }, 1000);
    }
    this.currentComplexId.set(data.pdb_complex_id);
    await this.superpositionService.loadComplex(data.pdb_complex_id, 'subcomplex');
  }
  public async onRowDataUpdated(event: any) {
    if (event.api.getDisplayedRowCount() > 0) {
      const firstNode = event.api.getDisplayedRowAtIndex(0);
      if (firstNode) {
        firstNode.setSelected(true);
        await this.updatedSelectedRow(firstNode.data);
      }
    }
  }

  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tutorialTourService.hasSupercomplexes.set(this.hasSupercomplexes());
      const agreed = this.tutorialTourService.getCookie(tourIds.supercomplexes);
      if (!agreed && this.hasSupercomplexes()) {
        this.isBannerCookies.set(true);
      }
    }, 500);
  }

  public startSupercomplexesTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.supercomplexesTabTourSteps);
  }
}
