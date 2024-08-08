import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit, DestroyRef, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandGrid } from '../../../data-models/related-ligands.model';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { UtilService } from '@pdbc/core';

@Component({
  selector: 'pdbc-ligand-grid',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ligand-grid.component.html',
  styleUrl: './ligand-grid.component.scss',
})
export class LigandGridComponent implements OnChanges, AfterViewInit {
  @Input() ligand!: LigandGrid;
  ligandUrl = '';
  public boundEntryLabel = '';
  public boundEntryUrl = '';
  boundProteinLabel = '';

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;
  private ligandEv!: any;
  public ligandId!: string;

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly util = inject(UtilService);

  renderLigandImg(ligandId: string) {
    const imageContainer = this.imageContainer.nativeElement;

    this.aggregatedApiService
      .fetchDepiction(ligandId)
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
    const numBoundEntries = this.ligand.bound_entries.length;
    const boundEntryLabelSuffix = numBoundEntries <= 1 ? 'PDB Entry' : 'PDB Entries';
    this.boundEntryLabel = `${numBoundEntries} ${boundEntryLabelSuffix}`;
    this.boundEntryUrl = this.util.generateQueryURL(this.ligand.bound_entries, 'q_pdb_id');
  }

  ngAfterViewInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.resetRenderer();
          this.ligandId = params['ligandId'].toUpperCase();
          this.renderLigandImg(this.ligandId);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private resetRenderer(): void {
    const imageContainer = this.imageContainer.nativeElement;

    if (this.ligandEv) {
      this.renderer.removeChild(imageContainer, this.ligandEv);
    }
  }
}
