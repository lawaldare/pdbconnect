import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ChangeDetectorRef,
  HostListener,
  Output,
  EventEmitter,
  input,
  ViewChild,
  ElementRef,
  signal,
  computed,
  DestroyRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import * as NightingaleManager from '@nightingale-elements/nightingale-manager';
import * as NightingaleNavigation from '@nightingale-elements/nightingale-navigation';
// import "@nightingale-elements/nightingale-sequence-heatmap";
import { filter, map, switchMap } from 'rxjs';
import NightingaleSequenceHeatmap from '@nightingale-elements/nightingale-sequence-heatmap';
import * as d3 from 'd3';
import { MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { InteractionsApiService } from './interactions-heatmap.service';
import { ViewerData } from './data-models/viewer-data';
import { INTX_NAME_STANDARDIZER, processInitialData, sortAAsByIntFreq, sortAAsByType, filterRescaleData } from './interactions-heatmap-data-processing';
import { AMINOACIDSIMAGE, CATEGORIESIMAGE, AminoAcidOneCode, InteractionNames, CategoryNames, AminoAcidCode, AATHREETOONE } from './interactions-heatmap.constant';
import { PDBIntxData } from './data-models/interaction.model';

// import NightingaleSequenceHeatmap from '@nightingale-elements/nightingale-sequence-heatmap'

// Necessary lines added to avoid tree shaking of Nightingale components
const _nightingaleRefs = [NightingaleManager, NightingaleNavigation, NightingaleSequenceHeatmap];

@Component({
  selector: 'lib-interactions-heatmap',
  standalone: true,
  imports: [CommonModule, MatRadioButton, MatCheckbox, ToolTipComponent],
  templateUrl: './interactions-heatmap.component.html',
  styleUrl: './interactions-heatmap.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InteractionsHeatmapComponent implements AfterViewInit {
  public ligandId = input.required<string>();
  private ligandIdObservable$ = toObservable(this.ligandId);
  public interactions = input.required<PDBIntxData>();
  private interactionsObservable$ = toObservable(this.interactions);
  @Output() newFilteringEvent = new EventEmitter<string>();
  public atomNumber = input.required<number>();

  private interactionsApiService = inject(InteractionsApiService);
  private readonly destroyRef = inject(DestroyRef);

  public viewerData = signal<ViewerData | undefined>(undefined);

  public atomNamesList = signal<string[] | undefined>(undefined);
  public atomNamesString = computed(() => this.atomNamesList()?.join(',') ?? '');

  public aminoAcidsLegend = signal<string[]>([]);

  public interactionFilters = computed(() => this.viewerData()?.validFilters ?? []);

  private isMouseHovering = false;
  // nightingaleAtoms: unknown;
  heatmapAtomsElement!: NightingaleSequenceHeatmap;
  heatmapResidsElement!: NightingaleSequenceHeatmap;

  atomDomainMap!: number[];
  atomColorMap!: string[];
  residDomainMap!: number[];
  residColorMap!: string[];

  @ViewChild('ligAtomsSequence', { static: false }) nightingaleAtomsRef!: ElementRef;
  @ViewChild('heatmapAtoms', { static: false }) heatmapAtomsRef!: ElementRef;
  @ViewChild('heatmapResids', { static: false }) heatmapResidsRef!: ElementRef;

  private aminoAcidsImgs = AMINOACIDSIMAGE;

  private categoriesImgs = CATEGORIESIMAGE;

  public categoryNames = Object.keys(this.categoriesImgs);

  getImgForAA(aa: string) {
    return this.aminoAcidsImgs[aa as AminoAcidOneCode];
  }
  getFilterName(filter: string) {
    return INTX_NAME_STANDARDIZER[filter as InteractionNames];
  }
  getImgForCategory(cat: string) {
    return this.categoriesImgs[cat as CategoryNames];
  }

  @HostListener('document:PDB.ligand.showAtom', ['$event']) atomMouseOver(e: CustomEvent) {
    if (e.detail.external !== false && this.isMouseHovering === false) {
      const atomName = e.detail.atomName;
      let toSend, atomDatum;
      const viewerData = this.viewerData();
      const atomNamesList = this.atomNamesList();
      if (viewerData && atomNamesList && atomNamesList.length > 0) {
        const atomNum = atomNamesList.indexOf(atomName) + 1;
        atomDatum = viewerData.averages[atomNum - 1];
        toSend = `${atomNum}:${atomNum}`;
      }

      // On heatmap zoom dispatch event to Nightingale
      (this.nightingaleAtomsRef.nativeElement as HTMLElement).dispatchEvent(
        new CustomEvent('change', {
          detail: {
            value: toSend,
            type: 'highlight',
          },
          bubbles: true,
          cancelable: true,
        })
      );
      this.forceShowTooltipAtoms(atomDatum);
    }
    this.adjustTooltipPosition();
  }

  @HostListener('document:PDB.ligand.hideAtom', ['$event']) atomMouseOut(e: CustomEvent) {
    if (e.detail.external !== false && this.isMouseHovering === false) {
      (this.nightingaleAtomsRef.nativeElement as HTMLElement).dispatchEvent(
        new CustomEvent('change', {
          detail: {
            value: null,
            type: 'highlight',
          },
          bubbles: true,
          cancelable: true,
        })
      );
      this.destroyForcedTooltipAtoms();
    }
  }

  private waitForElm(selector: string) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async setupHeatmapAtoms(viewerData: ViewerData, atomNamesList: string[]) {
    // await new Promise((resolve) => setTimeout(resolve, 300));
    // const methodList = Object.getOwnPropertyNames(Object.getPrototypeOf(this.heatmapAtomsRef.nativeElement));
    // console.log("has setHeatmapData");
    // console.log(methodList.indexOf("setHeatmapData") > -1);
    await customElements.whenDefined('nightingale-sequence-heatmap-new');

    const heatmapAtoms = this.heatmapAtomsRef.nativeElement as NightingaleSequenceHeatmap;
    this.heatmapAtomsElement = heatmapAtoms;
    await this.heatmapAtomsElement.updateComplete;

    this.heatmapAtomsElement.setHeatmapData(
      viewerData['xDomain'], //xDomain
      ['ATM'], //yDomain
      viewerData['averages']
    );
    await this.waitForElm('#heatmap-atoms');
    this.heatmapAtomsElement?.heatmapInstance?.setTooltip((d, x, y, xIndex, yIndex) => {
      const returnHTML = `
        Ligand atom: <b>${d['atomName']}</b><br />
        Atom-wise interactions: <b>${d['score'].toFixed(2)}%</b><br />
        `;
      return returnHTML;
    });
    this.setAtomsColorScale(viewerData);
    this.heatmapAtomsElement?.heatmapInstance?.events.hover.subscribe((e: any) => {
      if (e.cell !== undefined) {
        if (e.cell.datum === undefined) {
          this.isMouseHovering = false;
          document.dispatchEvent(
            new CustomEvent('PDB.ligHeatmap.mouseout', {
              detail: {},
              bubbles: true,
            })
          );
          return;
        }
        this.isMouseHovering = true;
        const atomName = atomNamesList[e.cell.datum.xValue - 1];
        document.dispatchEvent(
          new CustomEvent('PDB.ligHeatmap.mouseover', {
            detail: {
              name: atomName,
            },
            bubbles: true,
          })
        );
      } else {
        this.isMouseHovering = false;
        document.dispatchEvent(
          new CustomEvent('PDB.ligHeatmap.mouseout', {
            detail: {},
            bubbles: true,
          })
        );
      }
    });
  }

  async setupHeatmapResids(viewerData: ViewerData, atomNamesList: string[]) {
    await customElements.whenDefined('nightingale-sequence-heatmap-new');
    const heatmapResids = this.heatmapResidsRef.nativeElement as NightingaleSequenceHeatmap;
    this.heatmapResidsElement = heatmapResids;
    await this.heatmapResidsElement.updateComplete;

    this.heatmapResidsElement.setHeatmapData(
      viewerData['xDomain'], //xDomain
      viewerData['yDomain'], //yDomain
      viewerData['heatmap'] // heatmap data
    );
    await this.waitForElm('#heatmap-resids');
    this.heatmapResidsElement?.heatmapInstance?.setTooltip((d, x, y, xIndex, yIndex) => {
      const returnHTML = `
        Ligand atom: <b>${d['atomName']}</b><br />
        Amino acid: <b>${d['residue']}</b><br />
        Pairwise interactions: <b>${d['score'].toFixed(2)}%</b><br />
        `;
      return returnHTML;
    });
    this.setResidsColorScale(viewerData);
    this.heatmapResidsElement?.heatmapInstance?.events.hover.subscribe((e: any) => {
      if (e.cell !== undefined) {
        if (e.cell.datum === undefined) return;
        const atomName = atomNamesList[e.cell.datum.xValue - 1];
        this.isMouseHovering = true;
        document.dispatchEvent(
          new CustomEvent('PDB.ligHeatmap.mouseover', {
            detail: {
              name: atomName,
            },
            bubbles: true,
          })
        );
      } else {
        this.isMouseHovering = false;
        document.dispatchEvent(
          new CustomEvent('PDB.ligHeatmap.mouseout', {
            detail: {},
            bubbles: true,
          })
        );
      }
    });
  }

  private async initialZoomOut() {
    await customElements.whenDefined('nightingale-navigation');
    await customElements.whenDefined('nightingale-sequence-heatmap-new');
    const zoomOutEl = document.querySelector('.visualisation-column nightingale-navigation');
    if (!zoomOutEl) return;
    console.log('dispatched!!');
    zoomOutEl.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: 1,
          type: 'display-start',
        },
        bubbles: true,
        cancelable: true,
      })
    );
    zoomOutEl.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.viewerData.length,
          type: 'display-end',
        },
        bubbles: true,
        cancelable: true,
      })
    );
  }

  ngAfterViewInit() {
    this.ligandIdObservable$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((id) => !!id),
        switchMap((id) =>
          this.interactionsApiService.fetchCompoundAtoms(id).pipe(
            map((rawData) => this.parseAtomNames(rawData)),
            map((parsed) => {
              this.atomNamesList.set(parsed); // set atomNamesList
              return id; // pass ligandId forward
            })
          )
        ),
        switchMap((ligandId) =>
          this.interactionsObservable$.pipe(
            filter((interactions) => !!interactions),
            map(async (interactions) => {
              const data = interactions[ligandId];
              const atoms = this.atomNamesList();
              if (data && atoms) {
                const viewerData = processInitialData(data, atoms);
                const aas = viewerData.yDomain.map((aa) => AATHREETOONE[aa as AminoAcidCode]);
                this.aminoAcidsLegend.set(aas);
                this.viewerData.set(viewerData);
                await this.setupHeatmapAtoms(viewerData, atoms);
                await this.setupHeatmapResids(viewerData, atoms);
                // await this.initialZoomOut();
              }
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private parseAtomNames(raw: unknown): string[] {
    return (raw as string)
      .split('_chem_comp_atom.pdbx_ordinal')[1]
      .split('#')[0]
      .split(/\r?\n/)
      .filter((line) => line.length > 4)
      .map((line) => line.split(/\s+/)[1])
      .map((atom) => atom.replace(/"/g, ''))
      .filter((atom) => atom.charAt(0) !== 'H');
  }

  private setAtomsColorScale(viewerData: ViewerData) {
    const score = viewerData['averages'].map((v: any) => v.score as number);
    const maxScore = Math.max(...score);
    this.atomDomainMap = [0, 0.01, maxScore];
    this.atomColorMap = ['#ffffff', '#a0bb9e', '#505d50'];
    const atomColorScale = d3.scaleLinear(this.atomDomainMap, this.atomColorMap);
    this.heatmapAtomsElement?.heatmapInstance?.setColor((d: any) => atomColorScale(d['score']));
  }

  private setResidsColorScale(viewerData: ViewerData) {
    const score = viewerData['heatmap'].map((v: any) => v.score as number);
    const maxScore = Math.max(...score);
    this.residDomainMap = [0, 0.01, maxScore];
    this.residColorMap = ['#FFFFFF', '#B99EBB', '#2b232b'];
    const residColorScale = d3.scaleLinear(this.residDomainMap, this.residColorMap);
    this.heatmapResidsElement?.heatmapInstance?.setColor((d: any) => residColorScale(d['score']));
  }

  public changeSorting(sortType: string) {
    const currentViewerData = this.viewerData();
    if (!currentViewerData) return;
    let newViewerData: ViewerData | undefined;
    if (sortType === 'by_frequency' && currentViewerData['sortType'] !== 'IntFreq') {
      newViewerData = sortAAsByIntFreq(currentViewerData);
      this.heatmapResidsElement.setHeatmapData(
        newViewerData['xDomain'], //xDomain
        newViewerData['yDomain'], //yDomain
        newViewerData['heatmap'] // heatmap data
      );
      this.viewerData.set(newViewerData);
    } else if (sortType === 'by_aa_props' && currentViewerData['sortType'] !== 'AAProp') {
      newViewerData = sortAAsByType(currentViewerData);
      this.heatmapResidsElement.setHeatmapData(
        newViewerData['xDomain'], //xDomain
        newViewerData['yDomain'], //yDomain
        newViewerData['heatmap'] // heatmap data
      );
    }
    if (newViewerData) {
      this.viewerData.set(newViewerData);
      const aas = newViewerData.yDomain.map((aa) => AATHREETOONE[aa as AminoAcidCode]);
      this.aminoAcidsLegend.set(aas);
    }
  }

  public clearFilters() {
    const newViewerData = this.viewerData();
    if (!newViewerData) return;
    newViewerData['filters'] = [];
    this.viewerData.set(newViewerData);
    this.triggerFiltering();
  }

  public filterByInteraction(eventTarget: EventTarget, filterName: string) {
    const newViewerData = this.viewerData();
    if (!newViewerData) return;
    const isChecked = (eventTarget as HTMLInputElement).checked;
    let changed = false;
    const idxOfFilter = newViewerData['filters'].indexOf(filterName);

    if (isChecked && idxOfFilter === -1) {
      newViewerData['filters'].push(filterName);
      changed = true;
    } else if (!isChecked && idxOfFilter > -1) {
      newViewerData['filters'].splice(idxOfFilter, 1);
      changed = true;
    }
    if (changed) {
      this.viewerData.set(newViewerData);
      this.triggerFiltering();
    }
  }

  public hasFilter(filterName: string) {
    const currentViewerData = this.viewerData();
    if (!currentViewerData) return false;
    return currentViewerData['filters'].indexOf(filterName) > -1;
  }

  private triggerFiltering() {
    const currentViewerData = this.viewerData();
    if (!currentViewerData) return;

    const newViewerData = filterRescaleData(currentViewerData);
    this.heatmapResidsElement.setHeatmapData(
      newViewerData['xDomain'], //xDomain
      newViewerData['yDomain'], //yDomain
      newViewerData['heatmap'] // heatmap data
    );
    this.heatmapAtomsElement.setHeatmapData(
      newViewerData['xDomain'], //xDomain
      ['ATM'], //yDomain
      newViewerData['averages'] // heatmap data
    );
    this.setAtomsColorScale(newViewerData);
    this.setResidsColorScale(newViewerData);
    const filters = newViewerData['filters'].length > 0 ? newViewerData['filters'] : ['TOTAL'];
    const joinedFilters = `["${filters.join('","')}"]`;
    this.newFilteringEvent.emit(joinedFilters);
    const aas = newViewerData.yDomain.map((aa) => AATHREETOONE[aa as AminoAcidCode]);
    this.aminoAcidsLegend.set(aas);
    this.viewerData.set(newViewerData);
  }

  private async forceShowTooltipAtoms(atomDatum: any) {
    document.getElementById('removable-div')?.remove();
    const whereToPlace = await this.waitForElm('#heatmap-atoms > div > div');
    const xCoord = (<any>this.heatmapAtomsElement.heatmapInstance).state.scales.worldToCanvas.x(atomDatum.xValue - 1);

    const tooltipDiv = document.createElement('div');
    tooltipDiv.setAttribute('id', 'removable-div');
    tooltipDiv.setAttribute('class', 'heatmap-tooltip-box');
    tooltipDiv.style.position = 'absolute';
    tooltipDiv.style.left = `${xCoord}px`;
    tooltipDiv.style.bottom = '17px';
    tooltipDiv.style.display = 'unset';

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'heatmap-tooltip-content');
    contentDiv.innerHTML = `Ligand atom: <b>${atomDatum.atomName}</b><br>
    Atom-wise interactions: <b>${atomDatum.score.toFixed(2)}%</b><br>
    `;
    tooltipDiv.appendChild(contentDiv);
    (whereToPlace as HTMLElement).appendChild(tooltipDiv);
  }

  private async destroyForcedTooltipAtoms() {
    document.getElementById('removable-div')?.remove();
  }

  private async adjustTooltipPosition() {
    const insideAtoms = await this.waitForElm('#heatmap-atoms > div > div');
    const insideResids = await this.waitForElm('#heatmap-resids > div > div');
    this.adjustTooltipElements(insideAtoms as HTMLElement);
    this.adjustTooltipElements(insideResids as HTMLElement);
  }

  private adjustTooltipElements(parent: HTMLElement) {
    const leftEdgeBoundary = this.heatmapResidsElement.getBoundingClientRect().left;
    const rightEdgeBoundary = this.heatmapResidsElement.getBoundingClientRect().right - 30;
    // const rightEdgeBoundary = window.innerWidth - 10;
    const selectors = ['.heatmap-pinned-tooltip-box', '.heatmap-tooltip-box'];

    for (const selector of selectors) {
      const el1 = parent.querySelector(selector);
      if (el1 !== null) {
        const el1Bounds = el1.getBoundingClientRect();
        const el1xValue = el1Bounds.x + 0;
        const el1xWidth = el1Bounds.width + 0;

        const distanceToLeftBoundary = el1xValue - leftEdgeBoundary;
        const distanceToRightBoundary = rightEdgeBoundary - (el1xValue + el1xWidth);

        if (distanceToRightBoundary < 0) {
          (el1 as HTMLElement).style.translate = '-270px';
          if (selector === '.heatmap-pinned-tooltip-box') {
            const pin = el1.querySelector('.heatmap-pinned-tooltip-pin');
            (pin as HTMLElement).style.translate = '265px';
            (pin as HTMLElement).style.transform = 'rotateY(180deg)';
          }
        }
        if (distanceToLeftBoundary < 0) {
          (el1 as HTMLElement).style.translate = '0px';
          if (selector === '.heatmap-pinned-tooltip-box') {
            const pin = el1.querySelector('.heatmap-pinned-tooltip-pin');
            (pin as HTMLElement).style.translate = '0px';
            (pin as HTMLElement).style.transform = 'rotateY(0deg)';
          }
        }
      }
    }
  }
}
