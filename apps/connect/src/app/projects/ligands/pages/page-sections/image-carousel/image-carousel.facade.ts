import { computed, DestroyRef, ElementRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LigandUtilService } from '../../../ligand-util.service';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction, Fragment } from '../../../data-models/structure.model';

@Injectable({
  providedIn: 'root',
})
export class ImageCarouselComponentFacade {
  public currentSlide = signal(0);
  public substructureNames = signal<string[]>([]);
  public substructureAtoms!: Array<string[]>;
  public slides = signal<number[]>([]);

  private ligandId!: string;
  private tempFragments: Fragment[] = [];

  public structureDescription = signal('');

  private fragments = signal<Fragment[]>([]);
  public currentFragment = computed(() => this.fragments()[this.currentSlide() - 2]);

  private divsRendered: any[] = [];
  private ligandEv!: any;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ligandUtilService = inject(LigandUtilService);

  public init(renderer: Renderer2, ligandId: string, imageContainer: ElementRef, slideContainer: ElementRef) {
    this.ligandId = ligandId;
    this.aggregatedApiService
      .fetchSubstructures(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (substructures) => {
          const fragments = substructures[ligandId].fragments;
          this.getSubstructureNamesAndAtoms(fragments);

          const scaffolds = substructures[ligandId].scaffolds;
          this.getSubstructureNamesAndAtoms(scaffolds);

          if (this.substructureNames().length > 0) {
            this.slides.update((slides) => [...slides, 0, 1]);
            this.renderLigand(renderer, ligandId, imageContainer, slideContainer);
          }
        },
        (error) => {
          this.substructureNames.update((values) => [...values, `Murcko scaffold`]);
          this.slides.update((slides) => [...slides, 0, 1]);
          this.renderLigand(renderer, ligandId, imageContainer, slideContainer);
        }
      );
  }

  private getSubstructureNamesAndAtoms(data: Fragment[]): void {
    for (const fragment of data) {
      for (const atom of fragment.atoms) {
        this.substructureNames.update((values) => [...values, `${fragment.name} fragment`]);
        this.substructureAtoms.push(atom);
      }
      this.tempFragments.push(fragment);
    }

    const mappedFragments = this.tempFragments.reduce((acc: Fragment[], curr: Fragment) => {
      for (const atom of curr.atoms) {
        acc.push({
          name: curr.name,
          descriptors: curr.descriptors,
          atoms: [atom],
        });
      }
      return acc;
    }, []);

    this.fragments.update(() => mappedFragments);
    this.ligandUtilService.fragments.update(() => this.fragments());
  }

  private setDepictionDescription() {
    switch (this.currentSlide()) {
      case 0:
        this.structureDescription.set(`Structural representation of ${this.ligandId}`);
        break;

      case 1:
        this.structureDescription.set(`Atom labeled ${this.ligandId}`);
        break;

      default:
        this.structureDescription.set(`${this.substructureNames()[this.currentSlide() - 2]} highlighted in gray`);
    }

    this.ligandUtilService.currentFragment.set(this.currentFragment());
  }

  private setDepictionProperty(renderer: Renderer2, el: HTMLElement, index: number) {
    switch (index) {
      case 0:
        renderer.setProperty(el, 'atomNames', false);
        renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      case 1:
        renderer.setProperty(el, 'atomNames', true);
        renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      default:
        renderer.setProperty(el, 'atomNames', false);
        renderer.setProperty(el, 'highlightSubstructure', this.substructureAtoms[index - 2]);
    }
  }

  public onPreviousClick(renderer: Renderer2, slideContainer: ElementRef) {
    const previous = this.currentSlide() - 1 < 0 ? this.substructureNames().length + 1 : this.currentSlide() - 1;
    this.currentSlide.set(previous);
    if (!this.slides().includes(this.currentSlide())) {
      this.slides()[1] = this.slides()[0];
      this.slides()[0] = this.currentSlide();
    }

    this.renderSubstructure(renderer, slideContainer);
  }

  public onNextClick(renderer: Renderer2, slideContainer: ElementRef) {
    const next = this.currentSlide() + 1 === this.substructureNames().length + 2 ? 0 : this.currentSlide() + 1;
    this.currentSlide.set(next);
    if (!this.slides().includes(this.currentSlide())) {
      this.slides()[0] = this.slides()[1];
      this.slides()[1] = this.currentSlide();
    }
    this.renderSubstructure(renderer, slideContainer);
  }

  private renderSubstructure(renderer: Renderer2, slideContainer: ElementRef) {
    const slideContainerElement = slideContainer.nativeElement;
    this.setDepictionProperty(renderer, this.ligandEv, this.currentSlide());
    const slideElements = slideContainerElement.children;
    for (let i = 0; i < slideElements.length; i++) {
      if (this.slides()[i] == this.currentSlide()) {
        renderer.addClass(slideElements[i], 'active');
      } else {
        renderer.removeClass(slideElements[i], 'active');
      }

      const ligandEl = slideElements[i].firstElementChild;
      this.setDepictionProperty(renderer, ligandEl, this.slides()[i]);
    }
    this.setDepictionDescription();
  }

  private renderLigand(renderer: Renderer2, ligandId: string, imageContainer: ElementRef, slideContainer: ElementRef) {
    const slideContainerRef = slideContainer.nativeElement;
    const imageContainerRef = imageContainer.nativeElement;

    this.aggregatedApiService
      .fetchDepiction(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((depiction: Depiction) => {
        this.createLigandEnvironment(renderer, imageContainerRef, depiction, true);
        if (this.substructureNames().length > 0) {
          for (const slide of this.slides()) {
            const div = renderer.createElement('div');
            renderer.appendChild(slideContainerRef, div);
            renderer.addClass(div, 'slide');
            if (slide === 0) {
              renderer.addClass(div, 'active');
            }
            this.divsRendered.push(div);
            this.createLigandEnvironment(renderer, div, depiction, false, slide);
          }
        }

        this.setDepictionDescription();
      });
  }

  private createLigandEnvironment(renderer: Renderer2, container: ElementRef, depiction: Depiction, mainLigand = false, slide?: number): void {
    const ligand = renderer.createElement('pdb-ligand-env');
    renderer.appendChild(container, ligand);
    renderer.setProperty(ligand, 'depiction', depiction);

    if (slide === 0) {
      this.setDepictionProperty(renderer, ligand, slide);
    }
    if (slide) {
      this.setDepictionProperty(renderer, ligand, slide);
    }

    if (mainLigand) {
      renderer.setAttribute(ligand, 'depiction-only', '');
      renderer.setAttribute(ligand, 'zoom-on', 'true');
      this.ligandEv = ligand;
    }
  }

  public resetRenderer(renderer: Renderer2, imageContainer: ElementRef, slideContainer: ElementRef): void {
    const slideContainerRef = slideContainer.nativeElement;
    const imageContainerRef = imageContainer.nativeElement;

    for (const div of this.divsRendered) {
      renderer.removeChild(slideContainerRef, div);
    }

    if (this.ligandEv) {
      renderer.removeChild(imageContainerRef, this.ligandEv);
    }

    this.slides.set([]);
    this.divsRendered = [];
    this.substructureNames.set([]);
    this.substructureAtoms = [];
    this.currentSlide.set(0);
    this.tempFragments = [];
  }
}
