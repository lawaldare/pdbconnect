/* eslint-disable @typescript-eslint/no-unused-vars */

import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaygroundService } from '../../services/playground.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, map, forkJoin, catchError, EMPTY, of, throwError } from 'rxjs';
import { Molecule } from '../../models/molecule.model';
import { ModifiedResidues } from '../../models/modified-residues.model';

@Component({
  selector: 'pdbe-entry-ligands-environments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-ligands-environments.component.html',
  styleUrl: './entry-ligands-environments.component.scss',
})
export class EntryLigandsEnvironmentsComponent implements OnInit {
  private readonly playgroundService = inject(PlaygroundService);

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private entryId = signal('');

  public boundLigands: Molecule[] = [];

  public modifiedResidues: ModifiedResidues[] = [];

  public boundLigandsImages: { imageUrl: string; title: string }[] = [];

  public modifiedResiduesImages: { imageUrl: string; title: string }[] = [];

  public loadingText = signal('');

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.entryId.set(entryId);
          return forkJoin([
            this.playgroundService.getEntryEcmMolecules(this.entryId()),
            this.playgroundService.getModifiedResidues(this.entryId()).pipe(
              catchError((error) => {
                return of(undefined);
              })
            ),
          ]);
        }),
        map(([ligands, residues]) => {
          if (residues) {
            this.modifiedResidues = this.getUniqueModifiedResidues(residues);
          }
          this.boundLigands = ligands[this.entryId()].filter((mol) => mol.molecule_type === 'bound');

          return [
            this.boundLigands.map((mol) => {
              return {
                imageUrl: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${mol.chem_comp_ids[0]}_100.svg`,
                title: `${mol.number_of_copies} x ${mol.chem_comp_ids[0]}`,
              };
            }),
            this.modifiedResidues.map((mol) => {
              return {
                imageUrl: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${mol.chem_comp_id}_100.svg`,
                title: `${mol.number_of_times} x ${mol.chem_comp_id}`,
              };
            }),
          ];
        }),
        catchError(() => {
          this.loadingText.set('No ligands or modified residues in this entry.');
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([boundLigandsImages, modifiedResiduesImages]) => {
        this.boundLigandsImages = boundLigandsImages;
        this.modifiedResiduesImages = modifiedResiduesImages;
      });
  }

  private getUniqueModifiedResidues(data: Record<string, ModifiedResidues[]>): ModifiedResidues[] {
    const residues = data[this.entryId()];

    const uniqueChemCompIds = new Set();
    const uniqueObjects: ModifiedResidues[] = [];
    const chemCompIdCounts: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    residues.forEach((obj) => {
      const chemCompId = obj.chem_comp_id;
      if (chemCompIdCounts[chemCompId]) {
        chemCompIdCounts[chemCompId]++;
      } else {
        chemCompIdCounts[chemCompId] = 1;
      }
    });

    residues.forEach((obj) => {
      const chemCompId = obj.chem_comp_id;
      if (!uniqueChemCompIds.has(chemCompId)) {
        uniqueChemCompIds.add(chemCompId);
        uniqueObjects.push({
          ...obj,
          number_of_times: chemCompIdCounts[chemCompId],
        });
      }
    });

    return uniqueObjects;
  }
}
