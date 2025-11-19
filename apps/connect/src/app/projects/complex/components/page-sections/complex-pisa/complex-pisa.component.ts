/* eslint-disable @typescript-eslint/no-explicit-any */

import { AfterViewInit, Component, computed, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AG_Grid_Theme_Class, AssetPipe, DownloadFileTypeService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { baseUrl, PARAMS, tourIds } from '../../../complex.constant';
import { drawHistogram } from './histogram';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PISAAssemblyParam } from '../../../models/pisa-assembly-param.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PisaFilterComponent } from './components/complex-pisa-filter/pisa-filter.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexPageTutorialTourService } from '../../../services/complex-page-tutorial-tour.service';

@Component({
  selector: 'pdbc-complex-pisa',
  standalone: true,
  imports: [CommonModule, AssetPipe, AgGridAngular, MaterialModule, ReactiveFormsModule, NgxSliderModule, FormsModule, NgxSkeletonLoaderModule, PisaFilterComponent],
  templateUrl: './complex-pisa.component.html',
  styleUrls: ['./complex-pisa.component.scss'],
})
export class ComplexPISAComponent implements OnInit, AfterViewInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly pisa = toSignal(this.globalStore.select(ComplexSelectors.pisa));
  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;
  public baseUrl = baseUrl;

  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly tutorialTourService = inject(ComplexPageTutorialTourService);

  public stats = signal<any>({});

  public rowData = linkedSignal({
    source: this.pisa,
    computation: () => this.pisa() ?? [],
  });
  private HasPisaData = computed(() => {
    const rows = this.rowData();
    return rows.length > 0;
  });
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public mappedPisaData = computed(() => {
    return this.rowData()?.reduce((acc: any[], assembly: any) => {
      const { pdb_id, assembly_id, ...newAssembly } = assembly;
      acc.push([`${pdb_id}_${assembly_id}`, newAssembly]);
      return acc;
    }, []);
  });

  public pisaAssemblyPropertyOptions = PARAMS;
  public pisaAssemblyProperty = new FormControl(this.pisaAssemblyPropertyOptions[0].value, { nonNullable: true });

  private selectedRowParams = signal<string>('');
  public selectedRow = signal<PISAAssemblyParam>({} as PISAAssemblyParam);

  public pisaProperties = [
    { label: 'Accessible Surface Area', value: 'accessible_surface_area' },
    { label: 'Buried Surface Area', value: 'buried_surface_area' },
    { label: 'Solvation Energy Gain', value: 'solvation_energy_gain' },
    { label: 'Dissociation Energy', value: 'dissociation_energy' },
    { label: 'Dissociation Entropy', value: 'dissociation_entropy' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public structuresLength = computed(() => (this.rowData() ?? []).length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);

  public searchTerm = signal('');
  private unfilteredStructures = computed(() => this.rowData() ?? []);
  public structuresPage = linkedSignal({
    source: this.searchTerm,
    computation: () => {
      if (!this.searchTerm().trim()) {
        return this.unfilteredStructures().slice(0, this.structuresPageSize());
      }
      return this.filterItemsBySearchQuery(this.searchTerm(), this.unfilteredStructures()).slice(0, this.structuresPageSize());
    },
  });

  public pisaSliderReady = signal(false);
  public filterActionNoData = signal(false);

  ngOnInit(): void {
    setTimeout(() => {
      this.stats.set(this.getMinMaxStats(this.pisa() as PISAAssemblyParam[]));
      this.pisaSliderReady.set(true);
    }, 500);
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const pdb = item.pdb_id.toLocaleLowerCase();
      return pdb.indexOf(searchQuery.toLocaleLowerCase()) !== -1;
    });
  }

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage.set(this.rowData().slice(startIndex, endIndex) ?? []);
  }

  getPropertyValue(key: keyof PISAAssemblyParam): number {
    return this.selectedRow()?.[key] ?? 0;
  }

  getPropertyOptions(key: keyof PISAAssemblyParam) {
    return this.stats()?.[key] ?? {};
  }

  public selectPisaAssemblyProperty() {
    this.drawHistogram();
  }

  public onSelectionChanged(event: SelectionChangedEvent) {
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      this.selectedRow.set({} as PISAAssemblyParam);
      this.selectedRowParams.set('');
      return;
    }
    const data = selectedNodes[0].data;
    this.updatedSelectedRow(data);
  }

  private updatedSelectedRow(data: any) {
    this.selectedRow.set(data);
    const id = `${data.pdb_id}_${data.assembly_id}`;
    this.selectedRowParams.set(id);
    this.drawHistogram();
  }

  public onRowDataUpdated(event: any) {
    if (event.api.getDisplayedRowCount() > 0) {
      const firstNode = event.api.getDisplayedRowAtIndex(0);
      if (firstNode) {
        firstNode.setSelected(true);
        this.updatedSelectedRow(firstNode.data);
      }
    }
  }
  private drawHistogram(): void {
    drawHistogram(this.mappedPisaData(), this.selectedRowParams(), this.pisaAssemblyProperty.value, '#histogram-svg');
  }
  public downloadCSV(): void {
    const mappedData: any = this.rowData()?.map((pisa: PISAAssemblyParam) => {
      return {
        ID: `${pisa.pdb_id}_${pisa.assembly_id}`,
        'Experimental Method': pisa.experimental_method,
        Resolution: pisa.resolution,
        'Accessible Surface Area': pisa.accessible_surface_area,
        'Buried Surface Area': pisa.buried_surface_area,
        'Solvation Energy Gain': pisa.solvation_energy_gain,
        'Dissociation Energy': pisa.dissociation_area,
        'Dissociation Entropy': pisa.dissociation_entropy,
      };
    });
    this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
  }

  public getMinMaxStats(data: PISAAssemblyParam[]) {
    const keys = ['accessible_surface_area', 'buried_surface_area', 'solvation_energy_gain', 'dissociation_energy', 'dissociation_entropy'];

    const result = {} as any;

    keys.forEach((key) => {
      const values = data.map((item: any) => item[key]).filter((val) => typeof val === 'number' && !isNaN(val));

      if (values.length > 0) {
        result[key] = {
          disabled: true,
          floor: Math.min(...values),
          ceil: Math.max(...values),
        };
      } else {
        result[key] = {
          floor: null,
          ceil: null,
        };
      }
    });

    return result;
  }

  public applyFilters(data: any): void {
    const { method, minValue, maxValue } = data;

    const filteredData = this.pisa()?.filter((entry: any) => {
      const inRange = entry.resolution >= minValue && entry.resolution <= maxValue;
      const methodMatch = method === '' || entry.experimental_method === method;
      return inRange && methodMatch;
    });

    if (filteredData?.length === 0) {
      this.filterActionNoData.set(true);
    } else {
      this.filterActionNoData.set(false);
    }
    this.rowData.update(() => filteredData ?? []);
    this.stats.set(this.getMinMaxStats(filteredData as PISAAssemblyParam[]));
    this.drawHistogram();
  }

  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tutorialTourService.hasPisaData.set(this.HasPisaData());
      const agreed = this.tutorialTourService.getCookie(tourIds.pisa);
      if (!agreed && this.HasPisaData()) {
        this.isBannerCookies.set(true);
      }
    }, 500);
  }

  public startPISATabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.pisaTabTourSteps);
  }
}
