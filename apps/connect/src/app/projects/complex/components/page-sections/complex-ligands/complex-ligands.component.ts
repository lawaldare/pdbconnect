import { Component, computed, inject, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ComplexLigandGridComponent } from '../../section-components/complex-ligand-grid/complex-ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';

export interface ComplexLigand {
  ligandId: string;
  annotations: string[];
  num_pdb_entries: number;
  num_chains: number;
  num_ligand_instances: number;
  name: string;
}

@Component({
  selector: 'pdbc-complex-ligands',
  standalone: true,
  imports: [CommonModule, ComplexLigandGridComponent, MatPaginator],
  templateUrl: './complex-ligands.component.html',
  styleUrl: './complex-ligands.component.scss',
})
export class ComplexLigandsComponent {
  private readonly complexAPIService = inject(ComplexAPIService);

  private readonly route = inject(ActivatedRoute);

  private readonly ligands$ = this.route.params.pipe(
    switchMap((params) => {
      const complexId = params['complexId'].toUpperCase();
      return this.complexAPIService.getLigandsForComplexPages(complexId).pipe(
        map((ligands: Record<string, any>) => {
          return Object.entries(ligands).reduce((acc: ComplexLigand[], [key, value]) => {
            const mappedObj = {
              ...value,
              ligandId: key,
            };
            acc.push(mappedObj);
            return acc.sort((a, b) => b.num_ligand_instances - a.num_ligand_instances);
          }, []);
        }),
        catchError((error) => {
          console.error('Error fetching complex data:', error);
          return of([]);
        })
      );
    }),
    tap((ligands) => {
      console.log('Fetched ligands:', ligands);
      this.ligandsPage.update(() => ligands.slice(0, this.ligandsPageSize()));
    })
  );

  public ligands = toSignal(this.ligands$);
  public ligandsLength = computed(() => this.ligands()?.length);
  public ligandsPageSize = signal<number>(5);
  public ligandsPageSizeOptions = computed(() => [5, 10, 15]);

  public ligandsPage = signal<ComplexLigand[]>([]);

  handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.ligandsPage.update(() => (this.ligands() ?? []).slice(startIndex, endIndex));
  }
}
