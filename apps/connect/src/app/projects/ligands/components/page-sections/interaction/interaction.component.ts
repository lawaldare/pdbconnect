import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Renderer2, ElementRef, AfterViewInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction, LigandStructure } from '../../../data-models/structure.model';
import { PDBIntxData } from '../../../data-models/interaction.model';
import { catchError, combineLatest, EMPTY, forkJoin, map, mergeMap, switchMap, take, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleAnalyticsService, MaterialModule, NavSection } from '@pdbc/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigandUtilService } from '../../../ligand-util.service';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { LigandActions } from '../../../store/ligand.actions';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { InteractionsHeatmapComponent } from '@pdbc/interaction-heatmap';

@Component({
  selector: 'pdbc-interaction',
  standalone: true,
  imports: [CommonModule, MaterialModule, InteractionsHeatmapComponent, ToolTipComponent],
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly _snackBar = inject(MatSnackBar);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public interaction!: PDBIntxData; // eslint-disable-line @typescript-eslint/no-explicit-any

  public ligandInstances = signal(0);
  public pdbstructures = signal(0);
  public pdbchains = signal(0);
  public showLigandHeatmap = signal(false);
  public showAtomicNames = signal(false);
  public navItems = signal<NavSection[]>([]);

  ngAfterViewInit() {
    this.globalStore
      .select(LigandSelectors.ligandId)
      .pipe(
        switchMap((id) => {
          this.ligandId.set(id);
          this.showLigandHeatmap.set(true);
          return forkJoin([this.aggregatedApiService.fetchDepiction(this.ligandId()), this.globalStore.select(LigandSelectors.navItems).pipe(take(1))]);
        }),
        mergeMap(([depiction, navItems]) => {
          this.generateStructureStatistics();
          this.navItems.update(() => navItems);
          const imageContainer = this.imageContainer.nativeElement;
          this.resetRenderer();
          this.createLigandEnvironment(imageContainer, depiction);
          return this.aggregatedApiService.fetchIntxData(this.ligandId());
        }),
        map((intxDataUrl) => {
          const interaction = intxDataUrl.interactions;
          this.interaction = interaction;
          if (interaction && interaction?.[this.ligandId()]) {
            this.renderer.setProperty(this.ligandEv, 'interaction', interaction[this.ligandId()]);
            this.renderer.setProperty(this.ligandEv, 'contactType', '["TOTAL"]');
          } else {
            this.updateWhenNoInteraction();
          }
          return EMPTY;
        }),
        catchError(() => {
          this.updateWhenNoInteraction();
          return throwError('Failed to fetch interaction data');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public changeLigandEnvironmentFilters(filterString: string) {
    this.renderer.setAttribute(this.ligandEv, 'contact-type', filterString);
  }

  private updateWhenNoInteraction(): void {
    this.showLigandHeatmap.set(false);
    const tempNavsections = this.navItems().filter((section) => section.sectionId !== 'interaction-section');
    this.globalStore.dispatch(LigandActions.setNavItems({ navItems: tempNavsections }));
  }

  public downloadInteraction(): void {
    if (this.interaction && this.interaction?.[this.ligandId()]) {
      this.ligandUtilService.downloadJSON(this.interaction, `interaction_${this.ligandId()}`);
    } else {
      this._snackBar.open(`No interaction data for ${this.ligandId}`, 'Dismiss', {
        duration: 3000,
      });
    }
    this.googleAnalyticsService.logClickEvents('download_interaction', 'Interations', 'download_all_interaction', 'all_interactions');
  }

  private createLigandEnvironment(container: ElementRef, prop: Depiction): void {
    const ligand = this.renderer.createElement('pdb-ligand-env');
    this.renderer.appendChild(container, ligand);
    this.renderer.setProperty(ligand, 'id', 'ligand-int-env');
    this.renderer.setProperty(ligand, 'depiction', prop);
    this.ligandEv = ligand;
  }

  public toggleAtomNames(): void {
    this.showAtomicNames.update((value) => !value);
    this.renderer.setProperty(this.ligandEv, 'atomNames', this.showAtomicNames() ? true : false);
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }
  }

  private generateStructureStatistics(): void {
    combineLatest([
      this.globalStore.select(LigandSelectors.numberOfProteins),
      this.globalStore.select(LigandSelectors.numberOfPDBStructures),
      this.globalStore.select(LigandSelectors.numberOfLigandInstances),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([numberOfProteins, numberOfPDBStructures, numberOfLigandInstances]) => {
        this.pdbchains.set(numberOfPDBStructures);
        this.pdbstructures.set(numberOfProteins);
        this.ligandInstances.set(numberOfLigandInstances);
      });
  }
}
