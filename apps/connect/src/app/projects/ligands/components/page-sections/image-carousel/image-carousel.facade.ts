import { computed, DestroyRef, ElementRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LigandUtilService } from '../../../ligand-util.service';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction, Fragment } from '../../../data-models/structure.model';
import { BiodataState } from '../../../../store/biodata.model';
import { Store } from '@ngrx/store';
import { BiodataSelectors } from '../../../../store/biodata.selectors';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageCarouselComponentFacade {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly globalStore = inject(Store<BiodataState>);

  private ligandId!: string;
  private tempFragments: Fragment[] = [];
  private fragments = signal<Fragment[]>([]);
  private ligandEv!: any;

  public structureDescription = signal('');
  public currentSlide = signal(0);
  public substructureNames = signal<string[]>([]);
  public substructureAtoms!: Array<string[]>;
  public slides = signal<number[]>([]);
  public currentFragment = computed(() => this.fragments()[this.currentSlide() - 2]);

  public init(renderer: Renderer2, ligandId: string, imageContainer: ElementRef) {
    this.ligandId = ligandId;
    this.ligandId = ligandId;
    this.aggregatedApiService
      .fetchSubstructures(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (substructures) => {
          const fragments = substructures.fragments;
          this.getSubstructureNamesAndAtoms(fragments);

          const scaffolds = substructures.scaffolds;
          this.getSubstructureNamesAndAtoms(scaffolds);

          if (this.substructureNames().length > 0) {
            this.updateSlidesAndRender(renderer, ligandId, imageContainer);
          }
        },
        (error) => {
          this.updateSlidesAndRender(renderer, ligandId, imageContainer);
        }
      );
  }

  private updateSlidesAndRender(renderer: Renderer2, ligandId: string, imageContainer: ElementRef) {
    this.slides.update((slides) => [...slides, 0, 1]);
    this.renderLigand(renderer, ligandId, imageContainer);
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
          name: curr.name === 'MurckoScaffold' ? 'Murcko scaffold' : curr.name,
          descriptors: curr.descriptors,
          atoms: [atom],
        });
      }
      return acc;
    }, []);

    const uniqueFragments = mappedFragments.filter((obj, index, self) => index === self.findIndex((o) => o.name === obj.name));

    this.fragments.update(() => uniqueFragments);
    this.ligandUtilService.setFragments(this.fragments());
  }

  private setDepictionDescription(): void {
    switch (this.currentSlide()) {
      case 0:
        this.structureDescription.set(`Atom labelled ${this.ligandId}`);
        break;

      case 1:
        this.structureDescription.set(`Structural representation of ${this.ligandId}`);
        break;

      default:
        this.structureDescription.set(`${this.substructureNames()[this.currentSlide() - 2]} highlighted in yellow`);
    }
  }

  private setDepictionProperty(renderer: Renderer2, el: HTMLElement, index: number): void {
    switch (index) {
      case 0:
        renderer.setProperty(el, 'atomNames', true);
        renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      case 1:
        renderer.setProperty(el, 'atomNames', false);
        renderer.setProperty(el, 'highlightSubstructure', '');
        break;

      default:
        renderer.setProperty(el, 'atomNames', false);
        renderer.setProperty(el, 'highlightSubstructure', this.substructureAtoms[index - 2]);
    }
  }

  public onPreviousClick(renderer: Renderer2): void {
    const previous = this.currentSlide() - 1 < 0 ? this.substructureNames().length + 1 : this.currentSlide() - 1;
    this.currentSlide.set(previous);
    if (!this.slides().includes(this.currentSlide())) {
      this.slides()[1] = this.slides()[0];
      this.slides()[0] = this.currentSlide();
    }

    this.updateLigandImage(renderer);
  }

  public onNextClick(renderer: Renderer2): void {
    const next = this.currentSlide() + 1 === this.substructureNames().length + 2 ? 0 : this.currentSlide() + 1;
    this.currentSlide.set(next);
    if (!this.slides().includes(this.currentSlide())) {
      this.slides()[0] = this.slides()[1];
      this.slides()[1] = this.currentSlide();
    }
    this.updateLigandImage(renderer);
  }

  private updateLigandImage(renderer: Renderer2): void {
    this.setDepictionProperty(renderer, this.ligandEv, this.currentSlide());
    this.setDepictionDescription();
  }

  private renderLigand(renderer: Renderer2, ligandId: string, imageContainer: ElementRef): void {
    const imageContainerRef = imageContainer.nativeElement;

    const mappedLigandId = ligandId.startsWith('PRD') ? `${ligandId.split('_')[0]}CC_${ligandId.split('_')[1]}` : ligandId;

    this.aggregatedApiService
      .fetchDepiction(mappedLigandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((depiction: Depiction) => {
        this.createLigandEnvironment(renderer, imageContainerRef, depiction);
        this.setDepictionDescription();
        this.updateLigandImage(renderer);
      });
  }

  private createLigandEnvironment(renderer: Renderer2, container: ElementRef, depiction: Depiction): void {
    const ligand = renderer.createElement('pdb-ligand-env');
    renderer.appendChild(container, ligand);
    renderer.setProperty(ligand, 'depiction', depiction);

    // if (slide === 0) {
    //   this.setDepictionProperty(renderer, ligand, slide);
    // }
    // if (slide) {
    //   this.setDepictionProperty(renderer, ligand, slide);
    // }

    renderer.setAttribute(ligand, 'depiction-only', '');
    renderer.setAttribute(ligand, 'zoom-on', 'true');
    this.ligandEv = ligand;
  }

  public resetRenderer(renderer: Renderer2, imageContainer: ElementRef): void {
    const imageContainerRef = imageContainer.nativeElement;

    if (this.ligandEv) {
      renderer.removeChild(imageContainerRef, this.ligandEv);
    }

    this.slides.set([]);
    this.substructureNames.set([]);
    this.substructureAtoms = [];
    this.currentSlide.set(0);
    this.tempFragments = [];
  }
}
