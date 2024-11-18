import { Component, inject, DestroyRef, signal, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chain, LigandStructure, Polymer } from '../../../data-models/structure.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DownloadFileTypeService, DownloadService, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { catchError, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LigandTotalDialogComponent } from '../../section-components/ligand-total-dialog/ligand-total-dialog.component';
import { environment } from '../../../../../../environments/environment';
import { LigandInteractingChainsNumberPipe } from '../../../pipes/ligandInteractingChainsNumber.pipe';
import { MatRadioChange } from '@angular/material/radio';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { combineLatest, of } from 'rxjs';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { LigandECNumberPipe } from '../../../pipes/ec-numbers.pipe';
import { cofactorTooltip, drugTooltip, reactantTooltip, unannotatedTooltip } from '../../../ligand.constant';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AgGridStructureService } from './ag-grid-structure.service';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular, MaterialModule, LigandECNumberPipe, MatPaginator],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
  providers: [LigandInteractingChainsNumberPipe],
})
export class StructuresComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly chainPipe = inject(LigandInteractingChainsNumberPipe);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly downloadService = inject(DownloadService);
  private readonly agGridService = inject(AgGridStructureService);

  private readonly fileDownloadUrl = `${environment.pdbeBaseUrl}download/api/pdb/`;

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;
  public unannotatedTooltip = unannotatedTooltip;

  public dataStatistics = signal<string>('');
  public filter = new FormControl('proteins');
  public ligandId = signal<string>('');

  public readonly gridOptions = this.agGridService.gridOptions;

  public showTotalStructureOnMobile = signal<boolean>(true);

  public readonly structureColDefs = this.agGridService.structureColDefs;
  public readonly polymerColDefs = this.agGridService.polymerColDefs;

  public structureRowData = signal<LigandStructure[]>([]);
  public polymerRowData = signal<Polymer[]>([]);
  public proteins = signal<LigandStructure[]>([]);
  public structures = signal<LigandStructure[]>([]);

  public searchTerm = new FormControl('');

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50, 100]);
  private gridApi!: GridApi;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public structuresLength = computed(() => this.structureRowData().length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);
  public structuresPage: LigandStructure[] = [];

  private unfilteredStructures: LigandStructure[] = [];

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage = this.structureRowData().slice(startIndex, endIndex);
  }

  onStructureGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api;
    combineLatest([
      this.globalStore.select(LigandSelectors.ligandId),
      this.globalStore.select(LigandSelectors.structures),
      this.globalStore.select(LigandSelectors.polymers),
    ])
      .pipe(
        tap(([ligandId]) => {
          this.ligandId.set(ligandId);
          this.agGridService.ligandId.set(ligandId);
        }),
        map(([, structures, polymers]) => {
          this.generateStructures(structures);
          this.proteins.update(() => [...structures]);
          this.structureRowData.update(() => [...this.proteins()]);
          this.polymerRowData.update(() => [...polymers]);
          this.fetchDataStatistics(structures);
          this.structuresPage = this.structureRowData().slice(0, this.structuresPageSize());
          this.unfilteredStructures = this.structureRowData();
        }),
        catchError((error) => {
          console.error('Error fetching ligand structures:', error);
          this.structureRowData.update(() => []);
          this.polymerRowData.update(() => []);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredStructures);
          } else {
            return this.unfilteredStructures;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.structureRowData.update(() => data);
        this.structuresPage = this.structureRowData().slice(0, this.structuresPageSize());
      });
  }

  onChange(event: MatRadioChange) {
    const filterSelected = event.value;
    if (filterSelected === 'proteins') {
      this.gridApi.setColumnsVisible(['pdb_id'], false);
      this.gridApi.setColumnsVisible(['interacting_chains'], true);
      this.structureRowData.update(() => [...this.proteins()]);
    } else {
      this.gridApi.setColumnsVisible(['pdb_id'], true);
      this.gridApi.setColumnsVisible(['interacting_chains'], false);
      this.structureRowData.update(() => [...this.structures()]);
    }
    this.showTotalStructureOnMobile.update((value) => !value);
  }

  public resetColumns() {
    this.gridApi.setColumnsVisible(['pdb_id'], false);
    this.gridApi.setColumnsVisible(['interacting_chains'], true);
  }

  private generateStructures(data: LigandStructure[]): void {
    const structures = data.reduce((acc: any, structure) => {
      structure.interacting_chains.forEach((chain) => {
        acc.push({
          ...structure,
          name: chain.entity_name,
          organism: chain.organisms[0],
          pdb_id: `${chain.pdb_id}_${chain.auth_asym_id}`,
        });
      });
      return acc;
    }, []);
    this.structures.update(() => [...structures]);
  }

  private fetchDataStatistics(data: LigandStructure[]): void {
    let proteins = 0;
    let structures = 0;

    for (const structure of data) {
      if (structure.uniprot_id) {
        proteins++;
      }
      const total = this.chainPipe.transform(structure.interacting_chains);
      structures += total;
    }
    this.dataStatistics.set(`Found in ${proteins} Proteins and ${structures} PDB Structures. Group data by: `);
  }

  public downloadMMCIF() {
    const mappedData = this.structureRowData().reduce((acc: string[], structure) => {
      acc = [...acc, ...structure.interacting_chains.map((c) => c.pdb_id)];
      return acc;
    }, []);

    const uniqueData = [...new Set(mappedData)];

    if (uniqueData.length <= 100) {
      this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', uniqueData.join(','), 'updated-mmCIF');
    } else {
      //go to download service
      localStorage.setItem('pdbIds', uniqueData.join(','));
      const url = `${environment.pdbeBaseUrl}download/docs`;
      window.open(url);
    }
    this.googleAnalyticsService.logClickEvents('download_coordinates_mmcif', 'Download', 'download_mmcif', 'Download coordinates');
  }

  public downloadCSV(): void {
    const mappedData = this.structureRowData().map((structure) => {
      return {
        'Protein Name': structure.name,
        'PDBe-KB Proteins': structure.uniprot_id,
        'EC Numbers': (structure.ec_numbers ?? []).join(','),
        'Ligand Annotation': (structure.annotations ?? []).join(','),
        'All Structures (list:pdb:auth_asym_id:struct_asym_id)': this.getInteractingChain(structure.interacting_chains),
        'Total Structures': this.chainPipe.transform(structure.interacting_chains),
      };
    });

    this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
    this.googleAnalyticsService.logClickEvents('download_structure_csv', 'Download', 'download_csv', 'Download structures');
  }

  private getInteractingChain(chains: Chain[]): string {
    return chains.map((chain) => `${chain.pdb_id}:${chain.auth_asym_id}:${chain.struct_asym_id}`).join(', ');
  }

  public openTotalDialog(data: Chain[]) {
    this.agGridService.openTotalDialog(data);
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return item.name?.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }
}
