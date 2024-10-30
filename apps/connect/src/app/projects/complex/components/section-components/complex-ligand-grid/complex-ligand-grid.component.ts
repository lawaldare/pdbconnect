import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexLigand } from '../../page-sections/complex-ligands/complex-ligands.component';
import { AggregatedApiService } from '../../../../ligands/services/aggregated-api.service';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { cofactorTooltip, drugTooltip, reactantTooltip } from '../../../../ligands/ligand.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Depiction } from '../../../../ligands/data-models/structure.model';

@Component({
  selector: 'pdbc-complex-ligand-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './complex-ligand-grid.component.html',
  styleUrl: './complex-ligand-grid.component.scss',
})
export class ComplexLigandGridComponent implements AfterViewInit {
  public ligand = input.required<ComplexLigand>();
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;
  private ligandEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  public ligandId!: string;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  renderLigandImg() {
    this.resetRenderer();
    const imageContainer = this.imageContainer.nativeElement;
    this.aggregatedApiService
      .fetchDepiction(this.ligand().ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((depiction: Depiction) => {
        const ligand = this.renderer.createElement('pdb-ligand-env');
        this.renderer.appendChild(imageContainer, ligand);
        this.renderer.setProperty(ligand, 'depiction', depiction);
        // this.renderer.setProperty(ligand, 'highlightSubstructure', this.ligand.substructure_match);
        this.renderer.setAttribute(ligand, 'depiction-only', '');
        this.ligandEv = ligand;
      });
  }

  ngAfterViewInit() {
    this.renderLigandImg();
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }
  }

  public openLigandPage(ligandId: string) {
    this.googleAnalyticsService.logClickEvents('click_Complex_ligand_link', 'Related Ligands', 'click_complex_ligand', ligandId);
    const trimmedValue = ligandId.trim();
    const origin = window.location.origin;
    const pathname = '/chemicalCompound/show/';
    const href = origin + pathname + trimmedValue;
    window.open(href, '_self');
  }
}
