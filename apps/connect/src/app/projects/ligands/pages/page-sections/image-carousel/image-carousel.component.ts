import { Component, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ClickOutsideDirective } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';

@Component({
  selector: 'pdbc-image-carousel',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ToolTipComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent implements AfterViewInit {
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  public readonly arrowSrc = '/assets/images/left_arrow.svg';
  public ligandId!: string;
  private currentSlide = 0;
  private substructureNames = signal<string[]>([]);
  private substructureAtoms!: Array<string[]>;
  private slides = signal<number[]>([]);
  public structureDescription = '';
  public showTooltips = false;

  @ViewChild('slide', { read: ElementRef }) slideContainer!: ElementRef;
  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private divsRendered: any[] = [];
  private ligandEv!: any;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  ngAfterViewInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.resetRenderer();
          this.ligandId = params['ligandId'].toUpperCase();
          this.init(this.ligandId);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public onShowTooltips() {
    this.showTooltips = !this.showTooltips;
  }

  public onClickedOutside() {
    this.showTooltips = false;
  }

  /**
   * Function to download substructure data from API
   * @param ligandId
   */
  private init(ligandId: string) {
    this.aggregatedApiService
      .fetchSubstructures(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((substructures) => {
        const substructure = substructures[ligandId][0];
        const fragments = Object.entries(substructure['fragments']);
        for (const [fragment, atoms] of fragments) {
          for (const atom of atoms) {
            this.substructureNames.update((values) => [...values, `${fragment} fragment`]);
            this.substructureAtoms.push(atom);
          }
        }
        this.substructureNames.update((values) => [...values, `Murcko scaffold`]);
        this.substructureAtoms.push(Object.values(substructure['scaffold'])[0]);
        if (this.substructureNames().length > 0) {
          this.generateSlideNumbers();
          this.renderLigand(this.ligandId);
        }
      });
  }

  private generateSlideNumbers(): void {
    for (let index = 0; index <= this.substructureNames().length + 1; index++) {
      this.slides.update((numbers) => [...numbers, index]);
    }
  }

  /**
   * Controls the previous click on the image carousel
   * Updates the slides and renders the substructures
   */

  onPreviousClick() {
    this.currentSlide = (this.currentSlide - 1 + this.slides().length) % this.slides().length;
    this.renderSubstructure();
  }

  /**
   * Controls the next click on the image carousel
   * Updates the slides and renders the substructures
   */

  onNextClick() {
    this.currentSlide = (this.currentSlide + 1) % this.slides().length;
    this.renderSubstructure();
  }

  /**
   * Updates the depiction description
   */
  private setDepictionDescription() {
    switch (this.currentSlide) {
      case 0:
        this.structureDescription = `Structural representation of ${this.ligandId}`;
        break;

      case 1:
        this.structureDescription = `Atom labeled ${this.ligandId}`;
        break;

      default:
        this.structureDescription = `${this.substructureNames()[this.currentSlide - 2]} highlighted in gray`;
    }
  }

  /**
   * Sets the property of depiction to highlight substructures and atom names
   */
  private setDepictionProperty(el: HTMLElement, index: number) {
    switch (index) {
      case 0:
        this.renderer.setProperty(el, 'atomNames', false);
        this.renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      case 1:
        this.renderer.setProperty(el, 'atomNames', true);
        this.renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      default:
        this.renderer.setProperty(el, 'atomNames', false);
        this.renderer.setProperty(el, 'highlightSubstructure', this.substructureAtoms[index - 2]);
    }
  }

  /**
   * Highlight substructures
   * Sets depiction description
   */

  private renderSubstructure() {
    const slideContainer = this.slideContainer.nativeElement;
    this.setDepictionProperty(this.ligandEv, this.currentSlide);
    const slideElements = slideContainer.children;
    for (let i = 0; i < slideElements.length; i++) {
      if (this.slides()[i] == this.currentSlide) {
        this.renderer.addClass(slideElements[i], 'active');
      } else {
        this.renderer.removeClass(slideElements[i], 'active');
      }

      const ligandEl = slideElements[i].firstElementChild;
      this.setDepictionProperty(ligandEl, this.slides()[i]);
    }
    this.setDepictionDescription();
  }

  /**
   * Renders first view of image carousel
   * @param ligandId
   */

  private renderLigand(ligandId: string) {
    const slideContainer = this.slideContainer.nativeElement;
    const imageContainer = this.imageContainer.nativeElement;

    this.aggregatedApiService
      .fetchDepiction(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((depiction: Depiction) => {
        this.createLigandEnvironment(imageContainer, depiction, true);
        if (this.substructureNames().length > 0) {
          for (const slide of this.slides()) {
            const div = this.renderer.createElement('div');
            this.renderer.appendChild(slideContainer, div);
            this.renderer.addClass(div, 'slide');
            if (slide === 0) {
              this.renderer.addClass(div, 'active');
            }
            this.divsRendered.push(div);
            this.createLigandEnvironment(div, depiction, false, slide);
          }
        }

        this.setDepictionDescription();
      });
  }

  private createLigandEnvironment(container: ElementRef, depiction: Depiction, mainLigand = false, slide?: number): void {
    const ligand = this.renderer.createElement('pdb-ligand-env');
    this.renderer.appendChild(container, ligand);
    this.renderer.setProperty(ligand, 'depiction', depiction);

    if (slide === 0) {
      this.setDepictionProperty(ligand, slide);
    }
    if (slide) {
      this.setDepictionProperty(ligand, slide);
    }

    if (mainLigand) {
      this.renderer.setAttribute(ligand, 'depiction-only', '');
      this.ligandEv = ligand;
    }
  }

  private resetRenderer(): void {
    const slideContainer = this.slideContainer.nativeElement;
    const imageContainer = this.imageContainer.nativeElement;

    for (const div of this.divsRendered) {
      this.renderer.removeChild(slideContainer, div);
    }

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }

    this.slides.set([]);
    this.divsRendered = [];
    this.substructureNames.set([]);
    this.substructureAtoms = [];
  }
}
