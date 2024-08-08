import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaygroundService } from '../../services/playground.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of, map } from 'rxjs';
import { Molecule } from '../../models/molecule.model';

@Component({
  selector: 'pdbe-entry-ligands-environments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-ligands-environments.component.html',
  styleUrl: './entry-ligands-environments.component.scss',
})
export class EntryLigandsEnvironmentsComponent implements OnInit {
  private readonly playgroundService = inject(PlaygroundService);

  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private entryId = signal('');

  public boundLigands: Molecule[] = [];

  public boundLigandsImages: { imageUrl: string; title: string }[] = [];

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.entryId.set(entryId);
          return this.playgroundService.getEntryEcmMolecules(this.entryId());
        }),
        map((response: Record<string, Molecule[]>) => {
          this.boundLigands = response[this.entryId()].filter((mol) => mol.molecule_type === 'bound');

          return this.boundLigands.map((mol) => {
            return {
              imageUrl: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${mol.chem_comp_ids[0]}_100.svg`,
              title: `${mol.number_of_copies} X ${mol.chem_comp_ids[0]}`,
            };
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        // this.pageData$ = of(data);
        this.boundLigandsImages = data;
        console.log(data);
      });
  }
}
