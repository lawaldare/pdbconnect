/* eslint-disable @angular-eslint/component-selector */
import { Component, DestroyRef, ElementRef, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APISearchConfig, ClickOutsideDirective, DataLayerService, GoogleAnalyticsService, ThemeType, UISearchConfig, UtilService } from '@pdbc/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, mergeMap, of } from 'rxjs';
import { SearchAppAPIService } from '../services/search-app-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';

interface ResultPanelStyle {
  'max-height': string;
  right?: string;
  left?: string;
  'margin-left'?: string;
  'margin-right'?: string;
}

interface Doc {
  var_name: string;
  value: string;
  num_pdb_entries: number;
}

interface DocList {
  start: number;
  numFound: number;
  docs: Doc[];
}

interface ResultGroup {
  groupValue: string;
  doclist: DocList;
}

@Component({
  selector: 'pdb-search-app',
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule, ClickOutsideDirective],
  templateUrl: './search-app.component.html',
  styleUrl: './search-app.component.scss',
})
export class SearchAppComponent implements OnInit {
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  public readonly utilService = inject(UtilService);
  private readonly fb = inject(FormBuilder);
  private readonly searchAPIService = inject(SearchAppAPIService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef);

  @Input({ required: true }) uiSearchConfig!: UISearchConfig;
  @Input({ required: true }) apiSearchConfig!: APISearchConfig;

  // searchTermStream = new Subject<string>();
  // private fb = inject(FormBuilder);

  public buttonTheme!: string;
  public chipBg!: string;

  public form = this.fb.group({
    searchTerm: '',
  });

  private resultPanelStyle: ResultPanelStyle = { 'max-height': '100%' };
  public layoutAlign = '';
  public resultPanelOpen = signal(false);
  public primaryResultPanel = signal(false);
  public secondaryResultPanel = signal(false);
  public resultGroups: ResultGroup[] = [];
  public moreResultGroups: ResultGroup[] = [];

  public readonly categories = [
    'Molecule name',
    'UniProt mapping',
    'Enzyme',
    'Structure domain',
    'Ligand',
    'Sequence family',
    'Gene',
    'Organism',
    'GO mapping',
    'Author',
    'Journal',
    'Experimental Method',
    'Status',
  ];

  ngOnInit() {
    this.buttonTheme = this.uiSearchConfig.type === ThemeType.PDBE ? 'pdbe' : 'pdbe-kb';
    this.chipBg = this.uiSearchConfig.type === ThemeType.PDBE ? 'pdbe-chip-bg' : 'pdbe-kb-chip-bg';

    this.form.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged(),
        mergeMap((value) => {
          if (value) {
            this.showPrimaryPanel();
            return this.searchAPIService.search(this.utilService.escapeValue(value), this.apiSearchConfig);
          } else {
            this.hideAllPanels();
            return of([]);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        (results: ResultGroup[]) => {
          const sortedResults = this.utilService.sortArrayObjectByArrayOrder(results, this.categories, 'groupValue');
          this.resultGroups = sortedResults;
          this.resultPanelOpen.set(true);
          if (this.resultGroups.length === 0) {
            this.resultPanelOpen.set(false);
          }
        },
        (error) => {
          this.resultGroups = [];
          this.resultPanelOpen.set(false);
        }
      );
  }

  public onSubmit(form: FormGroup): void {
    const value = form.value.searchTerm;
    const url = this.utilService.generateSortedQueryURL(value, 'text');
    window.open(url, '_blank');
    this.form.controls.searchTerm.setValue('');
  }

  public openID(ligandId: string): void {
    this.utilService.redirectToSearchTerm(ligandId);
    this.googleAnalyticsService.logClickEvents('example_click', 'Search Examples Links', 'navigate_to_example', ligandId);
  }

  public resultPanelHeight(): ResultPanelStyle {
    let panelAlign: string;
    this.apiSearchConfig.resultBoxAlign == 'right' ? (panelAlign = 'right') : (panelAlign = 'left');
    const searchBoxDimension = this.el.nativeElement.querySelector('.input-field').getBoundingClientRect();

    if (panelAlign == 'right') {
      this.resultPanelStyle['max-height'] = window.innerHeight - searchBoxDimension.bottom - 30 + 'px';
      this.resultPanelStyle['right'] = window.innerWidth - searchBoxDimension.right + 'px';
      this.layoutAlign = 'end';
      this.resultPanelStyle['margin-left'] = '20px';
    } else {
      this.resultPanelStyle['max-height'] = window.innerHeight - searchBoxDimension.bottom - 30 + 'px';
      this.resultPanelStyle['left'] = searchBoxDimension.left + 'px';
      this.resultPanelStyle['margin-right'] = '20px';
    }

    return this.resultPanelStyle;
  }

  public onClickedOutside(): void {
    this.hideAllPanels();
  }

  private togglePageScroll(action: string): void {
    this.el.nativeElement.ownerDocument.body.style.overflow = 'auto';
    if (action == 'hide') {
      this.el.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }
  }

  private hideAllPanels(): void {
    this.resultPanelOpen.set(false);
    this.primaryResultPanel.set(false);
    this.secondaryResultPanel.set(false);
    this.togglePageScroll('show');
  }

  private showSecondayPanel(): void {
    this.primaryResultPanel.set(false);
    this.secondaryResultPanel.set(true);
    this.togglePageScroll('hide');
  }

  private showPrimaryPanel(): void {
    this.resultPanelOpen.set(true);
    this.primaryResultPanel.set(true);
    this.secondaryResultPanel.set(false);
    this.togglePageScroll('hide');
  }

  public resultItemClick(resultRecord: Doc, totalResultRecords: number): void {
    if (resultRecord.var_name == 'pdb_id' || (resultRecord.var_name == 'uniprot' && totalResultRecords == 1)) {
      window.open(this.resultItemLink(resultRecord, totalResultRecords));
    } else if (this.apiSearchConfig.redirectOnClick) {
      window.open(this.resultItemLink(resultRecord, totalResultRecords));
    }

    // this.hideAllPanels();
  }

  public clearForm(): void {
    this.form.controls.searchTerm.setValue('');
    this.hideAllPanels();
  }

  private resultItemLink(resultRecord: Doc, totalResultRecords: number): string {
    let url: string;
    if (resultRecord.var_name == 'pdb_id') {
      url = 'https://www' + this.apiSearchConfig.env + '.ebi.ac.uk/pdbe/entry/pdb/' + resultRecord.value;
    } else if (resultRecord.var_name == 'uniprot' && totalResultRecords == 1) {
      const unpAcc = resultRecord.value.split(' : ')[0];
      url = 'https://www' + this.apiSearchConfig.env + '.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + unpAcc;
    } else {
      url = 'https://www' + this.apiSearchConfig.env + '.ebi.ac.uk/pdbe/entry/search/index?';
      if (this.apiSearchConfig.view) url += 'view=' + this.apiSearchConfig.view + '&';
      url += resultRecord.var_name + ':' + this.utilService.escapeValue(resultRecord.value);
    }
    return url;
  }

  public searchMore(filterVals: Doc[]): void {
    const searchTerm = this.form.controls.searchTerm.value;
    const filterValArr: string[] = [];
    filterVals.forEach((rec) => {
      if (filterValArr.indexOf(rec.var_name) == -1) filterValArr.push(rec.var_name);
    });
    const fqVal = filterValArr.join(' OR var_name:');

    this.searchAPIService
      .searchMore(this.utilService.escapeValue(searchTerm ?? ''), fqVal, this.apiSearchConfig)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.moreResultGroups = res;
        this.showSecondayPanel();
      });
  }

  public showLess(): void {
    this.secondaryResultPanel.set(false);
    this.primaryResultPanel.set(true);
    this.moreResultGroups = [];
  }
}
