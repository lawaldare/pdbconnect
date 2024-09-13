import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectorRef, HostListener, Output, EventEmitter, OnChanges, input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@nightingale-elements/nightingale-manager';
import '@nightingale-elements/nightingale-navigation';
// import "@nightingale-elements/nightingale-sequence-heatmap";
import { firstValueFrom, map } from 'rxjs';
import { InteractionsApiService } from './interactons-heatmap.service';
import { PDBIntxData } from '../../data-models/interaction.model';
import { LigIntCountsDictionary } from './data-models/lig-int-heatmap-data-api';
import { filterRescaleData, INTX_NAME_STANDARDIZER, processInitialData, sortAAsByIntFreq, sortAAsByType } from './interactions-heatmap-data-processing';
import { ViewerData } from './data-models/viewer-data';
import NightingaleSequenceHeatmap from '@nightingale-elements/nightingale-sequence-heatmap';
import * as d3 from 'd3';
import { MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { AminoAcidCode, AMINOACIDSIMAGE, CATEGORIESIMAGE, CategoryNames, InteractionNames } from './interactions-heatmap.constant';

// import NightingaleSequenceHeatmap from '@nightingale-elements/nightingale-sequence-heatmap';

@Component({
  selector: 'pdbc-interactions-heatmap',
  standalone: true,
  imports: [CommonModule, MatRadioButton, MatCheckbox],
  templateUrl: './interactions-heatmap.component.html',
  styleUrl: './interactions-heatmap.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InteractionsHeatmapComponent implements OnChanges {
  private interactionsApiService = inject(InteractionsApiService);
  private cdr = inject(ChangeDetectorRef);

  public viewerData!: ViewerData;
  public atomNamesList: string[] | undefined;
  public atomNamesString!: string;
  private isMouseHovering = false;
  nightingaleAtoms: unknown;
  heatmapAtomsElement!: NightingaleSequenceHeatmap;
  heatmapResidsElement!: NightingaleSequenceHeatmap;
  aminoAcidsLegend!: string[];
  interactionFilters!: string[];
  atomDomainMap!: number[];
  atomColorMap!: string[];
  residDomainMap!: number[];
  residColorMap!: string[];
  public ligandId = input.required<string>();
  public interactions = input.required<PDBIntxData>();
  @Output() newFilteringEvent = new EventEmitter<string>();

  private aminoAcidsImgs = AMINOACIDSIMAGE;

  private categoriesImgs = CATEGORIESIMAGE;

  public categoryNames = Object.keys(this.categoriesImgs);

  getImgForAA(aa: string) {
    return this.aminoAcidsImgs[aa as AminoAcidCode];
  }
  getFilterName(filter: string) {
    return INTX_NAME_STANDARDIZER[filter as InteractionNames];
  }
  getImgForCategory(cat: string) {
    return this.categoriesImgs[cat as CategoryNames];
  }

  @HostListener('document:PDB.ligand.showAtom', ['$event']) atomMouseOver(e: CustomEvent) {
    if (e.detail.external === false && this.isMouseHovering === false) {
      const atomName = e.detail.tooltip.split(' ')[0].split('<span>')[1];
      let toSend, atomDatum;
      if (this.atomNamesList?.length) {
        const atomNum = this.atomNamesList.indexOf(atomName) + 1;
        atomDatum = this.viewerData?.averages[atomNum - 1];
        toSend = `${atomNum}:${atomNum}`;
      }

      // On heatmap zoom dispatch event to Nightingale
      (this.nightingaleAtoms as HTMLElement).dispatchEvent(
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
    if (e.detail.external === false && this.isMouseHovering === false) {
      (this.nightingaleAtoms as HTMLElement).dispatchEvent(
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

  waitForElm(selector: string) {
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

  async createViewerData() {
    this.atomNamesList = undefined;
    const cifresultIntData: PDBIntxData = await this.interactions();
    const resultIntDataAcc: LigIntCountsDictionary = cifresultIntData[this.ligandId()];

    const cifData = await firstValueFrom(this.interactionsApiService.fetchCompoundAtoms(this.ligandId()));
    this.atomNamesList = (cifData as unknown as string)
      .split('_chem_comp_atom.pdbx_ordinal')[1]
      .split('#')[0]
      .split(/\r?\n/)
      .filter((eachLine: string) => eachLine.length > 4)
      .map((eachLine: string) => {
        return eachLine.split(/\s+/)[1];
      })
      .map((eachAtom: string) => eachAtom.split('"').join(''))
      .filter((eachAtom: string) => eachAtom.charAt(0) !== 'H');

    this.viewerData = processInitialData(resultIntDataAcc, this.atomNamesList);
    this.atomNamesString = this.atomNamesList.join(',');
    this.aminoAcidsLegend = this.viewerData.yDomain;
    this.interactionFilters = this.viewerData.validFilters;
    this.cdr.detectChanges();
    this.nightingaleAtoms = await this.waitForElm('#ligand-atoms-sequence');
  }

  async setupHeatmapAtoms() {
    const heatmapAtoms = await this.waitForElm('#heatmap-container-atoms');
    this.heatmapAtomsElement = heatmapAtoms as NightingaleSequenceHeatmap;
    this.heatmapAtomsElement.setHeatmapData(
      this.viewerData['xDomain'], //xDomain
      ['ATM'], //yDomain
      this.viewerData['averages']
    );
    await this.waitForElm('#heatmap-atoms');
    this.heatmapAtomsElement?.heatmapInstance?.setTooltip((d, x, y, xIndex, yIndex) => {
      const returnHTML = `
        <b>You are at</b> <br />

        Atom name: <b>${d['atomName']}</b><br />
        Ligand interactions frequency: <b>${d['freq']}</b><br />
        (Perc: <b>${d['perc']}%</b>)
        `;
      return returnHTML;
    });
    this.setAtomsColorScale();
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
        }
        this.isMouseHovering = true;
        const atomName = this.atomNamesList?.[e.cell.datum.xValue - 1];
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

  async setupHeatmapResids() {
    const heatmapResids = await this.waitForElm('#heatmap-container-resids');
    this.heatmapResidsElement = heatmapResids as NightingaleSequenceHeatmap;
    this.heatmapResidsElement.setHeatmapData(
      this.viewerData['xDomain'], //xDomain
      this.viewerData['yDomain'], //yDomain
      this.viewerData['heatmap'] // heatmap data
    );
    await this.waitForElm('#heatmap-resids');
    this.heatmapResidsElement?.heatmapInstance?.setTooltip((d, x, y, xIndex, yIndex) => {
      const returnHTML = `
        <b>You are at</b> <br />

        Atom name: <b>${d['atomName']}</b><br />
        Residue type: <b>${d['residue']}</b><br />
        Atom interactions frequency: <b>${d['freq']}</b><br />
        (Perc: <b>${d['perc']}%</b>)
        `;
      return returnHTML;
    });
    this.setResidsColorScale();
    this.heatmapResidsElement?.heatmapInstance?.events.hover.subscribe((e: any) => {
      if (e.cell !== undefined) {
        if (e.cell.datum === undefined) return;
        const atomName = this.atomNamesList?.[e.cell.datum.xValue - 1];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['interactions']?.currentValue) {
      (async () => {
        await this.createViewerData();
        await this.setupHeatmapAtoms();
        await this.setupHeatmapResids();
      })();
    }
  }

  setAtomsColorScale() {
    const maxValue = Math.max(...this.viewerData['averages'].map((v: any) => v.freq as number));
    const colorMin = '#a0bb9e';
    const colorMax = '#505d50';
    this.atomDomainMap = [0.01, maxValue];
    this.atomColorMap = [colorMin, colorMax];
    const atomColorScale = d3.scaleLinear(this.atomDomainMap, this.atomColorMap);
    this.heatmapAtomsElement?.heatmapInstance?.setColor((d: any) => atomColorScale(d['freq']));
  }

  setResidsColorScale() {
    const residMaxValue = 100.0;
    const residColorMin = '#B99EBB';
    const residColorMax = '#5D505D';
    this.residDomainMap = [0.0, 0.01, residMaxValue];
    this.residColorMap = ['#FFFFFF', residColorMin, residColorMax];
    const residColorScale = d3.scaleLinear(this.residDomainMap, this.residColorMap);
    this.heatmapResidsElement?.heatmapInstance?.setColor((d: any) => residColorScale(d['perc']));
  }

  changeSorting(sortType: string) {
    if (sortType === 'by_frequency' && this.viewerData['sortType'] !== 'IntFreq') {
      this.viewerData = sortAAsByIntFreq(this.viewerData);
      this.heatmapResidsElement.setHeatmapData(
        this.viewerData['xDomain'], //xDomain
        this.viewerData['yDomain'], //yDomain
        this.viewerData['heatmap'] // heatmap data
      );
    } else if (sortType === 'by_aa_props' && this.viewerData['sortType'] !== 'AAProp') {
      this.viewerData = sortAAsByType(this.viewerData);
      this.heatmapResidsElement.setHeatmapData(
        this.viewerData['xDomain'], //xDomain
        this.viewerData['yDomain'], //yDomain
        this.viewerData['heatmap'] // heatmap data
      );
    }
    this.aminoAcidsLegend = this.viewerData.yDomain;
  }

  clearFilters() {
    this.viewerData['filters'] = [];
    this.triggerFiltering();
  }

  filterByInteraction(eventTarget: EventTarget, filterName: string) {
    const isChecked = (eventTarget as HTMLInputElement).checked;
    let changed = false;
    const idxOfFilter = this.viewerData['filters'].indexOf(filterName);

    if (isChecked && idxOfFilter === -1) {
      this.viewerData['filters'].push(filterName);
      changed = true;
    } else if (!isChecked && idxOfFilter > -1) {
      this.viewerData['filters'].splice(idxOfFilter, 1);
      changed = true;
    }
    if (changed) {
      this.triggerFiltering();
    }
  }

  hasFilter(filterName: string) {
    return this.viewerData['filters'].indexOf(filterName) > -1;
  }

  triggerFiltering() {
    this.viewerData = filterRescaleData(this.viewerData, this.viewerData['freqType']);
    this.heatmapResidsElement.setHeatmapData(
      this.viewerData['xDomain'], //xDomain
      this.viewerData['yDomain'], //yDomain
      this.viewerData['heatmap'] // heatmap data
    );
    this.heatmapAtomsElement.setHeatmapData(
      this.viewerData['xDomain'], //xDomain
      ['ATM'], //yDomain
      this.viewerData['averages'] // heatmap data
    );
    this.setAtomsColorScale();
    this.setResidsColorScale();
    const filters = this.viewerData['filters'].length > 0 ? this.viewerData['filters'] : ['TOTAL'];
    const joinedFilters = `["${filters.join('","')}"]`;
    this.newFilteringEvent.emit(joinedFilters);
    this.aminoAcidsLegend = this.viewerData.yDomain;
  }

  async forceShowTooltipAtoms(atomDatum: any) {
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
    contentDiv.innerHTML = `<b>You are at</b> <br>
    Atom name: <b>${atomDatum.atomName}</b><br>
    Ligand interactions frequency: <b>${atomDatum.freq}</b><br>
    (Perc: <b>${atomDatum.perc}%</b>)
    `;
    tooltipDiv.appendChild(contentDiv);
    (whereToPlace as HTMLElement).appendChild(tooltipDiv);
  }

  async destroyForcedTooltipAtoms() {
    document.getElementById('removable-div')?.remove();
  }

  async adjustTooltipPosition() {
    const insideAtoms = await this.waitForElm('#heatmap-atoms > div > div');
    const insideResids = await this.waitForElm('#heatmap-resids > div > div');
    this.adjustTooltipElements(insideAtoms as HTMLElement);
    this.adjustTooltipElements(insideResids as HTMLElement);
  }

  adjustTooltipElements(parent: HTMLElement) {
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
