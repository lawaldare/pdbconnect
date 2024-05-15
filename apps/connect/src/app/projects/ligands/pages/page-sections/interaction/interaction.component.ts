import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';

@Component({
  selector: 'pdbc-interaction',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InteractionComponent implements AfterViewInit {
  helpLogoSrc = '/assets/images/help_outline_24px.svg';

  @ViewChild('ligandEnv', { read: ElementRef }) ligandEnvContainer!: ElementRef;
  constructor(private aggregatedApiService: AggregatedApiService, private renderer: Renderer2) {}

  renderAtomIntx(contactTypes: string) {
    const ligandEnv = this.ligandEnvContainer.nativeElement;
    this.aggregatedApiService.fetchDepiction('STI').subscribe((depiction: Depiction) => {
      this.renderer.setProperty(ligandEnv, 'depiction', depiction);
      this.renderer.setProperty(ligandEnv, 'atomWeights', contactTypes);
    });
  }

  ngAfterViewInit() {
    this.renderAtomIntx('total');
  }
}
