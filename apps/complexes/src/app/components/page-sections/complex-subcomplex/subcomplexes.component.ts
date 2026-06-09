/* eslint-disable @typescript-eslint/no-explicit-any */

import { AfterViewInit, Component, computed, ElementRef, inject, linkedSignal, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AG_Grid_Theme_Class, AssetPipe, GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { FormsModule } from '@angular/forms';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, rowSelection } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SuperpositionService } from '../../../services/superposition.service';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { superpositionTooltip, tourIds } from '../../../complex.constant';
import { MbComplexComponent } from '../mb-complex-components';
import { ComplexPageTutorialTourService } from '../../../services/complex-page-tutorial-tour.service';

@Component({
  selector: 'pdbc-subcomplexes',
  standalone: true,
  imports: [CommonModule, AssetPipe, NgxSkeletonLoaderModule, MaterialModule, FormsModule, AgGridAngular, HelpIconWithTooltipComponent, MbComplexComponent],
  templateUrl: './subcomplexes.component.html',
  styleUrl: '../sub-and-super-complex.scss',
})
export class SubComplexesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private utilService = inject(ComplexUtilService);
  private readonly util = inject(UtilService);
  private readonly gAS = inject(GoogleAnalyticsService);
  public iconPath = '';

  private readonly platformId = inject(PLATFORM_ID);

  private readonly superpositionService = inject(SuperpositionService);
  public initialized = false;

  @ViewChild('molstarContainer') set container(el: ElementRef | undefined) {
    if (el && this.rowData().length && !this.initialized) {
      this.initialized = true;
      this.superpositionService.loadInitialComplexView(el.nativeElement);
    }
  }

  public isLoading = this.superpositionService.isLoading;

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));
  public readonly tutorialTourService = inject(ComplexPageTutorialTourService);

  public searchTerm = signal('');

  public rowData = computed(() => {
    const value = this.searchTerm();
    const interactions = this.subcomplexInteractions() ?? [];
    if (value.trim()) {
      return this.utilService.filterItemsBySearchQuery(value.trim(), interactions);
    } else {
      return interactions;
    }
  });

  public hasSubcomplexes = computed(() => {
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

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.iconPath = document.location.hostname === 'localhost' ? '' : 'complexes/assets/images/help_outline_24px.svg';
    }
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId, '_blank');
  }

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage.set((this.rowData() ?? []).slice(startIndex, endIndex));
  }

  public async onSelectionChanged(event: SelectionChangedEvent) {
    this.gAS.logPageEvents('cp_interactions', {
      tab: 'subcomplexes',
    });
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return;
    }
    const data = selectedNodes[0].data;
    await this.updatedSelectedRow(data);
  }

  private async updatedSelectedRow(data: any) {
    if (this.currentComplexId()) {
      await this.superpositionService.deleteComplex(this.currentComplexId());
    }
    this.currentComplexId.set(data.pdb_complex_id);
    setTimeout(async () => {
      await this.superpositionService.loadComplex(data.pdb_complex_id, 'subcomplex');
    }, 1000);
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
      this.tutorialTourService.hasSubcomplexes.set(this.hasSubcomplexes());
      const agreed = this.tutorialTourService.getCookie(tourIds.subcomplexes);
      if (!agreed && this.hasSubcomplexes()) {
        this.isBannerCookies.set(true);
      }
    }, 500);
  }

  public startSubcomplexesTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.subcomplexesTabTourSteps);
  }
}
