import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, pisaInterfaceView } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PisaSelectors } from '../../store/pisa.selectors';
import { distinctUntilChanged, filter, firstValueFrom, take } from 'rxjs';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { PisaActions } from '../../store/pisa.actions';
import { SingleInterfaceDetailsComponent } from '../single-interface-details/single-interface-details';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgGridAngular } from 'ag-grid-angular';
import { bondsColDefs, colDefs, gridOptions } from './ag-grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pisa-complex-tab-single-interface',
  imports: [CommonModule, FormsModule, MaterialModule, AgGridAngular, ReactiveFormsModule, MolstarComponent, SingleInterfaceDetailsComponent, NgxPaginationModule],
  templateUrl: './complex-tab-single-interface.html',
  styleUrl: './complex-tab-single-interface.scss',
})
export class ComplexTabSingleInterfaceComponent implements OnInit {
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);
  private molstarPluginService = inject(MolstarPluginService);

  public readonly interface = signal<any | null>(null);
  public readonly selectedComplexData = toSignal(this.pisaStore.select(PisaSelectors.selectedComplexData));

  public config!: any;
  public height = '400px';
  @ViewChild('molstar') molstar!: MolstarComponent;
  public readonly jobId = toSignal(this.pisaStore.select(PisaSelectors.jobId).pipe(filter(Boolean)));
  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));
  private complexesData = computed(() => {
    const response = this.assemblyResponse();
    const allComplexes = response?.pqs_sets.flatMap((set: any) => set.complexes);
    return allComplexes;
  });

  public selectedInterfaceRow = signal<any>({});
  public startNumber = signal<number>(1);

  private unFilteredStructure1RowData = signal<any[] | null>(null);
  private unFilteredStructure2RowData = signal<any[] | null>(null);

  public structure1RowData = signal<any[] | null>(null);
  public structure2RowData = signal<any[] | null>(null);

  public hydrogenBondRowData = signal<any[] | null>(null);
  public disulphideBondRowData = signal<any[] | null>(null);
  public saltBridgesRowData = signal<any[] | null>(null);
  public covalentLinkRowData = signal<any[] | null>(null);

  public readonly residueFiters = [
    { name: 'Interfacing residues', value: 'interfacing', checked: false },
    { name: 'Solvent-accessible residues', value: 'solvent', checked: false },
    { name: 'Inaccessible residues', value: 'inaccessible', checked: false },
  ];

  private gridApiForStructure1?: GridApi;
  private gridApiForStructure2?: GridApi;

  public readonly gridOptions = gridOptions;
  public readonly colDefs = colDefs;
  public readonly bondsColDefs = bondsColDefs;

  private onLoaded = signal<boolean>(false);

  private currentInterfaceId = computed(() => this.pisaUtilService.currentInterfaceIdOnComplexesTab());

  ngOnInit(): void {
    this.pisaStore
      .select(PisaSelectors.interfaceResultForInterfaceIdComplexesTab)
      .pipe(
        filter(Boolean),
        filter((r: any) => r.interface_id === this.currentInterfaceId())
      )
      .subscribe((response) => {
        this.interface.set(response);
        if (!this.onLoaded()) {
          setTimeout(async () => {
            await this.loadMVS(response.interface_id);
          }, 500);
          this.onLoaded.set(true);
        }
        const selectedInterfaceId = response.interface_id;

        const selectedinterfaceData = this.selectedComplexData()?.interfaces.find((row: any) => row.interface_id === selectedInterfaceId);
        if (selectedinterfaceData) {
          this.selectedInterfaceRow.set(selectedinterfaceData);
        }

        const authAsymIdForStructure1 = response.interface.molecules[0].auth_asym_id;
        const authAsymIdForStructure2 = response.interface.molecules[1].auth_asym_id;

        const residuesForStructure1 = response.interface.molecules[0]?.residues?.residues || [];
        const residuesForStructure2 = response.interface.molecules[1]?.residues?.residues || [];

        const structure1Data = residuesForStructure1.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure1 }));
        const structure2Data = residuesForStructure2.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure2 }));

        this.unFilteredStructure1RowData.set(structure1Data);
        this.unFilteredStructure2RowData.set(structure2Data);
        this.structure1RowData.update(() => structure1Data);
        this.structure2RowData.update(() => structure2Data);

        this.hydrogenBondRowData.set(response.interface.h_bonds.bonds || []);
        this.disulphideBondRowData.set(response.interface.ss_bonds.bonds || []);
        this.saltBridgesRowData.set(response.interface.salt_bridges.bonds || []);
        this.covalentLinkRowData.set(response.interface.cov_bonds.bonds || []);
      });

    this.config = {
      moleculeId: '1a0u',
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: '1',
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle'],
      landscape: true,
    };
  }

  public onStructure1GridReady(event: GridReadyEvent<any>) {
    this.gridApiForStructure1 = event.api;
  }

  public onStructure2GridReady(event: GridReadyEvent<any>) {
    this.gridApiForStructure2 = event.api;
  }

  public goBackToComplexes() {
    this.pisaUtilService.setComplexesTabView('INITIAL');
  }

  public async onInterfaceRowClick(rowData: any) {
    this.selectedInterfaceRow.set(rowData);
    const interfaceId = rowData.interface_id;
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceIdForComplexesTab({ interfaceId }));
    this.resetFilters();
    await this.loadMVS(interfaceId);
  }

  private async loadMVS(interfaceId: string) {
    await this.molstarPluginService.loadPlugin();

    await this.pisaUtilService.loadFileToGetContentType(this.jobId() ?? '');

    const latestInterface = await firstValueFrom(
      this.pisaStore.select(PisaSelectors.interfaceResultForInterfaceIdComplexesTab).pipe(
        filter(Boolean),
        filter((r: any) => r.interface_id === interfaceId),
        take(1)
      )
    );

    const MVS = this.molstarPluginService.getClass()?.extensions.MVS;
    const complexesData = this.complexesData();

    if (!MVS) return;
    if (!complexesData) return;
    if (!this.molstar) return;

    setTimeout(async () => {
      const snapshot = pisaInterfaceView(MVS?.MVSData.createBuilder(), {
        structureUrl: `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${this.jobId()}`,
        structureFormat: this.pisaUtilService.currentFileType(),
        complexesData: complexesData,
        interfaceData: latestInterface,
        // detailMolecules: [0, 1],
      });

      const mvs = MVS.MVSData.createMultistate([snapshot]);
      const plugin = this.molstar?.getInstance().plugin;
      await MVS.loadMVS(plugin, mvs);
    }, 500);
  }

  public onChangePage(num: number): void {
    const p = (num - 1) * 10;
    this.startNumber.set(num);
    this.selectedInterfaceRow.set(this.selectedComplexData().interfaces[p]);
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceIdForComplexesTab({ interfaceId: this.selectedComplexData().interfaces[p].interface_id }));
  }

  public filterResidue(checked: boolean, index: number): void {
    const residues = this.residueFiters;
    residues[index].checked = checked;
    const selectedFilters = residues.filter((residue) => residue.checked).map((residue) => residue.value);

    if (selectedFilters.length === 0) {
      this.structure1RowData.update(() => this.unFilteredStructure1RowData());
      this.structure2RowData.update(() => this.unFilteredStructure2RowData());
      return;
    }

    const rowData1 = this.unFilteredStructure1RowData()?.filter((row) => this.matchesSelectedFilters(row, selectedFilters));
    const rowData2 = this.unFilteredStructure2RowData()?.filter((row) => this.matchesSelectedFilters(row, selectedFilters));

    this.structure2RowData.update(() => rowData2 || []);
    this.structure1RowData.update(() => rowData1 || []);
  }

  private matchesSelectedFilters(row: any, selected: string[]): boolean {
    const asa = Number(row?.asa ?? 0);
    const bsa = Number(row?.bsa ?? 0);

    // A row is kept if it matches ANY selected category
    return selected.some((filter) => {
      if (filter === 'interfacing') return bsa > 0;
      if (filter === 'solvent') return bsa === 0 && asa > 0;
      if (filter === 'inaccessible') return asa === 0 && bsa === 0;
      return false;
    });
  }

  private resetFilters(): void {
    this.residueFiters.forEach((residue) => (residue.checked = false));
    this.structure1RowData.update(() => this.unFilteredStructure1RowData());
    this.structure2RowData.update(() => this.unFilteredStructure2RowData());
  }
}
