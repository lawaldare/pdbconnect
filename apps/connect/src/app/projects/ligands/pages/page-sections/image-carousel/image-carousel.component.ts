import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';

@Component({
  selector: 'pdbc-image-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent implements OnInit, AfterViewInit {
  helpLogoSrc = '/assets/images/help_outline_24px.svg';
  arrowSrc = '/assets/images/left_arrow.svg';
  @Input() ligandId?: string;
  currentSlide = 0;
  substructureNames: string[] = [];
  substructureAtoms: Array<string[]> = [];
  slides = [0, 1, 2];
  structureDescription = '';

  @ViewChild('ligandEnv', { read: ElementRef }) ligandEnvContainer!: ElementRef;
  @ViewChild('slide', { read: ElementRef }) slideContainer!: ElementRef;
  constructor(private renderer: Renderer2, private aggregatedApiService: AggregatedApiService) {}

  /**
   * Function to download substructure data from API
   * @param ligandId
   */
  getSubstructures(ligandId: string) {
    this.aggregatedApiService.fetchSubstructures(ligandId).subscribe((substructures) => {
      const substructure = substructures[ligandId][0];
      const fragments = Object.entries(substructure['fragments']);
      for (const [fragment, atoms] of fragments) {
        for (const atom of atoms) {
          this.substructureNames.push(`${fragment} fragment`);
          this.substructureAtoms.push(atom);
        }
      }
      this.substructureNames.push('Murcko scaffold');
      this.substructureAtoms.push(Object.values(substructure['scaffold'])[0]);
    });
  }

  /**
   * Controls the previous click on the image carousel
   * Updates the slides and renders the substructures
   */
  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.substructureNames.length + 1 : previous;
    if (!this.slides.includes(this.currentSlide)) {
      this.slides[2] = this.slides[1];
      this.slides[1] = this.slides[0];
      this.slides[0] = this.currentSlide;
    }

    this.renderSubstructure();
  }

  /**
   * Controls the next click on the image carousel
   * Updates the slides and renders the substructures
   */
  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.substructureNames.length + 2 ? 0 : next;
    if (!this.slides.includes(this.currentSlide)) {
      this.slides[0] = this.slides[1];
      this.slides[1] = this.slides[2];
      this.slides[2] = this.currentSlide;
    }
    this.renderSubstructure();
  }

  /**
   * Updates the depiction description
   */
  setDepictionDescription() {
    switch (this.currentSlide) {
      case 0:
        this.structureDescription = `Structural representation of ${this.ligandId}`;
        break;

      case 1:
        this.structureDescription = `Structural representation of ${this.ligandId} with atom names`;
        break;

      default:
        this.structureDescription = `Structural representation of ${this.ligandId} with ${this.substructureNames[this.currentSlide - 2]} highlighted`;
    }
  }

  /**
   * Sets the property of depiction to highlight substructures and atom names
   */
  setDepictionProperty(el: HTMLElement, index: number) {
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
  renderSubstructure() {
    const ligandEnv = this.ligandEnvContainer.nativeElement;
    const slideContainer = this.slideContainer.nativeElement;
    this.setDepictionProperty(ligandEnv, this.currentSlide);
    const slideElements = slideContainer.children;
    for (let i = 0; i < slideElements.length; i++) {
      if (this.slides[i] == this.currentSlide) {
        this.renderer.addClass(slideElements[i], 'active');
      } else {
        this.renderer.removeClass(slideElements[i], 'active');
      }

      const ligandEl = slideElements[i].firstElementChild;
      this.setDepictionProperty(ligandEl, this.slides[i]);
    }
    this.setDepictionDescription();
  }

  /**
   * Renders first view of image carousel
   * @param ligandId
   */

  renderLigand(ligandId: string) {
    const ligandEnv = this.ligandEnvContainer.nativeElement;
    const slideContainer = this.slideContainer.nativeElement;
    this.aggregatedApiService.fetchDepiction(ligandId).subscribe((depiction: Depiction) => {
      this.renderer.setProperty(ligandEnv, 'depiction', depiction);
      for (const slide of this.slides) {
        const div = this.renderer.createElement('div');
        this.renderer.appendChild(slideContainer, div);
        this.renderer.addClass(div, 'slide');
        if (slide == 0) {
          this.renderer.addClass(div, 'active');
        }
        const slideEl = this.renderer.createElement('pdb-ligand-env');
        this.renderer.appendChild(div, slideEl);
        this.renderer.setProperty(slideEl, 'depiction', depiction);
        this.setDepictionProperty(slideEl, slide);
      }
      this.setDepictionDescription();
    });
  }

  ngAfterViewInit() {
    if (this.ligandId) {
      this.renderLigand(this.ligandId);
    }
  }

  ngOnInit() {
    if (this.ligandId) {
      this.getSubstructures(this.ligandId);
    }
  }
}
