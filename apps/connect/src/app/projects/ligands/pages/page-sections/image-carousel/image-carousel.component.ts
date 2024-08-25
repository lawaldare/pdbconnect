import { Component, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit, inject, DestroyRef, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction, Fragment } from '../../../data-models/structure.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ClickOutsideDirective, UtilService } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { LigandUtilService } from '../../../ligand-util.service';

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
  private currentSlide = signal(0);
  private substructureNames = signal<string[]>([]);
  private substructureAtoms!: Array<string[]>;
  private slides = signal<number[]>([]);
  public structureDescription = '';
  public showTooltips = false;

  @ViewChild('slide', { read: ElementRef }) slideContainer!: ElementRef;
  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  private tempFragments: Fragment[] = [];

  private divsRendered: any[] = [];
  private ligandEv!: any;
  private fragments = signal<Fragment[]>([]);
  private currentFragment = computed(() => this.fragments()[this.currentSlide() - 2]);

  public sendCurrentFragment = output<Fragment>();

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly utilService = inject(UtilService);
  private readonly ligandUtilService = inject(LigandUtilService);

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

  public onShowTooltips(): void {
    this.showTooltips = !this.showTooltips;
  }

  public onClickedOutside(): void {
    this.showTooltips = false;
  }

  public get showCopyButtons(): boolean {
    return this.currentSlide() > 1;
  }

  public copySmiles(): void {
    this.utilService.copy(this.currentFragment().descriptors.smiles);
  }

  public copyInchiKeys(): void {
    this.utilService.copy(this.currentFragment().descriptors.inchikey);
  }

  onPreviousClick() {
    const previous = this.currentSlide() - 1 < 0 ? this.substructureNames().length + 1 : this.currentSlide() - 1;
    this.currentSlide.set(previous);
    if (!this.slides().includes(this.currentSlide())) {
      // this.slides()[2] = this.slides()[1];
      this.slides()[1] = this.slides()[0];
      this.slides()[0] = this.currentSlide();
    }

    this.renderSubstructure();
  }

  onNextClick() {
    const next = this.currentSlide() + 1 === this.substructureNames().length + 2 ? 0 : this.currentSlide() + 1;
    this.currentSlide.set(next);
    if (!this.slides().includes(this.currentSlide())) {
      this.slides()[0] = this.slides()[1];
      this.slides()[1] = this.currentSlide();
      // this.slides()[2] = this.currentSlide();
    }
    this.renderSubstructure();
  }

  public openMolstarDialog(): void {
    this.ligandUtilService.openMolstarDialog(this.currentFragment(), this.ligandId);
  }

  private init(ligandId: string) {
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
            this.renderLigand(this.ligandId);
          }
        },
        (error) => {
          this.substructureNames.update((values) => [...values, `Murcko scaffold`]);
          this.slides.update((slides) => [...slides, 0, 1]);
          this.renderLigand(this.ligandId);
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
  }

  private setDepictionDescription() {
    switch (this.currentSlide()) {
      case 0:
        this.structureDescription = `Structural representation of ${this.ligandId}`;
        break;

      case 1:
        this.structureDescription = `Atom labeled ${this.ligandId}`;
        break;

      default:
        this.structureDescription = `${this.substructureNames()[this.currentSlide() - 2]} highlighted in gray`;
    }

    this.sendCurrentFragment.emit(this.currentFragment());
  }

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

  private renderSubstructure() {
    const slideContainer = this.slideContainer.nativeElement;
    this.setDepictionProperty(this.ligandEv, this.currentSlide());
    const slideElements = slideContainer.children;
    for (let i = 0; i < slideElements.length; i++) {
      if (this.slides()[i] == this.currentSlide()) {
        this.renderer.addClass(slideElements[i], 'active');
      } else {
        this.renderer.removeClass(slideElements[i], 'active');
      }

      const ligandEl = slideElements[i].firstElementChild;
      this.setDepictionProperty(ligandEl, this.slides()[i]);
    }
    this.setDepictionDescription();
  }

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
    this.currentSlide.set(0);
    this.tempFragments = [];
  }
}
