import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Renderer2, ElementRef, AfterViewInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction, LigandStructure } from '../../../data-models/structure.model';
import { PDBIntxData } from '../../../data-models/interaction.model';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, forkJoin, map, mergeMap, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '@pdbc/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigandUtilService } from '../../../ligand-util.service';
import { InteractionsHeatmapComponent } from '../../../components/interactions-heatmap/interactions-heatmap.component';

@Component({
  selector: 'pdbc-interaction',
  standalone: true,
  imports: [CommonModule, MaterialModule, InteractionsHeatmapComponent],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InteractionComponent implements AfterViewInit {
  public ligandId = signal('');
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  @ViewChild('ligHeatMapContainer', { read: ElementRef }) ligandHeatMapContainer!: ElementRef;
  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private ligandEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly _snackBar = inject(MatSnackBar);
  public interaction!: PDBIntxData; // eslint-disable-line @typescript-eslint/no-explicit-any

  public ligandInstances = signal(0);
  public pdbstructures = signal(0);
  public pdbchains = signal(0);
  public showLigandHeatmap = signal(false);

  ngAfterViewInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.ligandId.set(params['ligandId'].toUpperCase());
          this.showLigandHeatmap.set(true);
          return this.aggregatedApiService.fetchDepiction(this.ligandId());
        }),
        mergeMap((depiction: Depiction) => {
          const imageContainer = this.imageContainer.nativeElement;
          this.resetRenderer();
          this.createLigandEnvironment(imageContainer, depiction);
          return forkJoin([this.aggregatedApiService.fetchIntxData(this.ligandId()), this.aggregatedApiService.fetchLigandStructures(this.ligandId())]);
        }),
        map(([intxDataUrl, structures]) => {
          const interaction = intxDataUrl.interactions;
          this.generateStructureStatistics(structures);
          this.interaction = interaction;
          if (interaction && interaction?.[this.ligandId()]) {
            this.renderer.setProperty(this.ligandEv, 'interaction', interaction[this.ligandId()]);
            this.renderer.setProperty(this.ligandEv, 'contactType', '["TOTAL"]');
          } else {
            this.showLigandHeatmap.set(false);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public changeLigandEnvironmentFilters(filterString: string) {
    this.renderer.setAttribute(this.ligandEv, 'contact-type', filterString);
  }

  public downloadInteraction(): void {
    if (this.interaction && this.interaction?.[this.ligandId()]) {
      this.ligandUtilService.downloadJSON(this.interaction, `interaction_${this.ligandId()}`);
    } else {
      this._snackBar.open(`No interaction data for ${this.ligandId}`, 'Dismiss', {
        duration: 3000,
      });
    }
  }

  private createLigandEnvironment(container: ElementRef, prop: Depiction): void {
    const ligand = this.renderer.createElement('pdb-ligand-env');
    this.renderer.appendChild(container, ligand);
    this.renderer.setProperty(ligand, 'id', 'ligand-int-env');
    this.renderer.setProperty(ligand, 'depiction', prop);
    this.ligandEv = ligand;
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }
  }

  private generateStructureStatistics(structures: LigandStructure[]): void {
    const numberOfPDBChains = structures.reduce((acc: number, curr: LigandStructure) => {
      if (curr.interacting_chains === null || curr.interacting_chains.length === 0) {
        acc = 0;
        return acc;
      }

      const mappedValue = curr.interacting_chains.map((val) => val.pdb_id);
      acc += [...new Set(mappedValue)].length;
      return acc;
    }, 0);
    this.pdbchains.set(numberOfPDBChains);
    this.pdbstructures.set(structures.length);
    this.ligandInstances.set(44);
  }
}
