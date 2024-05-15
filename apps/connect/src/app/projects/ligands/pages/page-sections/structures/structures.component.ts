import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Structure } from '../../../data-models/structure.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatTabsModule, MatSortModule, MatCheckboxModule],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
})
export class StructuresComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'id', 'ec_number', 'annotation', 'count', 'rep_structure'];
  dataSource = new MatTableDataSource<Structure>(structureData);
  cofactor = false;
  reactant = false;
  drug = false;
  unannotated = false;
  searchLogo = '/assets/images/Search.svg';
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Function to apply both check box and search filter
   */
  applyFilter() {
    const filterValues: { annotation?: string[]; search?: string } = {};
    const filterSet = new Set<string>();
    this.cofactor ? filterSet.add('cofactor like') : filterSet.delete('cofactor like');
    this.reactant ? filterSet.add('reactant like') : filterSet.delete('reactant like');
    this.drug ? filterSet.add('drug like') : filterSet.delete('drug like');
    this.unannotated ? filterSet.add('unannotated') : filterSet.delete('unannotated');
    filterValues['annotation'] = Array.from(filterSet);
    filterValues['search'] = this.searchText.toLowerCase();
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    // Defining custom filter
    this.dataSource.filterPredicate = (data: Structure, filter: string): boolean => {
      const filterValues = JSON.parse(filter);
      let annotationMatch = false;
      let searchMatch = false;
      filterValues.annotation.forEach((item: string) => {
        annotationMatch = annotationMatch || data.annotation.toLowerCase() === item;
      });
      searchMatch = searchMatch || data.name.toLowerCase() === filterValues.search || data.rep_structure.toLowerCase() === filterValues.search;
      if (filterValues.annotation.length > 0 && filterValues.search.length > 0) {
        return annotationMatch && searchMatch;
      } else if (filterValues.annotation.length == 0 && filterValues.search.length == 0) {
        return true;
      } else {
        return annotationMatch || searchMatch;
      }
    };
  }
}

const structureData: Structure[] = [
  {
    name: 'Glycerol-3-phosphate dehydrogenase',
    id: 'P90551',
    ec_number: '1.1.1.8',
    annotation: 'Cofactor like',
    count: 4,
    rep_structure: '1evz',
  },
  {
    name: 'Quinate dehydrogenase',
    id: 'Q9X5C9',
    ec_number: '1.1.1.24',
    annotation: 'Cofactor like',
    count: 3,
    rep_structure: '3jyp',
  },
  {
    name: 'Glucose-6-phosphate dehydrogenase',
    id: 'Q9X5C9',
    ec_number: '1.1.1.14',
    annotation: 'Cofactor like',
    count: 1,
    rep_structure: '1e7y',
  },
  {
    name: 'NAD(P)H-dependent D-xylose reductase',
    id: 'P11411',
    ec_number: '1.1.1.8',
    annotation: 'Cofactor like',
    count: 5,
    rep_structure: '1z9a',
  },
  {
    name: '4-trimethylaminobuteralde',
    id: 'P49189',
    ec_number: '1.2.1.47',
    annotation: 'Reactant like',
    count: 5,
    rep_structure: '6vwf',
  },
  {
    name: '4-trimethylaminobuteralde',
    id: 'P49189',
    ec_number: '1.2.1.47',
    annotation: 'Reactant like',
    count: 5,
    rep_structure: '6vwf',
  },
  {
    name: '4-trimethylaminobuteralde',
    id: 'P49189',
    ec_number: '1.2.1.47',
    annotation: 'Drug like',
    count: 5,
    rep_structure: '6vwf',
  },
  {
    name: '4-trimethylaminobuteralde',
    id: 'P49189',
    ec_number: '1.2.1.47',
    annotation: 'Unannotated',
    count: 5,
    rep_structure: '6vwf',
  },
  {
    name: '4-trimethylaminobuteralde',
    id: 'P49189',
    ec_number: '1.2.1.47',
    annotation: 'Reactant like',
    count: 5,
    rep_structure: '6vwf',
  },
];
