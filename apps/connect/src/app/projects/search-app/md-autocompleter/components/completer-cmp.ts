"use strict";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  forwardRef,
  AfterViewInit,
  ElementRef,
} from "@angular/core";

import { CtrCompleter } from "../directives/ctr-completer";
import { CompleterData } from "../services/completer-data";
import { CompleterService } from "../services/completer-service";
import { CompleterItem } from "./completer-item";
import {
  MAX_CHARS,
  MIN_SEARCH_LENGTH,
  PAUSE,
  TEXT_SEARCHING,
  TEXT_NORESULTS,
} from "../globals";
// import { MdInputModule } from '@angular/material';
import { MatInputModule } from "@angular/material/input";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";

const noop = () => {};

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CompleterCmp),
  multi: true,
};

@Component({
    selector: "ng2-completer",
    template: `
    <div class="completer-holder" ctrCompleter>
      <mat-form-field class="completer-input">
        <input
          matInput
          #ctrInput
          type="search"
          class="completer-input"
          ctrInput
          [ngClass]="inputClass"
          [(ngModel)]="searchStr"
          (ngModelChange)="onChange($event)"
          [attr.name]="inputName"
          [placeholder]="placeholder"
          [attr.maxlength]="maxChars"
          [tabindex]="fieldTabindex"
          [disabled]="disableInput"
          [clearSelected]="clearSelected"
          [overrideSuggested]="overrideSuggested"
          [fillHighlighted]="fillHighlighted"
          (blur)="onBlur()"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          />
        </mat-form-field>
    
        <div
          class="completer-dropdown-holder"
        *ctrList="
          dataService;
          minSearchLength: minSearchLength;
          pause: pause;
          autoMatch: autoMatch;
          let items = results;
          let searchActive = searching;
          let isInitialized = searchInitialized
        "
          >
          @if (isInitialized) {
            <div class="completer-dropdown" ctrDropdown>
              @if (searchActive && displaySearching) {
                <div
                  class="completer-searching"
                  >
                  {{ textSearching }}
                </div>
              }
              @if (!searchActive && (!items || items.length === 0)) {
                <div
                  class="completer-no-results"
                  >
                  {{ textNoResults }}
                </div>
              }
              @for (item of items; track item; let rowIndex = $index) {
                <div
                  class="completer-row-wrapper"
                  >
                  <div class="completer-row" [ctrRow]="rowIndex" [dataItem]="item">
                    @if (item.image || item.image === '') {
                      <div
                        class="completer-image-holder"
                        >
                        @if (item.image != '') {
                          <img
                            src="{{ item.image }}"
                            class="completer-image"
                            />
                        }
                        @if (item.image === '') {
                          <div
                            class="completer-image-default"
                          ></div>
                        }
                      </div>
                    }
                    <div
                      class="completer-item-text"
                [ngClass]="{
                  'completer-item-text-image': item.image || item.image === ''
                }"
                      >
                      <completer-list-item
                        class="completer-title"
                        [text]="item.title"
                        [matchClass]="matchClass"
                        [searchStr]="searchStr"
                        [type]="'title'"
                      ></completer-list-item>
                      @if (item.description && item.description != '') {
                        <completer-list-item
                          class="completer-description"
                          [text]="item.description"
                          [matchClass]="matchClass"
                          [searchStr]="searchStr"
                          [type]="'description'"
                          >
                        </completer-list-item>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    `,
    styles: [
        `
      .completer-input {
        width: 100%;
        font-size: 16px;
        margin-top: 2px;
      }
      .completer-dropdown-holder {
        margin-top: -12px;
      }
      .completer-dropdown {
        border-color: #ececec;
        border-width: 1px;
        border-style: solid;
        border-radius: 2px;
        width: 95%;
        padding: 6px;
        cursor: pointer;
        z-index: 9999;
        position: absolute;
        margin-top: -6px;
        background-color: #ffffff;
      }

      .completer-row {
        padding: 5px;
        color: #000000;
        margin-bottom: 4px;
        clear: both;
        display: inline-block;
        width: 99%;
      }

      .completer-selected-row {
        background-color: lightblue;
        color: #ffffff;
      }

      .completer-description {
        font-size: 14px;
      }

      .completer-image-default {
        width: 16px;
        height: 16px;
        // background-image: url("demo/res/img/default.png");
      }

      .completer-image-holder {
        float: left;
        width: 10%;
      }
      .completer-item-text-image {
        float: right;
        width: 90%;
      }
    `,
    ],
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class CompleterCmp
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @Input() public dataService: CompleterData;
  @Input() public datasource: CompleterData | string | Array<any>;
  @Input() public inputName = "";
  @Input() public pause = PAUSE;
  @Input() public minSearchLength = MIN_SEARCH_LENGTH;
  @Input() public maxChars = MAX_CHARS;
  @Input() public overrideSuggested = false;
  @Input() public clearSelected = false;
  @Input() public fillHighlighted = true;
  @Input() public placeholder = "";
  @Input() public matchClass: string;
  @Input() public textSearching = TEXT_SEARCHING;
  @Input() public textNoResults = TEXT_NORESULTS;
  @Input() public fieldTabindex: number;
  @Input() public autoMatch = false;
  @Input() public disableInput = false;
  @Input() public inputClass: string;
  @Input() public autofocus = false;

  @Output() public selected = new EventEmitter<CompleterItem>();
  @Output() public highlighted = new EventEmitter<CompleterItem>();
  @Output() public blur = new EventEmitter<void>();

  @ViewChild(CtrCompleter) public completer: CtrCompleter;
  @ViewChild("ctrInput") public ctrInput: ElementRef;

  public searchStr = "";
  public control = new FormControl("");

  private displaySearching = true;
  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;

  constructor(private completerService: CompleterService) {}

  get value(): any {
    return this.searchStr;
  }

  set value(v: any) {
    if (v !== this.searchStr) {
      this.searchStr = v;
    }
    // Propagate the change in any case
    this._onChangeCallback(v);
  }

  public onTouched() {
    this._onTouchedCallback();
  }

  public writeValue(value: any) {
    this.searchStr = value;
  }

  public registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  public ngAfterViewInit() {
    if (this.autofocus && this.ctrInput) {
      this.ctrInput.nativeElement.focus();
    }
  }

  public ngOnInit() {
    if (this.datasource) {
      if (this.datasource instanceof Array) {
        this.dataService = this.completerService.local(this.datasource);
      } else if (typeof this.datasource === "string") {
        this.dataService = this.completerService.remote(this.datasource);
      } else {
        this.dataService = this.datasource;
      }
    }
    this.completer.selected.subscribe((item: CompleterItem) => {
      let title = item ? item.title : "";
      this.selected.emit(item);
      this._onChangeCallback(title);
    });
    this.completer.highlighted.subscribe((item: CompleterItem) => {
      this.highlighted.emit(item);
    });

    if (this.textSearching === "false") {
      this.displaySearching = false;
    }
  }

  public onBlur() {
    this.blur.emit();
    this.onTouched();
  }

  public onChange(value: string) {
    this.value = value;
  }

  public open(searchValue = "") {
    this.completer.search(searchValue);
  }

  public close() {
    this.completer.clear();
  }
}
