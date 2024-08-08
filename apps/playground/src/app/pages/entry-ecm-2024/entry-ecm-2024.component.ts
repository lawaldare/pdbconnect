import { Component, DestroyRef, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrucExplorerEcm2024Component } from '../../components/struc-explorer-ecm-2024/struc-explorer-ecm-2024.component';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EntryInformationComponent } from '../../components/entry-information/entry-information.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntryLigandsEnvironmentsComponent } from '../../components/entry-ligands-environments/entry-ligands-environments.component';

@Component({
  selector: 'pdbe-entry-ecm-2024',
  standalone: true,
  imports: [CommonModule, StrucExplorerEcm2024Component, PdbeLinkButtonComponent, EntryInformationComponent, EntryLigandsEnvironmentsComponent, RouterModule],
  templateUrl: './entry-ecm-2024.component.html',
  styleUrl: './entry-ecm-2024.component.scss',
})
export class EntryEcm2024Component implements OnInit {
  private readonly playgroundService = inject(PlaygroundService);

  public readonly navItems = [
    {
      url: '/',
      icon: 'icon-common icon-home',
      label: 'Home',
    },
    {
      url: '/biology',
      icon: 'icon-conceptual icon-ontology',
      label: 'Function and Biology',
    },
    {
      url: '/ligands',
      icon: 'icon-conceptual icon-chemical',
      label: 'Ligands and Environments',
    },
    {
      url: '/molecules',
      icon: 'icon-conceptual icon-expression',
      label: 'Macromolecules',
    },
    {
      url: '/assemblies',
      icon: 'icon-conceptual icon-structures',
      label: 'Assemblies',
    },
    {
      url: '/experiments',
      icon: 'icon-common icon-analyse',
      label: 'Experiments and Validation',
    },
    {
      url: '/citation',
      icon: 'icon-conceptual icon-literature',
      label: 'Citation',
    },
  ];

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'

  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public pageData$!: Observable<any>;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.entryId.set(entryId);
          return this.setPageData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.pageData$ = of(data);
      });
  }

  private setPageData(): Observable<any> {
    return combineLatest([
      this.playgroundService.getEntryEcmSummary(this.entryId()),
      this.playgroundService.getEntryEcmMolecules(this.entryId()).pipe(
        map((data) => {
          console.log(data);
          const molecules = data[this.entryId()];
          const organismNames: string[] = [];
          // See: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/1trn
          // and a more different example at: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/6hr1
          for (const entityDetail of molecules) {
            // if entity object has source (bound molecules and water do not have)
            if (Object.prototype.hasOwnProperty.call(entityDetail, 'source')) {
              for (const eachSource of entityDetail.source!) {
                if (!Object.prototype.hasOwnProperty.call(eachSource, 'organism_scientific_name')) {
                  continue;
                }
                // if source object has scientific name not yet in array
                if (organismNames.indexOf(eachSource.organism_scientific_name!) === -1) {
                  organismNames.push(eachSource.organism_scientific_name!);
                }
              }
            }
          }
          return {
            organismScientificNames: organismNames,
          };
        })
      ),
      this.playgroundService.getEntryEcmExperiment(this.entryId()),
      this.playgroundService.getEntryEcmPublication(this.entryId()),
    ]).pipe(
      map(([summary, molecules, experiment, publication]) => ({
        summary,
        molecules,
        experiment,
        publication,
      }))
    );
  }
}
