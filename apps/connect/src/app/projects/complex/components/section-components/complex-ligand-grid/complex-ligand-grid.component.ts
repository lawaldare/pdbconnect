import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService } from '../../../../ligands/services/aggregated-api.service';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { cofactorTooltip, drugTooltip, reactantTooltip } from '../../../../ligands/ligand.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Depiction } from '../../../../ligands/data-models/structure.model';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { ComplexLigand } from '../../../models/complex-ligands.model';

@Component({
  selector: 'pdbc-complex-ligand-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './complex-ligand-grid.component.html',
  styleUrl: './complex-ligand-grid.component.scss',
})
export class ComplexLigandGridComponent implements AfterViewInit {
  public ligand = input.required<ComplexLigand>();
  public complexId = input.required<string>();

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly utilService = inject(ComplexUtilService);

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;
  private ligandEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  public ligandId!: string;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly util = inject(UtilService);

  public solrUrl = signal<string>('');

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  renderLigandImg(): void {
    this.resetRenderer();
    const imageContainer = this.imageContainer.nativeElement;
    this.aggregatedApiService
      .fetchDepiction(this.ligand().ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (depiction: Depiction) => {
        await customElements.whenDefined('pdb-ligand-env');
        const ligand = this.renderer.createElement('pdb-ligand-env');
        ligand.zoomControlsOff = true;
        this.renderer.appendChild(imageContainer, ligand);
        this.renderer.setProperty(ligand, 'depiction', depiction);
        // setTimeout(() => this.renderer.setProperty(ligand, 'depiction', depiction), 250);
        this.renderer.setAttribute(ligand, 'depiction-only', '');
        this.ligandEv = ligand;
      });
  }

  ngAfterViewInit() {
    this.renderLigandImg();
    this.solrUrl.set(this.util.generateQueryURLForComplexLigand(this.complexId(), this.ligand().ligandId));
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }
  }

  public openLigandPage(ligandId: string): void {
    this.utilService.openLigandPage(ligandId);
  }
}
