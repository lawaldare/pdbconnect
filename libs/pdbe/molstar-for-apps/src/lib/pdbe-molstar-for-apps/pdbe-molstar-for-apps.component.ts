import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PDBeMolstarPlugin as PDBeMolstarPluginType } from 'pdbe-molstar/lib/index';
import { InitParams } from 'pdbe-molstar/lib/spec';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'lib-pdbe-molstar-for-apps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-molstar-for-apps.component.html',
  styleUrl: './pdbe-molstar-for-apps.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PdbeMolstarForAppsComponent implements OnInit, OnChanges {
  @Input() displayConfigs?: Partial<InitParams>;
  @Input() molstarWidth?: string;
  @Input() molstarHeight?: string;
  @Input() showControls = false;
  @Input() showSeqPanel = false;
  @Input() hideCanvasControls: string[] = [];

  @Output() loadedEvent = new EventEmitter<boolean>();
  @Output() expandedEvent = new EventEmitter<boolean>();

  pdbeMolstar?: PDBeMolstarPluginType;
  expandedView = false;

  ngOnInit() {
    this.loadedEvent.emit(false);
    this.loadScript();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // obs: probably showControls, showSeqPanel, hideCanvasControls AND displayConfigs
    // do not work well together due to async events
    if (changes['showControls'] && this.pdbeMolstar) {
      // toggling between hidden and shown states
      this.pdbeMolstar.canvas.toggleControls(this.showControls);
    }
    if (changes['showSeqPanel'] && this.pdbeMolstar) {
      const topState = this.showSeqPanel ? 'full' : 'hidden';
      this.pdbeMolstar.plugin.layout.state.regionState.top = topState;
    }
    if (changes['hideCanvasControls'] && this.pdbeMolstar) {
      this.buttonsShowHide();
    }
    if (changes['displayConfigs'] && changes['displayConfigs'].previousValue && changes['displayConfigs'].currentValue) {
      (async () => {
        // molstar is refreshed
        await this.pdbeMolstar!.visual.update(this.displayConfigs!, true);

        // // toggling between hidden and shown states
        // const showControls = !this.displayConfigs!.hideControls;
        // // PluginCommands.Layout.Update(this.pdbeMolstar!.plugin, { state: { showControls: showControls } });
        // this.pdbeMolstar!.canvas.toggleControls(showControls);

        // // msp-layout-hide-top
        // const topState = this.displayConfigs!.sequencePanel ? 'full' : 'hidden';
        // this.pdbeMolstar!.plugin.layout.state.regionState.top = topState;
      })();
    }
  }

  initMolstar() {
    this.loadedEvent.emit(false);
    const ele = <HTMLInputElement>document.getElementById('molstar-app');
    ele.style.visibility = 'hidden';
    const definedVariables = this.displayConfigs && this.molstarWidth && this.molstarHeight;
    if (ele && definedVariables) {
      this.pdbeMolstar = new PDBeMolstarPlugin() as PDBeMolstarPluginType;
      this.pdbeMolstar.render(ele, this.displayConfigs!);
      this.pdbeMolstar.events.loadComplete.subscribe((_ev) => {
        const mspPluginEle = <HTMLInputElement>document.getElementsByClassName('msp-plugin')[0];

        mspPluginEle.style.height = 'inherit';
        mspPluginEle.style.width = 'inherit';
        mspPluginEle.style.position = 'relative';

        ele.style.visibility = 'visible';
        this.buttonsShowHide();
        this.loadedEvent.emit(true);

        /**
         * MutationObserver needed in order to override dynamic CSS styling of external webcomponent
         */
        const mspPluginContent = <HTMLInputElement>document.getElementsByClassName('msp-plugin-content')[0];
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            const isExpanded = (<HTMLElement>mutation.target).classList.contains('msp-layout-expanded');
            if (this.expandedView === isExpanded) continue;
            if (isExpanded) {
              mspPluginContent.style.width = '100%';
              mspPluginContent.style.display = 'flex';
              mspPluginContent.style.justifyContent = 'center';
              mspPluginContent.style.height = '100vh';
              mspPluginContent.style.top = '-25vh';
            } else {
              mspPluginContent.style.width = '';
              mspPluginContent.style.display = '';
              mspPluginContent.style.justifyContent = '';
              mspPluginContent.style.height = '';
              mspPluginContent.style.top = '';
            }
            this.expandedView = isExpanded;
            this.expandedEvent.emit(isExpanded);
          }
        });
        observer.observe(mspPluginContent as Node, { attributes: true, attributeFilter: ['style', 'class'] });
      });
    }
  }

  /**
   * Manual button hide so no need to refresh Molstar
   * and context is kept
   */
  buttonsShowHide() {
    const btnToContent = {
      animation: 'Select Animation',
      screenshot: 'Screenshot / State Snapshot',
      controlToggle: 'Toggle Controls Panel',
      selection: 'Toggle Selection Mode',
      controlInfo: 'Settings / Controls Info',
    };
    for (const [currentBtn, contentKey] of Object.entries(btnToContent)) {
      const currentBtnEle = <HTMLInputElement>document.querySelector(`button[title="${contentKey}"]`);
      if (!currentBtnEle) continue;
      if (this.hideCanvasControls.includes(currentBtn)) {
        currentBtnEle.style.display = 'none';
      } else {
        currentBtnEle.style.display = '';
      }
    }
  }

  /**
   * Molstar dynamically injected OnInit
   */
  public loadScript() {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar-plugin.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initMolstar();
    };
    body.appendChild(script);
  }
}
