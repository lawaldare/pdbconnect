import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, inject, DestroyRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ClickOutsideDirective, GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { ImageCarouselComponentFacade } from './image-carousel.facade';
import { LigandUtilService } from '../../../ligand-util.service';

@Component({
  selector: 'pdbc-image-carousel',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ToolTipComponent, MaterialModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent implements AfterViewInit {
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  public readonly arrowSrc = '/assets/images/left_arrow.svg';
  public ligandId!: string;

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly utilService = inject(UtilService);
  private readonly facade = inject(ImageCarouselComponentFacade);
  private readonly ligandUtilService = inject(LigandUtilService);

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  public structureDescription = this.facade.structureDescription;
  public showTooltips = signal(false);

  public total = computed(() => this.ligandUtilService.currentFragments().length + 2);
  public currentSlide = computed(() => this.facade.currentSlide() + 1);

  ngAfterViewInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.facade.resetRenderer(this.renderer, this.imageContainer);
          this.ligandId = params['ligandId'].toUpperCase();
          this.facade.init(this.renderer, this.ligandId, this.imageContainer);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
