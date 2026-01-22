/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { AG_Grid_Theme_Class } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { EMPTY, filter, mergeMap } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaActions } from '../../store/pisa.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SingleInterfaceComponent } from '../single-interface/single-interface';

@Component({
  selector: 'pisa-interfaces-tab',
  imports: [CommonModule, AgGridAngular, NgxSkeletonLoaderModule, MolstarComponent, SingleInterfaceComponent, MolstarComponent],
  templateUrl: './interfaces-tab.html',
  styleUrls: ['../complexes-tab/complexes-tab.scss', './interfaces-tab.scss'],
})
export class InterfacesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  public pisaUtilService = inject(PisaUtilService);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly interfaceResponse = toSignal(this.pisaStore.select(PisaSelectors.interfaceResults).pipe(filter(Boolean)));

  public selectedRowData = signal<any>({});

  public rowData = linkedSignal({
    source: this.interfaceResponse,
    computation: () => {
      const response = this.interfaceResponse();
      console.log('Interface response:', response);

      if (!response) {
        return null;
      }

      return this.transformInterfaceData(response.interface_types ?? []);
    },
  });

  public numberOfInterfaceTypes = linkedSignal({
    source: this.interfaceResponse,
    computation: () => this.interfaceResponse()?.interface_types?.length || 0,
  });

  public numberOfInterfaces = linkedSignal({
    source: this.interfaceResponse,
    computation: () => {
      const interfaceResults = this.interfaceResponse();
      if (!interfaceResults) return null;
      const sum = interfaceResults?.interface_types?.reduce((acc: number, curr: any) => acc + curr.interfaces.length, 0);
      return sum;
    },
  });

  public config!: any;
  public height = '400px';

  ngOnInit(): void {
    this.config = {
      moleculeId: '1a0u',
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: '1',
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle'],
      landscape: true,
    };
  }

  public onSelectionChanged(event: SelectionChangedEvent) {
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return;
    }
    const data = selectedNodes[0].data;
    this.updatedSelectedRow(data);
  }

  private updatedSelectedRow(data: any) {
    console.log('Selected row:', data);
  }

  public onFilterChanged(event: any) {
    console.log('Filter changed:', event);
  }

  public onRowDataUpdated(event: any) {
    console.log('Row data updated:', event);
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    requestAnimationFrame(() => event.api.sizeColumnsToFit());
    console.log('Complex structure grid ready:', event);
  }

  private transformInterfaceData(interfaces: any[]) {
    const out = [];

    for (const set of interfaces ?? []) {
      out.push({ groupHeader: `Interface type ${set.int_type}` });

      for (const c of set.interfaces ?? []) {
        out.push({
          interfaceKey: c.interface_id,
          structureOneChain: c.auth_asym_id_1,
          structureTwoChain: c.auth_asym_id_2,
          structureOneNAtoms: c.int_natoms_1,
          structureTwoNAtoms: c.int_natoms_2,
          structureOneNResidues: c.int_nres_1,
          structureTwoNResidues: c.int_nres_2,
          interfaceArea: c.int_area,
          interfaceEnergy: c.int_solv_energy,
          pValue: c.pvalue,
          css: c.css,
          complexes: c.complex_keys_with_interface.join(', '),
        });
      }
    }

    console.log('out:', out);

    return out;
  }
}
