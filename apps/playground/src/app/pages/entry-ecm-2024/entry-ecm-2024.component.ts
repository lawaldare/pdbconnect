/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrucExplorerEcm2024Component } from '../../components/struc-explorer-ecm-2024/struc-explorer-ecm-2024.component';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EntryInformationComponent } from '../../components/entry-information/entry-information.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntryLigandsEnvironmentsComponent } from '../../components/entry-ligands-environments/entry-ligands-environments.component';
import { EntryMacromoleculesComponent } from '../../components/entry-macromolecules/entry-macromolecules.component';
import { EntryExperimentValidationComponent } from '../../components/entry-experiment-validation/entry-experiment-validation.component';
import { EntryCitationComponent } from '../../components/entry-citation/entry-citation.component';
import { Molecule } from '../../models/molecule.model';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';
import { ClickOutsideDirective } from '@pdbc/core';

export interface DownloadOption {
  name: string;
  url: string;
  downloadable: boolean;
}

@Component({
  selector: 'pdbe-entry-ecm-2024',
  standalone: true,
  imports: [
    CommonModule,
    StrucExplorerEcm2024Component,
    PdbeLinkButtonComponent,
    EntryInformationComponent,
    EntryLigandsEnvironmentsComponent,
    RouterModule,
    ClickOutsideDirective,
    EntryMacromoleculesComponent,
    EntryExperimentValidationComponent,
    EntryCitationComponent,
    PdbeDropdownComponent,
  ],
  templateUrl: './entry-ecm-2024.component.html',
  styleUrl: './entry-ecm-2024.component.scss',
})
export class EntryEcm2024Component implements OnInit {
  private readonly playgroundService = inject(PlaygroundService);

  public downloadOptions: DownloadOption[] = [];
  public viewOptions: DownloadOption[] = [];

  public molecules!: Molecule[];
  public uniprotMapping!: any;
  public interproMapping!: any;
  public pfamMapping!: any;

  public navItems: {
    url: string;
    icon: string;
    label: string;
  }[] = [
    {
      url: `/`,
      icon: 'icon-common icon-home',
      label: 'Home',
    },
    {
      url: `/function`,
      icon: 'icon-conceptual icon-ontology',
      label: 'Function and Biology',
    },
    {
      url: `/ligands`,
      icon: 'icon-conceptual icon-chemical',
      label: 'Ligands and Environments',
    },
    {
      url: `/macromolecules`,
      icon: 'icon-conceptual icon-proteins',
      label: 'Macromolecules',
    },
    {
      url: `/assemblies`,
      icon: 'icon-conceptual icon-structures',
      label: 'Assemblies',
    },
    {
      url: `/experiments`,
      icon: 'icon-common icon-analyse',
      label: 'Experiments and Validation',
    },
    {
      url: `/citations`,
      icon: 'icon-conceptual icon-literature',
      label: 'Citation',
    },
  ];

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'

  public showDownloadOptions = signal(false);
  public showViewOptions = signal(false);

  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public currentSection = "/";

  public pageData$!: Observable<any>;

  ngOnInit(): void {
    this.route.queryParams
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

  // public switchSection(sectionName: string) {
  //   this.currentSection = sectionName;
  // }

  private setPageData(): Observable<any> {
    return combineLatest([
      this.playgroundService.getEntryEcmSummary(this.entryId()),
      this.playgroundService.getEntryEcmMolecules(this.entryId()).pipe(
        map((data) => {
          const molecules = data[this.entryId()];
          this.molecules = molecules.filter(
            (mol) =>
              mol.molecule_type === 'polypeptide(L)' ||
              mol.molecule_type === 'polypeptide(R)' ||
              mol.molecule_type === 'carbohydrate polymer' ||
              mol.molecule_type === 'polyribonucleotide' ||
              mol.molecule_type === 'polydeoxyribonucleotide' ||
              mol.molecule_type === 'polydeoxyribonucleotide/polyribonucleotide hybrid'
          );
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
      this.playgroundService.getEntryEcmExperiment(this.entryId()).pipe(
        map((response) => ({
          experimentalMethod: response.experimental_method,
          resolutionValue: response.resolution,
        }))
      ),
      this.playgroundService.getEntryEcmPublication(this.entryId()),
      this.playgroundService.getUniprotMapping(this.entryId()).pipe(
        map((data) => {
          this.uniprotMapping = data;
          return data;
        })
      ),
      this.playgroundService.getInterproMapping(this.entryId()).pipe(
        map((data) => {
          this.interproMapping = data;
          return data;
        })
      ),
      this.playgroundService.getPfamMapping(this.entryId()).pipe(
        map((data) => {
          this.pfamMapping = data;
          return data;
        })
      ),
      this.playgroundService.getPDBEntryFiles(this.entryId()).pipe(
        map((data) => {
          this.downloadOptions = this.processData(data).downloads;
          this.viewOptions = this.processData(data).views;
          return data;
        })
      ),
    ]).pipe(
      map(([summary, molecules, experiment, publication, uniprotMapping, interproMapping, pfamMapping, files]) => ({
        summary,
        molecules,
        experiment,
        publication,
      }))
    );
  }

  private processData(data: any) {
    const order = ['Archive mmCIF file', 'Updated mmCIF file', 'PDB file', 'Compatible PDB file bundle (tar.gz)', 'FASTA (Entry)', 'Full report (PDF)'];

    let downloads: any[] = [];
    let views: any[] = [];

    Object.keys(data).forEach((key) => {
      if (data[key].downloads) {
        downloads = downloads.concat(data[key].downloads);
      }
      if (data[key].views) {
        views = views.concat(data[key].views);
      }
    });

    downloads.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    views.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    const downloadsUpdated = downloads.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: true,
      };
    });

    const viewsUpdated = views.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: false,
      };
    });

    return { downloads: downloadsUpdated, views: viewsUpdated };
  }

  public onShowDownloadOptions() {
    this.showDownloadOptions.update((value) => !value);
    this.showViewOptions.update((_value) => false);
  }
  public onShowViewOptions() {
    this.showViewOptions.update((value) => !value);
    this.showDownloadOptions.update((_value) => false);
  }
  public onClickedOutside() {
    this.showViewOptions.set(false);
    this.showDownloadOptions.set(false);
  }

  public switchToTab(name: string) {
    this.currentSection = name;
    window.scrollTo({top: 0});
  }
}
