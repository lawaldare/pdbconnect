/* eslint-disable @angular-eslint/directive-selector */
import { ChangeDetectorRef, Directive, Host, Input, OnInit, Optional, SkipSelf, TemplateRef, ViewContainerRef } from '@angular/core';

import { CtrCompleter, CompleterList } from './ctr-completer';
import { CompleterData } from '../services/completer-data';
import { CompleterItem } from '../components/completer-item';
import { MIN_SEARCH_LENGTH, PAUSE, CLEAR_TIMEOUT } from '../globals';
import { catchError, Observable, Subscription, throwError, timer } from 'rxjs';

export class CtrListContext {
  constructor(
    public results: CompleterItem[],
    public searching: boolean,
    public searchInitialized: boolean
  ) {}
}

@Directive({
  selector: '[ctrList]',
})
export class CtrList implements OnInit, CompleterList {
  @Input() public ctrListMinSearchLength = MIN_SEARCH_LENGTH;
  @Input() public ctrListPause = PAUSE;
  @Input() public ctrListAutoMatch = false;

  private _dataService!: CompleterData;
  // private results: CompleterItem[] = [];
  private term = '';
  // private searching = false;
  private searchTimer!: any;
  private clearTimer!: any;
  private ctx = new CtrListContext([], false, false);

  private static hasTerm(term: string) {
    return term || term === '';
  }

  constructor(
    @Optional() @SkipSelf() private completer: CtrCompleter | null,
    private templateRef: TemplateRef<CtrListContext>,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) {
    if (!this.completer) {
      throw new Error('ctrList must be used inside an element with ctrCompleter.');
    }
  }

  public ngOnInit() {
    this.completer?.registerList(this);
    this.viewContainer.createEmbeddedView(this.templateRef, new CtrListContext([], false, false));
  }

  @Input('ctrList')
  set dataService(newService: CompleterData) {
    this._dataService = newService;
    if (this._dataService) {
      this._dataService.pipe(catchError((err) => this.handleError(err))).subscribe((results) => {
        this.ctx.searchInitialized = true;
        this.ctx.searching = false;
        this.ctx.results = results;
        if (
          this.ctrListAutoMatch &&
          results.length === 1 &&
          results[0].title &&
          CtrList.hasTerm(this.term) &&
          results[0].title.toLocaleLowerCase() === this.term.toLocaleLowerCase()
        ) {
          // Do automatch
          this.completer?.onSelected(results[0]);
        }
        this.refreshTemplate();
      });
    }
  }

  public search(term: string) {
    if (CtrList.hasTerm(term) && term.length >= this.ctrListMinSearchLength && this.term !== term) {
      if (this.searchTimer) {
        this.searchTimer.unsubscribe();
        this.searchTimer = null;
      }
      if (!this.ctx.searching) {
        this.ctx.results = [];
        this.ctx.searching = true;
        this.ctx.searchInitialized = true;
        this.refreshTemplate();
      }

      if (this.clearTimer) {
        this.clearTimer.unsubscribe();
      }
      this.searchTimer = timer(this.ctrListPause).subscribe(() => {
        this.searchTimerComplete(term);
      });
    }
  }

  public clear() {
    if (this.searchTimer) {
      this.searchTimer.unsubscribe();
    }
    this.clearTimer = timer(CLEAR_TIMEOUT).subscribe(() => {
      this._clear();
    });
  }

  private _clear() {
    if (this.searchTimer) {
      this.searchTimer.unsubscribe();
      this.searchTimer = null;
    }
    if (this.dataService) {
      this.dataService.cancel();
    }
    this.ctx.results = [];
    this.ctx.searchInitialized = false;
    this.term = '';
    this.viewContainer.clear();
  }

  private searchTimerComplete(term: string) {
    // Begin the search
    if (!CtrList.hasTerm(term) || term.length < this.ctrListMinSearchLength) {
      this.ctx.searching = false;
      return;
    }
    this.term = term;
    this._dataService.search(term);
  }

  private handleError(error: any) {
    this.ctx.searching = false;
    let errMsg = 'search error';
    if (error) {
      errMsg = error.message ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    }

    if (console && console.error) {
      console.error(errMsg); // log to console
    }
    this.refreshTemplate();

    return throwError(errMsg);
  }

  private refreshTemplate() {
    // Recreate the template
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef, this.ctx);
    this.cd.markForCheck();
  }
}
