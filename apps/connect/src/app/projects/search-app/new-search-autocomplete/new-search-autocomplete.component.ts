import { Component, OnInit, ElementRef, DestroyRef, inject, signal, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as appSettings from './app.settings';
import { debounceTime, distinctUntilChanged, mergeMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SolrAutocompleteService } from './solr-autocomplete.service';
import { WindowRefService } from './window-ref.service';
import { UtilsService } from './utils.service';
import { ClickOutsideDirective } from './click-outside.directive';
import { ResultGroup } from './search.model';

@Component({
  selector: 'pdbc-new-search-autocomplete',
  templateUrl: './new-search-autocomplete.component.html',
  styleUrls: ['./new-search-autocomplete.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FlexLayoutModule, ReactiveFormsModule, ClickOutsideDirective],
})
export class PdbNewAutocompleteComponent implements OnInit {
  public readonly searchTerm = new FormControl('');
  private readonly destroyRef = inject(DestroyRef);

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

  //Default Configurations
  private readonly defaultConfig: any = {
    resultBoxAlign: 'left',
    redirectOnClick: false,
    searchUrl: '//www.ebi.ac.uk/pdbe/search/pdb-autocomplete/select',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    sort: 'category+asc,num_pdb_entries+desc',
    additionalParams: 'rows=20000&json.nl=map&wt=json',
  };

  private resultPanelStyle: any = { 'max-height': '100%' };
  public layoutAlign = '';
  public resultPanelOpen = signal(false);
  public primaryResultPanel = signal(false);
  public secondaryResultPanel = signal(false);
  public resultGroups!: ResultGroup[];
  public moreResultGroups!: ResultGroup[];

  constructor(
    private pdbSolrService: SolrAutocompleteService,
    private windowRef: WindowRefService,
    public utils: UtilsService,
    @Inject(ElementRef) private elementRef: ElementRef
  ) {
    const userConfig = windowRef.nativeWindow.PdbeAutocompleteSearchConfig;
    if (typeof userConfig != 'undefined') {
      this.defaultConfig = { ...this.defaultConfig, ...userConfig };
    }
  }

  public onClickedOutside(): void {
    this.hideAllPanels();
  }

  public searchMore(filterVals: any[]): void {
    const searchTerm = this.searchTerm.value;
    const filterValArr: any[] = [];
    filterVals.forEach((rec) => {
      if (filterValArr.indexOf(rec.var_name) == -1) filterValArr.push(rec.var_name);
    });
    const fqVal = filterValArr.join(' OR var_name:');

    this.pdbSolrService
      .searchMore(this.utils.escapeValue(searchTerm ?? ''), fqVal, this.defaultConfig)
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

  private togglePageScroll(action: string): void {
    this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'auto';
    if (action == 'hide') {
      this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
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

  public resultItemClick(resultRecord: any, totalResultRecords: any): void {
    if (resultRecord.var_name == 'pdb_id' || (resultRecord.var_name == 'uniprot' && totalResultRecords == 1)) {
      window.open(this.resultItemLink(resultRecord, totalResultRecords), window.location.hostname === 'localhost' ? '_self' : '');
    } else if (this.defaultConfig.redirectOnClick) {
      window.open(this.resultItemLink(resultRecord, totalResultRecords), window.location.hostname === 'localhost' ? '_self' : '');
    }

    // this.hideAllPanels();
  }

  private resultItemLink(resultRecord: any, totalResultRecords: any): string {
    let url: string;
    if (resultRecord.var_name == 'pdb_id') {
      url = 'https://www' + appSettings.appEnv + '.ebi.ac.uk/pdbe/entry/pdb/' + resultRecord.value;
    } else if (resultRecord.var_name == 'uniprot' && totalResultRecords == 1) {
      const unpAcc = resultRecord.value.split(' : ')[0];
      url = 'https://www' + appSettings.appEnv + '.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + unpAcc;
    } else {
      url = window.location.hostname === 'localhost' ? `${window.location.origin}/?` : 'https://www' + appSettings.appEnv + '.ebi.ac.uk/pdbe/entry/search/index?';
      // url = 'https://www' + appSettings.appEnv + '.ebi.ac.uk/pdbe/entry/search/index?';
      if (this.defaultConfig.view) url += 'view=' + this.defaultConfig.view + '&';
      url += resultRecord.var_name + ':' + this.utils.escapeValue(resultRecord.value);
    }
    return url;
  }

  public resultPanelHeight() {
    let panelAlign: string;
    this.defaultConfig.resultBoxAlign == 'right' ? (panelAlign = 'right') : (panelAlign = 'left');
    const searchBoxDimension = this.elementRef.nativeElement.querySelector('.pdbeAutoCompleteSearchBox').getBoundingClientRect();

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

    // console.log(this.resultPanelStyle);

    return this.resultPanelStyle;
  }

  ngOnInit(): void {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        mergeMap((term) => {
          if (term) {
            this.showPrimaryPanel();
            return this.pdbSolrService.search(this.utils.escapeValue(term), this.defaultConfig);
          } else {
            this.hideAllPanels();
            return of([]);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        (results: any[]) => {
          const sortedResults = this.utils.sortArrayObjectByArrayOrder(results, this.categories, 'groupValue');
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
}
