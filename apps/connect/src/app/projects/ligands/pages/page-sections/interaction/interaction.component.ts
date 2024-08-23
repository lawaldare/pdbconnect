import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  Renderer2,
  ElementRef,
  AfterViewInit,
  DestroyRef,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';
import { IntxDataUrl, PDBIntxData } from '../../../data-models/interaction.model';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, mergeMap, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '@pdbc/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pdbc-interaction',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent, MaterialModule],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionComponent implements AfterViewInit {
  public ligandId!: string;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  // @ViewChild('ligandEnv', { read: ElementRef }) ligandEnvContainer!: ElementRef;
  @ViewChild('ligHeatMapContainer', { read: ElementRef }) ligandHeatMapContainer!: ElementRef;
  // @ViewChild('ligHeatMap', { read: ElementRef }) ligandHeatMapContainer!: ElementRef;
  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private ligandEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private ligandHeatmapEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  public interaction!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private emptyText!: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  private renderHeatMap(interaction: PDBIntxData): void {
    const ligandHeatmapContainer = this.ligandHeatMapContainer.nativeElement;
    const ligandHeatmap = this.renderer.createElement('pdbe-ligand-interactions');
    this.renderer.appendChild(ligandHeatmapContainer, ligandHeatmap);
    this.renderer.setAttribute(ligandHeatmap, 'pdbeapi', 'false');
    this.renderer.setAttribute(ligandHeatmap, 'accession', this.ligandId);
    ligandHeatmap.setDataAndRender(interaction);
    ligandHeatmap.registerLigandEnv('ligand-int-env');
    this.ligandHeatmapEv = ligandHeatmap;
  }

  ngAfterViewInit() {
    const imageContainer = this.imageContainer.nativeElement;

    this.route.params
      .pipe(
        switchMap((params) => {
          this.resetRenderer();
          this.ligandId = params['ligandId'].toUpperCase();
          this.cdr.detectChanges();
          return this.aggregatedApiService.fetchDepiction(this.ligandId);
        }),
        mergeMap((depiction: Depiction) => {
          this.createLigandEnvironment(imageContainer, depiction);
          return this.aggregatedApiService.fetchIntxData(this.ligandId);
        }),
        map((intxDataUrl: IntxDataUrl) => {
          const interaction = intxDataUrl.interactions;
          this.interaction = interaction;
          if (interaction && interaction?.[this.ligandId]) {
            this.renderer.setProperty(this.ligandEv, 'interaction', interaction[this.ligandId]);
            this.renderer.setProperty(this.ligandEv, 'contactType', '["TOTAL"]');
            this.renderHeatMap(interaction);
          } else {
            this.generateEmptyText();
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public downloadInteraction(): void {
    if (this.interaction && this.interaction?.[this.ligandId]) {
      const blob = new Blob([JSON.stringify(this.interaction, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'interaction.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      this._snackBar.open(`No interaction data for ${this.ligandId}`, 'Dismiss', {
        duration: 3000,
      });
    }
  }

  private createLigandEnvironment(container: ElementRef, prop: Depiction): void {
    const ligand = this.renderer.createElement('pdb-ligand-env');
    this.renderer.appendChild(container, ligand);
    this.renderer.setProperty(ligand, 'depiction', prop);
    this.ligandEv = ligand;
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }

    this.resetligandHeatmap();
  }

  private resetligandHeatmap(): void {
    const ligandHeatmapContainer = this.ligandHeatMapContainer.nativeElement;
    if (this.ligandHeatmapEv) {
      this.renderer.removeChild(ligandHeatmapContainer, this.ligandHeatmapEv);
      this.ligandHeatmapEv = null;
    }

    if (this.emptyText) {
      this.renderer.removeChild(ligandHeatmapContainer, this.emptyText);
      this.emptyText = null;
    }
  }

  private generateEmptyText(): void {
    const ligandHeatmapContainer = this.ligandHeatMapContainer.nativeElement;
    const p = this.renderer.createElement('p');
    const text = this.renderer.createText(`Interaction view not available for ${this.ligandId}`);
    this.renderer.appendChild(p, text);
    this.renderer.removeClass(p, 'empty-text');
    this.renderer.appendChild(ligandHeatmapContainer, p);
    this.emptyText = p;
  }
}
