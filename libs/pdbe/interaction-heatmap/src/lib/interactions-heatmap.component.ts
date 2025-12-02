import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, HostListener, Output, EventEmitter, input, signal, computed, DestroyRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, map, switchMap } from 'rxjs';
import type NightingaleSequenceHeatmap from '@nightingale-elements/nightingale-sequence-heatmap';
import * as d3 from 'd3';
import { MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { InteractionsApiService } from './interactions-heatmap.service';
import { ViewerData } from './data-models/viewer-data';
import { INTX_NAME_STANDARDIZER, processInitialData, sortAAsByIntFreq, sortAAsByType, filterRescaleData } from './interactions-heatmap-data-processing';
import { AMINOACIDSIMAGE, CATEGORIESIMAGE, AminoAcidOneCode, InteractionNames, CategoryNames, AminoAcidCode, AATHREETOONE } from './interactions-heatmap.constant';
import { PDBIntxData } from './data-models/interaction.model';
import { ProtvistaWrapperComponent } from '@pdbe-lib/pv-nightingale-components';

@Component({
  selector: 'lib-interactions-heatmap',
  standalone: true,
  imports: [CommonModule, MatRadioButton, MatCheckbox, ToolTipComponent, ProtvistaWrapperComponent],
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
  public protvistaData = signal<any[] | undefined>(undefined);

  public aminoAcidsLegend = signal<string[]>([]);

  public interactionFilters = computed(() => this.viewerData()?.validFilters ?? []);

  private isMouseHovering = false;
  heatmapAtomsElement!: NightingaleSequenceHeatmap;
  heatmapResidsElement!: NightingaleSequenceHeatmap;

  atomDomainMap!: number[];
  atomColorMap!: string[];
  residDomainMap!: number[];
  residColorMap!: string[];

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

  @HostListener('document:PDB.ligand.showAtom', ['$event']) async atomMouseOver(e: CustomEvent) {
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
      const heatmapAtoms = document.querySelector('#atoms-hm-heatmap-track') as NightingaleSequenceHeatmap;
      if (heatmapAtoms) {
        heatmapAtoms.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              value: toSend,
              type: 'highlight',
            },
            bubbles: true,
            cancelable: true,
          })
        );
        await this.forceShowTooltipAtoms(atomDatum);
        await this.adjustTooltipPosition();
      }
    }
  }

  @HostListener('document:PDB.ligand.hideAtom', ['$event']) atomMouseOut(e: CustomEvent) {
    if (e.detail.external !== false && this.isMouseHovering === false) {
      const heatmapAtoms = document.querySelector('#atoms-hm-heatmap-track') as NightingaleSequenceHeatmap;
      if (heatmapAtoms) {
        heatmapAtoms.dispatchEvent(
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

  async setupHeatmapAtoms(atomNamesList: string[]) {
    await customElements.whenDefined('nightingale-sequence-heatmap');
    await this.waitForElm('#heatmap-atoms');

    const heatmapAtoms = document.querySelector('#atoms-hm-heatmap-track') as NightingaleSequenceHeatmap;
    this.heatmapAtomsElement = heatmapAtoms;
    await this.heatmapAtomsElement.updateComplete;

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

  async setupHeatmapResids(atomNamesList: string[]) {
    await customElements.whenDefined('nightingale-sequence-heatmap');
    await this.waitForElm('#heatmap-resids');

    const heatmapResids = document.querySelector('#resids-hm-heatmap-track') as NightingaleSequenceHeatmap;
    this.heatmapResidsElement = heatmapResids;
    await this.heatmapResidsElement.updateComplete;

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
                // eslint-disable-next-line prefer-const
                let viewerData = processInitialData(data, atoms);
                const aas = viewerData.yDomain.map((aa) => AATHREETOONE[aa as AminoAcidCode]);
                this.aminoAcidsLegend.set(aas);
                this.viewerData.set(viewerData);

                const score = viewerData['averages'].map((v: any) => v.score as number);
                const maxScore = Math.max(...score);
                this.atomDomainMap = [0, 0.01, maxScore];
                this.atomColorMap = ['#ffffff', '#a0bb9e', '#505d50'];
                const atomColorScale = d3.scaleLinear(this.atomDomainMap, this.atomColorMap);

                const residScore = viewerData['heatmap'].map((v: any) => v.score as number);
                const maxResidScore = Math.max(...residScore);
                this.residDomainMap = [0, 0.01, maxResidScore];
                this.residColorMap = ['#FFFFFF', '#B99EBB', '#2b232b'];
                const residColorScale = d3.scaleLinear(this.residDomainMap, this.residColorMap);

                this.protvistaData.set([
                  {
                    id: 'atoms-hm',
                    type: 'TrackHeatmapSequence',
                    name: '',
                    heatmapId: 'heatmap-atoms',
                    data: viewerData['averages'],
                    xDomain: viewerData['xDomain'],
                    yDomain: ['ATM'],
                    checkpoints: [],
                    colours: [],
                    status: 'ready-has-data',
                    isExpandable: false,
                    trackHeight: 23,
                    hasXScale: false,
                    hasYScale: false,
                    tooltipContentFn: (d: any, x: number, y: number) => {
                      if (!d) return '';
                      // eslint-disable-next-line prefer-const
                      let tooltipContent = `
                        <div class="tooltip-data" data-trackid="atoms-hm" style="display: none"></div>
                        Ligand atom: <b>${d['atomName']}</b><br>
                        Atom-wise interactions: <b>${d['score'].toFixed(2)}%</b><br>
                      `;
                      return tooltipContent;
                    },
                    customColourScale: atomColorScale,
                  },
                  {
                    id: 'resids-hm',
                    type: 'TrackHeatmapSequence',
                    name: '',
                    heatmapId: 'heatmap-resids',
                    data: viewerData['heatmap'],
                    xDomain: viewerData['xDomain'],
                    yDomain: viewerData['yDomain'],
                    checkpoints: [],
                    colours: [],
                    status: 'ready-has-data',
                    isExpandable: false,
                    trackHeight: 390,
                    hasXScale: false,
                    hasYScale: false,
                    tooltipContentFn: (d: any, x: number, y: number) => {
                      if (!d) return '';
                      // eslint-disable-next-line prefer-const
                      let tooltipContent = `
                        <div class="tooltip-data" data-trackid="resids-hm" style="display: none"></div>
                        Ligand atom: <b>${d['atomName']}</b><br>
                        Amino acid: <b>${d['residue']}</b><br>
                        Pairwise interactions: <b>${d['score'].toFixed(2)}%</b><br>
                      `;
                      return tooltipContent;
                    },
                    customColourScale: residColorScale,
                  },
                ]);
                await this.setupHeatmapAtoms(atoms);
                await this.setupHeatmapResids(atoms);
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

    const xCoord = (<any>this.heatmapAtomsElement.heatmapInstance).state.scales.worldToSvg.x(atomDatum.xValue - 1);
    const tooltipDiv = document.createElement('div');
    tooltipDiv.setAttribute('id', 'removable-div');
    tooltipDiv.setAttribute('class', 'heatmap-tooltip-box');
    tooltipDiv.style.position = 'absolute';
    tooltipDiv.style.left = `${xCoord}px`;
    tooltipDiv.style.bottom = '-57px';
    tooltipDiv.style.display = 'unset';
    tooltipDiv.style.zIndex = '10';

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
    const parent = (await this.waitForElm('#heatmap-atoms > div > div')) as HTMLElement;

    const leftEdgeBoundary = this.heatmapResidsElement.getBoundingClientRect().left;
    const rightEdgeBoundary = this.heatmapResidsElement.getBoundingClientRect().right - 30;

    const selector = '.heatmap-tooltip-box';
    const el1 = parent.querySelector(selector);
    if (el1 !== null) {
      const el1Bounds = el1.getBoundingClientRect();
      const el1xValue = el1Bounds.x + 0;
      const el1xWidth = el1Bounds.width + 0;

      const distanceToLeftBoundary = el1xValue - leftEdgeBoundary;
      const distanceToRightBoundary = rightEdgeBoundary - (el1xValue + el1xWidth);

      if (distanceToRightBoundary < 0) {
        (el1 as HTMLElement).style.translate = '-247px';
      }
      if (distanceToLeftBoundary < 0) {
        (el1 as HTMLElement).style.translate = '0px';
      }
    }
  }
}
