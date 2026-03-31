/* eslint-disable no-useless-escape */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule, ScrollPositionService } from '@pdbc/core';
import { MissingItem, ValidationError, ValidationErrorItem, ValidationResult } from '../../models';
import { CifFileStoreService } from '../../services/cif-file-store.service';
import { CifEditorComponent } from '../cif-editor/cif-editor';
import { CifDictionaryService } from '../../services/cif-dictionary.service';
import { CifValidationService } from '../../services/cif-validation.service';

type Result = {
  category: string;
  items: string[];
};

@Component({
  selector: 'app-results',
  imports: [CommonModule, MaterialModule, CifEditorComponent],
  templateUrl: './results-page.html',
  styleUrls: ['./results-page.scss'],
})
export class ResultsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly scrollService = inject(ScrollPositionService);
  private readonly fileStoreService = inject(CifFileStoreService);
  private readonly cifDictionaryService = inject(CifDictionaryService);
  private readonly cifValidationService = inject(CifValidationService);

  public result: ValidationResult = JSON.parse(sessionStorage.getItem('validationResult') || '{}');

  public selectedFilter = signal('all');
  public selectedTab = signal<number>(0);

  public numberOfErrors = signal<number>(0);
  public numberOfWarnings = signal<number>(0);

  public totalErrorsAndWarnings = computed(() => this.numberOfErrors() + this.numberOfWarnings());

  public errors: ValidationErrorItem[] = [];
  public warnings: ValidationErrorItem[] = [];
  public filteredLists: ValidationErrorItem[] = [];
  public missingCategories: Result[] = [];

  public cifFileName = '';
  public cifFileText = '';
  public validationErrors: ValidationError[] = [];
  public highlightedLine: number | null = null;
  // public helpItem: CifDictionaryItem | null = null;
  public clickedToken: string | null = null;
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
  }

  async ngOnInit(): Promise<void> {
    console.log(this.result);

    this.numberOfErrors.set(this.result?.summary?.errors || 0);
    this.numberOfWarnings.set(this.result?.summary?.warnings || 0);

    this.errors = this.result?.errors?.filter((error) => error.severity === 'error') || [];
    this.warnings = this.result?.errors?.filter((error) => error.severity === 'warning') || [];
    this.filteredLists = this.result?.errors || [];
    this.missingCategories = this.groupMissingData(
      this.result?.metadata_completeness?.missing_categories || [],
      this.result?.metadata_completeness?.missing_items || []
    );

    const stored = await this.fileStoreService.get('current-cif');

    if (stored) {
      this.cifFileName = stored.fileName;
      this.cifFileText = stored.cifText;
    }

    if (!this.cifDictionaryService.hasLoaded()) {
      const dictionary = await this.cifValidationService.loadDictionary();
      console.log('Loaded CIF dictionary:', dictionary);
      this.cifDictionaryService.setDictionary(dictionary);
    }
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

  public onOpenAccordionPanel(panelName: string): void {
    console.log(`Accordion panel opened: ${panelName}`);
  }

  private groupMissingData(missing_categories: string[], missing_items: MissingItem[]): Result[] {
    // Normalize categories (remove brackets like "[entity_src_group]")
    const normalizedCategories = missing_categories.map((cat) => cat.replace(/[\[\]]/g, ''));

    // Initialize map
    const categoryMap: Record<string, string[]> = {};

    normalizedCategories.forEach((cat) => {
      categoryMap[cat] = [];
    });

    // Populate map
    missing_items.forEach(({ category, item }) => {
      if (categoryMap[category]) {
        categoryMap[category].push(item);
      }
    });

    // Convert to desired array format
    return Object.entries(categoryMap).map(([category, items]) => ({
      category,
      items,
    }));
  }

  onEditorContentChange(value: string): void {
    this.cifFileText = value;
  }
}
