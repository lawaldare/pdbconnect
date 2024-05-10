import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
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
export class PdbeMolstarForAppsComponent implements OnInit {
  @Input() displayConfigs?: Partial<InitParams>;
  @Input() molstarWidth?: string;
  @Input() molstarHeight?: string;

  pdbeMolstar?: PDBeMolstarPluginType;

  ngOnInit() {
    this.loadScript();
  }

  // TODO: Allow instance variable to be accessed by parent component

  initMolstar() {
    const ele = <HTMLInputElement>document.getElementById('molstar-app');
    ele.style.visibility = 'hidden';
    const definedVariables = this.displayConfigs && this.molstarWidth && this.molstarHeight;
    if (ele && definedVariables) {
      this.pdbeMolstar = new PDBeMolstarPlugin() as PDBeMolstarPluginType;
      // const initParams = {
      //   // moleculeId: '1cbs',
      //   // subscribeEvents: true,
      //   // bgColor:  {r: 255, g: 255, b: 255},
      //   // hideStructure: ['water'],
      //   // lighting: 'plastic',
      //   // landscape: true,
      //   moleculeId: "1cbs",
      //   hideControls: true,
      //   // loadMaps: true,
      //   // validationAnnotation: true,
      //   // domainAnnotation: true,
      //   // expanded: false,
      //   landscape: true,
      //   hideExpandIcon: true,
      //   subscribeEvents: false,
      //   bgColor: {r:255, g:255, b:255}
      // };
      this.pdbeMolstar.render(ele, this.displayConfigs!);
      this.pdbeMolstar.events.loadComplete.subscribe(function (_) {
        (<HTMLInputElement>document.getElementsByClassName('msp-plugin')[0]).style.height = 'inherit';
        (<HTMLInputElement>document.getElementsByClassName('msp-plugin')[0]).style.width = 'inherit';
        (<HTMLInputElement>document.getElementsByClassName('msp-plugin')[0]).style.position = 'relative';
        ele.style.visibility = 'visible';
      });
    }
  }

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
