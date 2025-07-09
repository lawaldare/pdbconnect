/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AG_Grid_Theme_Class, DownloadFileTypeService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { SelectionChangedEvent } from 'ag-grid-community';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PARAMS } from '../../../complex.constant';
import { drawHistogram } from './histogram';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

export interface PISAAssemblyParam {
  dissociation_energy: number;
  accessible_surface_area: number;
  buried_surface_area: number;
  dissociation_entropy: number;
  dissociation_area: number;
  solvation_energy_gain: number;
  pdb_id: string;
  assembly_id: string;
  [key: string]: any;
}

@Component({
  selector: 'pdbc-complex-pisa',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MaterialModule, ReactiveFormsModule, NgxSliderModule],
  templateUrl: './complex-pisa.component.html',
  styleUrls: ['./complex-pisa.component.scss'],
})
export class ComplexPISAComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly pisa = toSignal(this.globalStore.select(ComplexSelectors.pisa));
  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  private readonly downloadFileTypeService = inject(DownloadFileTypeService);

  public stats = signal<any>({});

  public rowData = computed(() => {
    return this.pisa();
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

  ngOnInit(): void {
    this.stats.set(this.getMinMaxStats(this.pisa() as PISAAssemblyParam[]));
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
    const data = event.api.getSelectedNodes()[0].data;
    this.selectedRow.set(data);
    const id = `${data.pdb_id}_${data.assembly_id}`;
    this.selectedRowParams.set(id);
    this.drawHistogram();
  }

  private drawHistogram(): void {
    drawHistogram(this.mappedPisaData(), this.selectedRowParams(), this.pisaAssemblyProperty.value, '#histogram-svg');
  }

  public downloadCSV(): void {
    const mappedData: any = this.rowData()?.map((pisa: PISAAssemblyParam) => {
      return {
        ID: `${pisa.pdb_id}_${pisa.assembly_id}`,
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
}
