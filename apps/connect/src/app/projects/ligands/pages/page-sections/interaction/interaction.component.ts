import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';
import { IntxDataUrl, PDBIntxData } from '../../../data-models/interaction.model';

@Component({
  selector: 'pdbc-interaction',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InteractionComponent implements AfterViewInit {
  @Input() ligandId!: string;
  intxUrl = '';
  helpLogoSrc = '/assets/images/help_outline_24px.svg';

  @ViewChild('ligandEnv', { read: ElementRef }) ligandEnvContainer!: ElementRef;
  @ViewChild('ligHeatMap', { read: ElementRef }) ligandHeatMapContainer!: ElementRef;
  constructor(private aggregatedApiService: AggregatedApiService, private renderer: Renderer2) {}

  renderHeatMap(interaction: PDBIntxData) {
    const ligandHeatmap = this.ligandHeatMapContainer.nativeElement;
    this.renderer.setAttribute(ligandHeatmap, 'pdbeapi', 'false');
    this.renderer.setAttribute(ligandHeatmap, 'accession', this.ligandId);
    ligandHeatmap.setDataAndRender(interaction);
    ligandHeatmap.registerLigandEnv('ligand-int-env');
  }

  renderAtomIntx() {
    const ligandEnv = this.ligandEnvContainer.nativeElement;
    this.aggregatedApiService.fetchDepiction(this.ligandId).subscribe((depiction: Depiction) => {
      this.renderer.setProperty(ligandEnv, 'depiction', depiction);
      this.aggregatedApiService.fetchIntxData(this.ligandId).subscribe((intxDataUrl: IntxDataUrl) => {
        const interaction = intxDataUrl.interactions;
        this.intxUrl = intxDataUrl.IntxUrl;
        this.renderer.setProperty(ligandEnv, 'interaction', interaction[this.ligandId]);
        this.renderer.setProperty(ligandEnv, 'contactType', '["TOTAL"]');
        // this.renderer.setProperty(ligandEnv, 'zoom', true);
        this.renderHeatMap(interaction);
      });
    });
  }

  ngAfterViewInit() {
    if (this.ligandId) {
      this.renderAtomIntx();
    }
  }
}
