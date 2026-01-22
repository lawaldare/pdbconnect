/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { AG_Grid_Theme_Class, pisaInterfaceView } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { filter } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaActions } from '../../store/pisa.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InterfaceTabSingleInterfaceComponent } from '../interface-tab-single-interface/interface-tab-single-interface';

@Component({
  selector: 'pisa-interfaces-tab',
  imports: [CommonModule, AgGridAngular, NgxSkeletonLoaderModule, MolstarComponent, InterfaceTabSingleInterfaceComponent, MolstarComponent],
  templateUrl: './interfaces-tab.html',
  styleUrls: ['../complexes-tab/complexes-tab.scss', './interfaces-tab.scss'],
})
export class InterfacesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  public pisaUtilService = inject(PisaUtilService);
  private molstarPluginService = inject(MolstarPluginService);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly interfaceResponse = toSignal(this.pisaStore.select(PisaSelectors.interfaceResults).pipe(filter(Boolean)));

  public readonly jobId = toSignal(this.pisaStore.select(PisaSelectors.jobId).pipe(filter(Boolean)));

  public readonly selectedInterface = toSignal(this.pisaStore.select(PisaSelectors.interfaceResultForInterfaceId).pipe(filter(Boolean)));
  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));
  private complexesData = computed(() => {
    const response = this.assemblyResponse();
    const allComplexes = response?.pqs_sets.flatMap((set: any) => set.complexes);
    return allComplexes;
  });

  @ViewChild('molstar') molstar!: MolstarComponent;

  public selectedRowData = signal<any>({});

  public rowData = linkedSignal({
    source: this.interfaceResponse,
    computation: () => {
      const response = this.interfaceResponse();

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

  private async updatedSelectedRow(data: any) {
    console.log('Selected row:', data);
    const interfaceId = data.interfaceKey;
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceId({ interfaceId }));

    const MVS = this.molstarPluginService.getClass()?.extensions.MVS;
    const complexesData = this.complexesData();

    if (!MVS) return;
    if (!complexesData) return;

    const snapshot = pisaInterfaceView(MVS?.MVSData.createBuilder(), {
      structureUrl: `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${this.jobId()}`,
      structureFormat: 'mmcif',
      complexesData: complexesData,
      interfaceData: this.selectedInterface(),
    });

    const mvs = MVS.MVSData.createMultistate([snapshot]);
    const plugin = this.molstar.getInstance().plugin;
    await MVS.loadMVS(plugin, mvs);
  }

  public onFilterChanged(event: any) {
    // console.log('Filter changed:', event);
  }

  public onRowDataUpdated(event: any) {
    // console.log('Row data updated:', event);
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    requestAnimationFrame(() => event.api.sizeColumnsToFit());
    // console.log('Complex structure grid ready:', event);
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

    return out;
  }
}
