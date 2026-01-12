/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, Host, HostListener, Input, Renderer2, OnInit, Optional, SkipSelf } from '@angular/core';

import { CompleterItem } from '../components/completer-item';
import { CtrDropdown, CtrRowElement, CtrRowItem } from './ctr-dropdown';

@Directive({
  selector: '[ctrRow]',
})
export class CtrRow implements CtrRowElement, OnInit {
  private selected = false;
  private _rowIndex!: number;
  private _item!: CompleterItem;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() @SkipSelf() private dropdown: CtrDropdown | null
  ) {
    if (!this.dropdown) {
      throw new Error('ctrRow must be used inside an element with ctrDropdown.');
    }
  }

  public ngOnInit() {
    this.dropdown?.registerRow(new CtrRowItem(this, this._rowIndex));
  }

  @Input()
  set ctrRow(index: number) {
    this._rowIndex = index;
  }

  @Input()
  set dataItem(item: CompleterItem) {
    this._item = item;
  }

  @HostListener('click', ['$event']) public onClick(event: any) {
    this.dropdown?.onSelected(this._item);
  }

  @HostListener('mouseenter', ['$event']) public onMouseEnter(event: any) {
    this.dropdown?.highlightRow(this._rowIndex);
  }

  public setHighlited(selected: boolean) {
    this.selected = selected;
    this.renderer.addClass(this.el.nativeElement, 'completer-selected-row');
  }

  public getNativeElement() {
    return this.el.nativeElement;
  }

  public getDataItem() {
    return this._item;
  }
}
