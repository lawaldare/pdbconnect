import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, HostListener, ElementRef, OnChanges, SimpleChanges, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from '@pdbc/core';
import { forkJoin } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly http = inject(HttpClient);
  public components: any[] = [];
  private urls: Record<string, string> = {
    solr: 'https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/',
    proteins: 'https://www.ebi.ac.uk/proteins/api/proteins/',
  };

  private cachedData$: any = {
    solr: {},
    proteins: {},
  };

  public getKbData(pdbeKbId: string, type: string) {
    const solrUrl = this.urls[type] + '' + pdbeKbId;

    if (!this.cachedData$[type][pdbeKbId]) {
      this.cachedData$[type][pdbeKbId] = this.http.get(solrUrl).pipe(
        map((response) => response),
        shareReplay(1),
        catchError((error) => {
          return error;
        })
      );
    }
    return this.cachedData$[type][pdbeKbId];
  }
}

@Component({
  selector: 'pdbc-tooltip-content',
  styleUrls: ['./tooltip.component.css'],
  template: `
    <div class="mainContainer" [style.marginLeft]="left" [style.marginTop]="top" [style.height]="containerHeight">
      <div class="title">{{ tooltipTitle }}</div>
      @if (tooltipImage) {
        <div class="imgContainer">
          @if (!hideLoader) {
            <div class="spinnerBox">
              <mat-progress-spinner color="primary" mode="indeterminate" style="margin:50px 0 0 50px"></mat-progress-spinner>
            </div>
          }
          <div class="imgBox">
            <img src="{{ tooltipImage }}" onerror="this.src='https://www.ebi.ac.uk/pdbe/entry/static/images/notFound.jpg'" [style.imgHeight]="imgHeight" />
          </div>
        </div>
      }
      @if (pdbeKbId) {
        <div class="imgContainer">
          @if (loadingTemplate) {
            <div class="spinnerBox">
              <mat-progress-spinner color="primary" mode="indeterminate" style="margin:0 0 0 50px"></mat-progress-spinner>
            </div>
          }
          @if (tooltipHtml) {
            <div [innerHTML]="tooltipHtml"></div>
          }
        </div>
      }
    </div>
  `,
  imports: [CommonModule, MaterialModule],
})
export class TooltipContentComponent implements OnChanges, OnInit {
  private readonly tooltipService = inject(TooltipService);
  private readonly _sanitizer = inject(DomSanitizer);
  @Input() tooltipTitle!: string;
  @Input() tooltipImage!: string;
  @Input() tooltipRef: any;
  @Input() tooltipPos: any;
  @Input() pdbeKbId: any;
  @Input() hideLoader: any;
  @Input() isCarbImage: any;

  top = '0px';
  left = '0px';
  containerHeight = '';
  imgHeight = '';
  loadingTemplate!: boolean;
  tooltipHtml: any;

  ngOnInit() {
    if (this.isCarbImage) {
      this.containerHeight = '155px';
      this.imgHeight = '200px';
    }
    if (this.pdbeKbId) {
      this.containerHeight = '145px';
      this.loadingTemplate = true;

      const stats = this.tooltipService.getKbData(this.pdbeKbId, 'solr');
      const uniportData = this.tooltipService.getKbData(this.pdbeKbId, 'proteins');

      forkJoin(stats, uniportData).subscribe((result: any) => {
        const unpData = result[1] as any;
        if (unpData && unpData.protein && unpData.protein.recommendedName && unpData.protein.recommendedName.fullName) {
          this.tooltipTitle = `Data available for ${this.pdbeKbId}: ${unpData.protein.recommendedName.fullName.value}`;
        }

        const kbData = {
          pdbs: 0,
          ligands: 0,
          interaction_partners: 0,
        };
        const res = result[0] as any;
        if (res) {
          for (const key in res) {
            if (res[key].pdbs > 0) kbData.pdbs = res[key].pdbs;
            if (res[key].ligands > 0) kbData.ligands = res[key].ligands;
            if (res[key].interaction_partners > 0) kbData.interaction_partners = res[key].interaction_partners;
          }
        }

        const tempHtml = `<div style="float:left;text-align:center;width:75px;${kbData.pdbs == 0 ? 'color:#cacaca;' : ''}">
            <div>
              <i class="icon icon-conceptual summary-icon" data-icon="s" style="font-size:40px"></i>
            </div>
            <div style="font-size:12px;">${kbData.pdbs}</div>
            <div style="font-size:12px;">Structures</div>
          </div>
          <div style="float:left;text-align:center;width:75px;${kbData.ligands == 0 ? 'color:#cacaca;' : ''}">
            <div>
              <i class="icon icon-conceptual summary-icon" data-icon="b" style="font-size:40px"></i>
            </div>
            <div style="font-size:12px;">${kbData.ligands}</div>
            <div style="font-size:12px;">Ligands</div>
          </div>
          <div style="float:left;text-align:center;width:75px;${kbData.interaction_partners == 0 ? 'color:#cacaca;' : ''}">
            <div>
              <i class="icon icon-conceptual summary-icon" data-icon="y" style="font-size:40px"></i>
            </div>
            <div style="font-size:12px;">${kbData.interaction_partners}</div>
            <div style="font-size:12px;">Interactions</div>
          </div>`;
        this.loadingTemplate = false;
        this.tooltipHtml = this._sanitizer.bypassSecurityTrustHtml(tempHtml);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const bottomSpace = window.innerHeight - this.tooltipPos.clientY;
    let yVal = 250;
    let bottomThreshold = 300;

    if (this.pdbeKbId || this.isCarbImage) {
      yVal = 165;
      bottomThreshold = 200;
    }
    if (bottomSpace > bottomThreshold) {
      this.top = this.tooltipPos.clientY + 20 + 'px';
    } else {
      this.top = this.tooltipPos.clientY - yVal + 'px';
    }

    this.left = this.tooltipPos.clientX + 'px';
  }
}

@Component({
  selector: 'pdbc-tooltip-container',
  template: `
    <div class="tooltip-container">
      @for (tooltip of tooltipService.components; track tooltip) {
        <pdbc-tooltip-content
          [tooltipTitle]="tooltip.title"
          [tooltipImage]="tooltip.image"
          [tooltipRef]="tooltip.ref"
          [tooltipPos]="tooltip.posDetails"
          [pdbeKbId]="tooltip.pdbeKbId"
          [hideLoader]="tooltip.hideLoader"
          [isCarbImage]="tooltip.isCarbImage"
        >
        </pdbc-tooltip-content>
      }
    </div>
  `,
  imports: [CommonModule, TooltipContentComponent],
})
export class TooltipContainerComponent {
  public readonly tooltipService = inject(TooltipService);
}
