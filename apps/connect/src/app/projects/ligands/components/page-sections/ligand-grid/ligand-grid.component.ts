import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit, DestroyRef, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandGrid } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { MatDialog } from '@angular/material/dialog';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pdbc-ligand-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ligand-grid.component.html',
  styleUrl: './ligand-grid.component.scss',
})
export class LigandGridComponent implements OnChanges, AfterViewInit {
  @Input() ligand!: LigandGrid;
  public boundEntryLabel = '';
  public boundEntryUrl = '';

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;
  private ligandEv!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  public ligandId!: string;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly util = inject(UtilService);
  private readonly dialog = inject(MatDialog);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  public readonly utilService = inject(UtilService);

  renderLigandImg() {
    this.resetRenderer();
    const imageContainer = this.imageContainer.nativeElement;
    this.aggregatedApiService
      .fetchDepiction(this.ligand.chem_comp_id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((depiction: Depiction) => {
        const ligand = this.renderer.createElement('pdb-ligand-env');
        this.renderer.appendChild(imageContainer, ligand);
        this.renderer.setProperty(ligand, 'depiction', depiction);
        this.renderer.setProperty(ligand, 'highlightSubstructure', this.ligand.substructure_match);
        this.renderer.setAttribute(ligand, 'depiction-only', '');
        this.ligandEv = ligand;
      });
  }

  ngOnChanges() {
    const numBoundEntries = (this.ligand.bound_entries ?? []).length;
    const boundEntryLabelSuffix = numBoundEntries <= 1 ? 'PDB Entry' : 'PDB Entries';
    this.boundEntryLabel = `${numBoundEntries} ${boundEntryLabelSuffix}`;
    this.boundEntryUrl = this.util.generateSortedQueryURL(this.ligand.chem_comp_id, 'q_compound_id');
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

  public openMolstarDialog(): void {
    const data = {
      moleculeId: this.ligand.chem_comp_id,
      atoms: this.ligand.substructure_match,
    };

    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: data,
    });
  }

  public openLigand(ligandId: string): void {
    this.utilService.redirectToSearchTerm(ligandId);
    this.googleAnalyticsService.logClickEvents('click_ligand_link', 'Related Ligands', 'click_ligand', ligandId);
  }
}
