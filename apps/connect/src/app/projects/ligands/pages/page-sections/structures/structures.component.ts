import { Component, ViewChild, AfterViewInit, OnInit, Input, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Structure } from '../../../data-models/structure.model';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective } from '@pdbc/core';
import * as XLSX from 'xlsx';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PdbeLinkButtonComponent,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule,
    MatCheckboxModule,
    ClickOutsideDirective,
    ReactiveFormsModule,
    ToolTipComponent,
  ],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
})
export class StructuresComponent implements AfterViewInit, OnInit {
  public readonly displayedColumns: string[] = ['name', 'id', 'ec_number', 'annotation', 'count'];
  public structureData: Structure[] = [];
  public dataSource = new MatTableDataSource<Structure>(this.structureData);
  public searchText = new FormControl('');
  public readonly olamide =
    'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22q_pdb_id%22:%5B%7B%22value%22:%221cbs%22,%22condition1%22:%22AND%22,%22condition2%22:%22Equal%20to%22%7D,%7B%22value%22:%223d12%22,%22condition1%22:%22OR%22,%22condition2%22:%22Equal%20to%22%7D,%7B%22value%22:%22101m%22,%22condition1%22:%22OR%22,%22condition2%22:%22Equal%20to%22%7D%5D,%22resultState%22:%7B%22tabIndex%22:0,%22paginationIndex%22:1,%22perPage%22:%2210%22,%22sortBy%22:%22Sort%20by%22%7D%7D';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  public showOptions = false;
  public pageSizeOptions = signal([5, 10, 15, 20]);

  private readonly fb = inject(FormBuilder);

  /**
   * Function to apply both check box and search filter
   */
  applyFilter() {
    const filterValues: { annotation?: string[]; search?: string } = {};
    const filterSet = new Set<string>();
    // this.cofactor ? filterSet.add('cofactor like') : filterSet.delete('cofactor like');
    // this.reactant ? filterSet.add('reactant like') : filterSet.delete('reactant like');
    // this.drug ? filterSet.add('drug like') : filterSet.delete('drug like');
    // this.unannotated ? filterSet.add('unannotated') : filterSet.delete('unannotated');
    filterValues['annotation'] = Array.from(filterSet);
    // filterValues['search'] = this.searchText.toLowerCase();
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public readonly form = this.fb.group({
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
          return this.aggregatedApiService.fetchBoundEntries(ligandId);
        }),
        map((boundaries: any[]) => {
          return boundaries.map(() => ({
            name: 'Glycerol-3-phosphate dehydrogenase',
            id: 'P90551',
            ec_number: '1.1.1.8',
            annotation: 'Cofactor like',
            count: 4,
          }));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: Structure[]) => {
        this.dataSource.data = data;
        this.pageSizeOptions.update((options) => [...new Set([...options, this.dataSource.data.length])]);
      });

    this.form.valueChanges.pipe(tap((values: any) => console.log(values))).subscribe();
    this.searchText.valueChanges.pipe(tap((value: any) => console.log(value))).subscribe();
    // if (this.ligandId) {
    //   this.aggregatedApiService
    //     .fetchBoundEntries(this.ligandId)
    //     .pipe(catchError((error) => of(error)))
    //     .subscribe((boundEntries: string[]) => {
    //       console.log(boundEntries);
    //       this.structureData = boundEntries.map((entry) => ({
    //         name: '',
    //         id: '',
    //         ec_number: '',
    //         annotation: '',
    //         count: 1,
    //         rep_structure: entry,
    //       }));
    //       this.dataSource.data = this.structureData;
    //     });
    // }
    // Defining custom filter
    this.dataSource.filterPredicate = (data: Structure, filter: string): boolean => {
      const filterValues = JSON.parse(filter);
      let annotationMatch = false;
      // let searchMatch = false;
      filterValues.annotation.forEach((item: string) => {
        annotationMatch = annotationMatch || data.annotation.toLowerCase() === item;
      });
      // searchMatch = searchMatch || data.name.toLowerCase() === filterValues.search || data.rep_structure.toLowerCase() === filterValues.search;
      if (filterValues.annotation.length > 0 && filterValues.search.length > 0) {
        // return annotationMatch && searchMatch;
        return annotationMatch;
      } else if (filterValues.annotation.length == 0 && filterValues.search.length == 0) {
        return true;
      } else {
        // return annotationMatch || searchMatch;
        return annotationMatch;
      }
    };
  }

  public downloadCSV() {
    const timeStamp = new Date().toISOString();
    const title = 'table';
    const fileName = `${timeStamp}-${title}`;
    const tableElement = document.getElementById('structure-table');
    if (tableElement) {
      const workbook = XLSX.utils.table_to_book(tableElement, <XLSX.Table2SheetOpts>{ sheet: fileName });
      XLSX.writeFile(workbook, `${fileName}.csv`);
    }
  }

  public onShowOptions() {
    this.showOptions = !this.showOptions;
  }
  public onClickedOutside() {
    this.showOptions = false;
  }
}

// const structureData: Structure[] = [
//   {
//     name: 'Glycerol-3-phosphate dehydrogenase',
//     id: 'P90551',
//     ec_number: '1.1.1.8',
//     annotation: 'Cofactor like',
//     count: 4,
//     rep_structure: '1evz',
//   },
//   {
//     name: 'Quinate dehydrogenase',
//     id: 'Q9X5C9',
//     ec_number: '1.1.1.24',
//     annotation: 'Cofactor like',
//     count: 3,
//     rep_structure: '3jyp',
//   },
//   {
//     name: 'Glucose-6-phosphate dehydrogenase',
//     id: 'P11411',
//     ec_number: '1.1.1.363',
//     annotation: 'Cofactor like',
//     count: 1,
//     rep_structure: '1e77',
//   },
//   {
//     name: 'NAD(P)H-dependent D-xylose reductase',
//     id: 'O74237',
//     ec_number: '1.1.1.307',
//     annotation: 'Cofactor like',
//     count: 5,
//     rep_structure: '1jez',
//   },
//   {
//     name: '4-trimethylaminobuteralde',
//     id: 'P49189',
//     ec_number: '1.2.1.47',
//     annotation: 'Reactant like',
//     count: 5,
//     rep_structure: '6vwf',
//   },
//   {
//     name: '4-trimethylaminobuteralde',
//     id: 'P49189',
//     ec_number: '1.2.1.47',
//     annotation: 'Reactant like',
//     count: 5,
//     rep_structure: '6vwf',
//   },
//   {
//     name: '4-trimethylaminobuteralde',
//     id: 'P49189',
//     ec_number: '1.2.1.47',
//     annotation: 'Drug like',
//     count: 5,
//     rep_structure: '6vwf',
//   },
//   {
//     name: '4-trimethylaminobuteralde',
//     id: 'P49189',
//     ec_number: '1.2.1.47',
//     annotation: 'Unannotated',
//     count: 5,
//     rep_structure: '6vwf',
//   },
//   {
//     name: '4-trimethylaminobuteralde',
//     id: 'P49189',
//     ec_number: '1.2.1.47',
//     annotation: 'Reactant like',
//     count: 5,
//     rep_structure: '6vwf',
//   },
// ];
