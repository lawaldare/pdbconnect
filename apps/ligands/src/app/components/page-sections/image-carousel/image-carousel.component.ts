import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, inject, DestroyRef, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AssetPipe, CapitalizePipe, ClickOutsideDirective, GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { ImageCarouselComponentFacade } from './image-carousel.facade';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'pdbc-image-carousel',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ToolTipComponent, MaterialModule, CapitalizePipe, AssetPipe],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent implements AfterViewInit {
  public readonly arrowSrc = 'images/left_arrow.svg';

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly utilService = inject(UtilService);
  private readonly facade = inject(ImageCarouselComponentFacade);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public structureDescription = this.facade.structureDescription;
  public showTooltips = signal(false);

  public total = toSignal(this.globalStore.select(LigandSelectors.fragments).pipe(map((fragments) => fragments.length + 2)));
  public currentSlide = computed(() => this.facade.currentSlide() + 1);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.globalStore
        .select(LigandSelectors.ligandId)
        .pipe(
          map((ligandId) => {
            this.facade.resetRenderer(this.renderer, this.imageContainer);
            this.facade.init(this.renderer, ligandId, this.imageContainer);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  public onShowTooltips(): void {
    this.showTooltips.update((value) => !value);
  }

  public onClickedOutside(): void {
    this.showTooltips.set(false);
    this.googleAnalyticsService.logClickEvents('tooltip_hover', 'Information', 'hover_tooltip', 'Tooltip Information');
  }

  public get showCopyButtons(): boolean {
    return this.facade.currentSlide() > 1;
  }

  public copySmiles(): void {
    this.utilService.copy(this.facade.currentFragment().descriptors.smiles);
    this.googleAnalyticsService.logClickEvents('copy_chemical_data', 'Chemical Info', 'copy_formula', 'SMILES');
  }

  public copyInchiKeys(): void {
    this.utilService.copy(this.facade.currentFragment().descriptors.inchikey);
    this.googleAnalyticsService.logClickEvents('copy_chemical_data', 'Chemical Info', 'copy_formula', 'InChiKeys');
  }

  public onPreviousClick() {
    this.facade.onPreviousClick(this.renderer);
    this.googleAnalyticsService.logClickEvents('fragment_gallery_navigation', 'Fragment Images', 'navigate_left', 'Previous Fragment Image');
  }

  public onNextClick() {
    this.facade.onNextClick(this.renderer);
    this.googleAnalyticsService.logClickEvents('fragment_gallery_navigation', 'Fragment Images', 'navigate_right', 'Next Fragment Image');
  }
}
