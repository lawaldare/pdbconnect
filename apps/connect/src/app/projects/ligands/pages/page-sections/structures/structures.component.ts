import { Component, ViewChild, AfterViewInit, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chain, LigandStructure } from '../../../data-models/structure.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective, DownloadFileTypeService, DownloadService, MaterialModule } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { map, switchMap } from 'rxjs/operators';
import { LigandInteractingChainsNumberPipe } from '../../../ligandInteractingChainsNumber.pipe';
import { MatDialog } from '@angular/material/dialog';
import { LigandTotalDialogComponent } from '../../section-components/ligand-total-dialog/ligand-total-dialog.component';
import { EMPTY } from 'rxjs';
import { LigandUtilService } from '../../../ligand-util.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective, ReactiveFormsModule, ToolTipComponent, LigandInteractingChainsNumberPipe, MaterialModule],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
  providers: [LigandInteractingChainsNumberPipe],
})
export class StructuresComponent implements AfterViewInit, OnInit {
  public readonly displayedColumns: string[] = ['name', 'uniprot_id', 'ec_number', 'annotation', 'count'];
  public structureData: LigandStructure[] = [];
  public dataSource = new MatTableDataSource<LigandStructure>(this.structureData);
  public searchText = new FormControl('', { nonNullable: true });
  public unfilteredStructures = signal<LigandStructure[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly chainPipe = inject(LigandInteractingChainsNumberPipe);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly downloadService = inject(DownloadService);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly fileDownloadUrl = environment.downloadAPIUrl;

  public showOptions = false;
  public pageSizeOptions = signal([5, 10, 15, 20]);

  public isLoadingEntry = this.downloadService.isLoadingEntry;

  private readonly fb = inject(FormBuilder);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public readonly form = this.fb.nonNullable.group({
    cofactorLike: false,
    reactantLike: false,
    drugLike: false,
    unannotated: false,
  });

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          return this.aggregatedApiService.fetchLigandStructures(ligandId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: LigandStructure[]) => {
        this.unfilteredStructures.update(() => [...data]);
        this.dataSource.data = data;
        this.pageSizeOptions.update((options) => [...new Set([...options, this.dataSource.data.length])]);
      });

    this.form.valueChanges
      .pipe(
        switchMap((values: any) => {
          this.dataSource.data = this.ligandUtilService.filterStructures(this.unfilteredStructures(), values);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    this.searchText.valueChanges
      .pipe(
        map((searchQuery) => {
          this.dataSource.data = this.filterItemsBySearchQuery(searchQuery, this.unfilteredStructures());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private filterItemsBySearchQuery(searchQuery: string, items: LigandStructure[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return (
        (item.name ?? '').toLocaleLowerCase().indexOf(searchQueryLower) !== -1 ||
        (item.uniprot_id ?? '').toString().toLocaleLowerCase().indexOf(searchQueryLower) !== -1
      );
    });
  }

  public downloadMMCIF() {
    const mappedData = this.unfilteredStructures().reduce((acc: string[], structure) => {
      acc = [...acc, ...structure.interacting_chains.map((c) => c.pdb_id)];
      return acc;
    }, []);

    const uniqueData = [...new Set(mappedData)];

    if (uniqueData.length <= 100) {
      this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', uniqueData.join(','), 'updated-mmCIF');
    } else {
      //go to download service
      localStorage.setItem('pdbIds', uniqueData.join(','));
      const url = 'https://wwwdev.ebi.ac.uk/pdbe/download/docs';
      window.open(url);
    }
  }

  public downloadCSV(): void {
    const mappedData = this.unfilteredStructures().map((structure) => {
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
  }

  private getInteractingChain(chains: Chain[]): string {
    return chains.map((chain) => `${chain.pdb_id}:${chain.auth_asym_id}:${chain.struct_asym_id}`).join(', ');
  }

  public onShowOptions() {
    this.showOptions = !this.showOptions;
  }
  public onClickedOutside() {
    this.showOptions = false;
  }

  public openTotalDialog(data: Chain[]) {
    this.dialog.open(LigandTotalDialogComponent, {
      disableClose: false,
      panelClass: 'ligand-total-Dialog',
      data: data,
    });
  }
}
