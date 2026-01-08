/* eslint-disable @angular-eslint/directive-selector */
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

// import { CompleterData } from "../components/ng2-completer/services/completer-data";
import { CompleterItem } from '../components/completer-item';

export interface CompleterList {
  search(term: string): void;
  clear(): void;
}

export interface CompleterDropdown {
  clear(): void;
  selectCurrent(): void;
  nextRow(): void;
  prevRow(): void;
}

@Directive({
  selector: '[ctrCompleter]',
})
export class CtrCompleter {
  @Output() public selected = new EventEmitter<CompleterItem>();
  @Output() public highlighted = new EventEmitter<CompleterItem>();

  private list!: CompleterList;
  private dropdown!: CompleterDropdown;
  private _hasHighlited = false;
  private hasSelected = false;

  public registerList(list: CompleterList) {
    this.list = list;
  }

  public registerDropdown(dropdown: CompleterDropdown) {
    this.dropdown = dropdown;
  }

  public onHighlighted(item: CompleterItem) {
    if (item !== null && typeof item.originalObject != 'undefined') item.title = item.originalObject;
    // this.highlighted.emit(item); commented to stop selection on highlight
    this._hasHighlited = !!item;
  }

  public onSelected(item: CompleterItem) {
    if (item !== null && typeof item.originalObject != 'undefined') item.title = item.originalObject;
    this.selected.emit(item);
    if (item) {
      this.hasSelected = true;
    }
    this.clear();
  }

  public search(term: string) {
    if (this.hasSelected) {
      this.selected.emit({} as CompleterItem);
      this.hasSelected = false;
    }
    if (this.list) {
      this.list.search(term);
    }
  }

  public clear() {
    if (this.dropdown) {
      this.dropdown.clear();
    }
    if (this.list) {
      this.list.clear();
    }
    this._hasHighlited = false;
  }

  public selectCurrent() {
    if (this.dropdown) {
      this.dropdown.selectCurrent();
    }
  }

  public nextRow() {
    if (this.dropdown) {
      this.dropdown.nextRow();
    }
  }

  public prevRow() {
    if (this.dropdown) {
      this.dropdown.prevRow();
    }
  }

  public hasHighlited() {
    return this._hasHighlited;
  }
}
