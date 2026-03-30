import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule, ScrollPositionService } from '@pdbc/core';
import { ValidationErrorItem, ValidationResult } from '../../models';

@Component({
  selector: 'app-results',
  imports: [CommonModule, MaterialModule],
  templateUrl: './results-page.html',
  styleUrls: ['./results-page.scss'],
})
export class ResultsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly scrollService = inject(ScrollPositionService);

  public result: ValidationResult = JSON.parse(sessionStorage.getItem('validationResult') || '{}');

  public selectedFilter = signal('all');
  public selectedTab = signal<number>(0);

  public numberOfErrors = signal<number>(0);
  public numberOfWarnings = signal<number>(0);

  public totalErrorsAndWarnings = computed(() => this.numberOfErrors() + this.numberOfWarnings());

  public errors: ValidationErrorItem[] = [];
  public warnings: ValidationErrorItem[] = [];
  public filteredLists: ValidationErrorItem[] = [];

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  private readonly routeTabs = [
    { label: 'Errors', id: 'errors' },
    { label: 'Completeness', id: 'completeness' },
  ];

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const routeTabs = this.routeTabs;
      const tabName = params['activeTab'];
      // this.pisaUtilService.updateCurrentTabName(tabName ?? 'complexes');
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
    });

    this.numberOfErrors.set(this.result?.summary?.errors || 0);
    this.numberOfWarnings.set(this.result?.summary?.warnings || 0);

    this.errors = this.result?.errors?.filter((error) => error.severity === 'error') || [];
    this.warnings = this.result?.errors?.filter((error) => error.severity === 'warning') || [];
    this.filteredLists = this.result?.errors || [];
  }

  ngOnInit(): void {
    console.log(this.result);
  }

  public onFilter(filterText: string): void {
    this.selectedFilter.set(filterText);
    if (filterText === 'all') {
      this.filteredLists = this.result?.errors || [];
    } else if (filterText === 'errors') {
      this.filteredLists = this.errors;
    } else if (filterText === 'warnings') {
      this.filteredLists = this.warnings;
    }

    console.log('filteredLists', this.filteredLists);
  }

  public selectTab(event: MatTabChangeEvent) {
    const routeTabs = this.routeTabs;
    const tabName = routeTabs[event.index].id;
    // this.pisaUtilService.updateCurrentTabName(tabName ?? 'complexes');

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });

    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
  }

  public openErrorsTab(): void {
    this.selectedTab.set(0);
  }
  public openCompletenessTab(): void {
    this.selectedTab.set(1);
  }
}
