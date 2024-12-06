import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { EntryApiService } from '../../services/entry-api.service';
import { DownloadOption, DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { catchError, combineLatest, forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { AnyExperimentDetail } from '../../data-models/experimental-details.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UniProtMapping } from '../../data-models/uniprot-mapping.model';
import { BestStructureMapping } from '../../data-models/uniport-best-structures.model';
import { BestStructureDict } from '../../data-models/uniprot-best-structures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickOutsideDirective } from '@pdbc/core';
import { MainInformationAreaComponent } from '../../components/main-information-area/main-information-area.component';
import { OverviewMolstarComponent } from '../../components/overview-molstar/overview-molstar.component';
import { InteractiveTablesComponent } from '../../components/interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../../components/details-dashboard/details-dashboard.component';
import { ExperimentsValidationTabComponent } from '../../components/experiments-validation-tab/experiments-validation-tab.component';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { pdbeLogoConfig, pdbeSearchConfig, allTabs, tableTabs } from '../../entry-constant';
import { Molecule } from '../../data-models/molecule.model';
import { CathMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { ResidueListing } from '../../data-models/residue-listing.model';
import { KeyValidationStats } from '../../data-models/key-validation-stats.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import { CitationDetail } from '../../data-models/publication.model';
import { RelatedPublication } from '../../data-models/related-publications.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { AssemblyData } from '../../data-models/assembly.model';
import { PisaAssembly } from '../../data-models/pisa-assembly.model';
import { CarbohydrateMolecule } from '../../data-models/carbohydrate-polymer.model';
import { ProcessedSummary } from '../../data-models/summary.model';

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains';
/**
 * TODO:
 * - Add Dynamic SCRIPT loading
 * - Lib Search bar component must be flexible for PDBe vs Ligand pages
 */
@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    DropdownMenuComponent,
    ClickOutsideDirective,
    MainInformationAreaComponent,
    OverviewMolstarComponent,
    InteractiveTablesComponent,
    DetailsDashboardComponent,
    ExperimentsValidationTabComponent,
    CitationsTabComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  // Properties to control the PDBe logo visibility and style
  public showPdbeLogoAndSearch = signal(false);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly allTabs = allTabs;
  public readonly tableTabs = tableTabs;

  private readonly entryAPIService = inject(EntryApiService);

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'
  public showDownloadOptions = signal(false);
  public showViewOptions = signal(false);

  private route = inject(ActivatedRoute);
  public readonly signals = inject(ComponentCommunicationService);
  public currentTab = this.signals.currentTab;
  public tabSwitchOrigin = this.signals.tabSwitchOrigin;
  public previousTab = 'undefined';

  private readonly destroyRef = inject(DestroyRef);

  public pageData$!: Observable<any>;

  // TODO: Add missing data-models and add proper undefined to data from API endpoints
  // TODO: pageData becomes apiStatus with string for to-load loaded-none, loading, loaded-exists
  // TODO: modify child components to get data properly from here
  // TODO: move CSS of child components so their width/height is relative to CSS in this component
  // TODO: refactor header and search for PDBe Entry pgs

  //getEntrySummary
  public summaryData!: ProcessedSummary;

  // getEntryMolecules
  public macroMolecules!: Molecule[];
  public boundLigands!: Molecule[];
  public organismScientificNames!: string[];

  // getExperiment
  public experimentalDetails!: AnyExperimentDetail[];
  public experimentalMethod!: string;
  public resolutionValues!: number | undefined;

  // getUniprotMapping
  public uniprotMapping!: UniProtMapping;
  public uniprotCountsInPDBe!: { [key: string]: number };
  public bestStructuresMappingsByUniProtIds!: { [key: string]: BestStructureMapping[] };

  // getInterproMapping
  public interproMapping!: any;

  // getPDBEntryFiles
  public downloadOptions: DownloadOption[] = [];
  public viewOptions: DownloadOption[] = [];

  // getPfamMapping
  public pfamMapping!: PfamMappings;

  // getSummaryQualityScores
  public summaryQualityScores!: any;

  // getCATHMapping
  public cathMapping!: CathMappings;

  // getSCOP175Mapping
  public scop175Mapping!: ScopMappings;

  // getModifications
  public modifications!: ModifiedResidue[];

  // getResidueListing
  public residueListing!: ResidueListing;

  // getValidationKeyStats
  public validationKeyStats?: KeyValidationStats;

  // getValidationXRayRefine
  public validationXRayRefine?: XRayRefine;

  // getPrimaryPublicationAbstract
  public primaryPublicationAbstract?: CitationDetail;

  // getArticleCitingPDBEntry
  public articleCitingPDBEntry?: RelatedPublication;

  // getPreferredAssembly
  public complexDetails!: ComplexDetails[];

  // getAssembly
  public assemblies!: AssemblyData[];
  public pisaAssemblies!: PisaAssembly[];

  // getCarbohydrates
  public carbohydrates!: CarbohydrateMolecule[];

  constructor() {
    effect(async () => {
      // Access the current state
      const tabState = this.signals.tabState();

      if (this.tabSwitchOrigin() !== 'main') {
        // if (this.currentTab() !== this.previousTab) {
        console.log('switch!!!!');
        const el = document.getElementById('detail-tabs');
        el!.scrollIntoView();
        this.previousTab = `${this.currentTab()}`;
      }
    });
  }

  ngOnInit(): void {
    this.previousTab = `${this.currentTab()}`;
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
        console.log('data');
        console.log(data);
        this.pageData$ = of(data);
      });
  }

  private setPageData(): Observable<any> {
    return combineLatest([
      this.entryAPIService.getEntrySummary(this.entryId()).pipe(
        map((data) => {
          this.summaryData = data;
          return data;
        })
      ),
      this.entryAPIService.getEntryMolecules(this.entryId()).pipe(
        map((data) => {
          const molecules = data[this.entryId()];

          const macromoleculeSortedTypesArray = [
            'polypeptide(L)',
            'polypeptide(R)',
            'carbohydrate polymer',
            'polyribonucleotide',
            'polydeoxyribonucleotide',
            'polydeoxyribonucleotide/polyribonucleotide hybrid',
          ];

          const macroMolecules = molecules
            .filter((mol) => macromoleculeSortedTypesArray.indexOf(mol.molecule_type) > -1)
            .sort((a, b) => macromoleculeSortedTypesArray.indexOf(a.molecule_type) - macromoleculeSortedTypesArray.indexOf(b.molecule_type));

          const boundLigands = molecules.filter((mol) => mol.molecule_type === 'bound');

          const organismNames: string[] = [];

          // See: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/1trn
          // and a more different example at: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/6hr1
          for (const entityDetail of molecules) {
            const sources = entityDetail['source'] ?? [];
            for (const eachSource of sources) {
              const organismName = eachSource['organism_scientific_name'] ?? undefined;
              if (organismName && organismNames.indexOf(organismName) === -1) {
                organismNames.push(organismName);
              }
            }
          }

          this.macroMolecules = macroMolecules;
          this.boundLigands = boundLigands;
          this.organismScientificNames = organismNames;

          return {
            macroMolecules: macroMolecules,
            boundLigands: boundLigands,
            organismScientificNames: organismNames,
          };
        })
      ),
      this.entryAPIService.getExperiment(this.entryId()).pipe(
        map((response) => {
          this.experimentalDetails = response;

          const experimentalMethodTitle = response.length > 1 ? 'Hybrid' : (response[0].experimental_method as string);
          const resolutionValues: number | undefined = response.map((datum: AnyExperimentDetail) => {
            if ('resolution' in datum) return datum['resolution'];
            else return undefined;
          });

          this.experimentalMethod = experimentalMethodTitle;
          this.resolutionValues = resolutionValues;

          return {
            experimentalMethod: experimentalMethodTitle,
            resolutionValues: resolutionValues,
            details: response,
          };
        })
      ),
      this.entryAPIService.getUniprotMapping(this.entryId()).pipe(
        mergeMap((data: UniProtMapping) => {
          // For each UniProt id we create a bestStructures observable
          const uniprotIds = Object.keys(data);
          const bestStructuresObservables = uniprotIds.map((uniprotId) => this.entryAPIService.getBestStructures(uniprotId));

          // Dictionaries needed for views
          const bestStructuresMappingsByUniProtIds: { [key: string]: BestStructureMapping[] } = {};
          const uniprotCountsInPDBe: { [key: string]: number } = {};

          // Use forkJoin to wait for all bestStructures observables to complete
          return forkJoin(bestStructuresObservables).pipe(
            map((uniprotDictInList: unknown) => {
              for (const uniprotDict of uniprotDictInList as BestStructureDict[]) {
                const uniprotId = Object.keys(uniprotDict)[0];
                const uniprotData = uniprotDict[uniprotId];

                // dictionary uniprotCountsInPDBe is updated for counts of all unique entries which have a UniProt id mapped
                const uniquePDBIds = uniprotData.map((datum) => datum.pdb_id).filter((value, index, array) => array.indexOf(value) === index);

                uniprotCountsInPDBe[uniprotId] = uniquePDBIds.length;

                // dictionary bestStructuresMappingsByUniProtIds is updated with best structures mappings for this entry
                const uniprotDataFiltered = uniprotDict[uniprotId].filter((datum) => datum.pdb_id === this.entryId());

                bestStructuresMappingsByUniProtIds[uniprotId] = bestStructuresMappingsByUniProtIds[uniprotId] ?? [];
                bestStructuresMappingsByUniProtIds[uniprotId].push(...uniprotDataFiltered);
              }

              this.uniprotMapping = data;
              this.uniprotCountsInPDBe = uniprotCountsInPDBe;
              this.bestStructuresMappingsByUniProtIds = bestStructuresMappingsByUniProtIds;

              return {
                uniprotMapping: data,
                uniprotCountsInPDBe: uniprotCountsInPDBe,
                bestStructuresMappingsByUniProtIds: bestStructuresMappingsByUniProtIds,
              };
            })
          );
        }),
        // TODO: Improve error handling when some observables contain data and others not
        catchError((_error: HttpErrorResponse) => {
          this.uniprotMapping = {};
          this.uniprotCountsInPDBe = {};
          this.bestStructuresMappingsByUniProtIds = {};

          return of({
            uniprotMapping: {},
            uniprotCountsInPDBe: {},
            bestStructuresMappingsByUniProtIds: {},
          });
        })
      ),
      this.entryAPIService.getInterproMapping(this.entryId()).pipe(
        map((data) => {
          this.interproMapping = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.interproMapping = {};
          return of({});
        })
      ),
      this.entryAPIService.getPfamMapping(this.entryId()).pipe(
        map((data) => {
          this.pfamMapping = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.pfamMapping = {};
          return of({});
        })
      ),
      this.entryAPIService.getPDBEntryFiles(this.entryId()).pipe(
        map((data) => {
          this.downloadOptions = this.processData(data).downloads;
          this.viewOptions = this.processData(data).views;
          return data;
        })
      ),
      this.entryAPIService.getSummaryQualityScores(this.entryId()).pipe(
        map((data) => {
          this.summaryQualityScores = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.summaryQualityScores = {};
          return of({});
        })
      ),
      this.entryAPIService.getCATHMapping(this.entryId()).pipe(
        map((data) => {
          this.cathMapping = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.cathMapping = {};
          return of({});
        })
      ),
      this.entryAPIService.getSCOP175Mapping(this.entryId()).pipe(
        map((data) => {
          this.scop175Mapping = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.scop175Mapping = {};
          return of({});
        })
      ),
      this.entryAPIService.getModifications(this.entryId()).pipe(
        map((data) => {
          this.modifications = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.modifications = [];
          return of([]);
        })
      ),
      this.entryAPIService.getResidueListing(this.entryId()).pipe(
        map((data) => {
          this.residueListing = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          const emptyListing = { molecules: [] };
          this.residueListing = emptyListing;
          return of(emptyListing);
        })
      ),
      this.entryAPIService.getValidationKeyStats(this.entryId()).pipe(
        map((data) => {
          this.validationKeyStats = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.validationKeyStats = undefined;
          return of(undefined);
        })
      ),
      this.entryAPIService.getValidationXRayRefine(this.entryId()).pipe(
        map((data) => {
          this.validationXRayRefine = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.validationXRayRefine = undefined;
          return of(undefined);
        })
      ),
      this.entryAPIService.getPrimaryPublicationAbstract(this.entryId()).pipe(
        map((data) => {
          this.primaryPublicationAbstract = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.primaryPublicationAbstract = undefined;
          return of(undefined);
        })
      ),
      this.entryAPIService.getArticleCitingPDBEntry(this.entryId()).pipe(
        map((data) => {
          this.articleCitingPDBEntry = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.articleCitingPDBEntry = undefined;
          return of(undefined);
        })
      ),
      this.entryAPIService.getPreferredAssembly(this.entryId()).pipe(
        map((data) => {
          this.complexDetails = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.complexDetails = [];
          return of([]);
        })
      ),
      this.entryAPIService.getAssembly(this.entryId()).pipe(
        // This is a special case where we have to parse getAssembly to run multiple getPisaAssembly
        mergeMap((data) => {
          const pisaAssemblyObservables = data
            .sort((a, b) => parseInt(a.assembly_id) - parseInt(b.assembly_id))
            .map((assemblyDatum) => this.entryAPIService.getPisaAssembly(this.entryId(), assemblyDatum.assembly_id));

          // Use forkJoin to wait for all PisaAssembly observables to complete
          return forkJoin(pisaAssemblyObservables).pipe(
            map((pisaAssemblies) => {
              this.assemblies = data;
              this.pisaAssemblies = pisaAssemblies;
              return {
                assemblies: data,
                pisaAssemblies: pisaAssemblies,
              };
            })
          );
        }),
        catchError((_error: HttpErrorResponse) => {
          this.assemblies = [];
          this.pisaAssemblies = [];
          return of({
            assemblies: [],
            pisaAssemblies: [],
          });
        })
      ),
      this.entryAPIService.getCarbohydrates(this.entryId()).pipe(
        map((data) => {
          this.carbohydrates = data;
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.carbohydrates = [];
          return of([]);
        })
      ),
    ]).pipe(
      map(
        ([
          summary,
          molecules,
          experiment,
          uniprotData,
          interproMapping,
          pfamMapping,
          files,
          qualityScores,
          cathMapping,
          scopMapping,
          modifications,
          residueListing,
          keyValidationStats,
          xRayRefine,
          primaryPublication,
          articlesCiting,
          complexDetails,
          assembliesData,
          carbohydratesData,
        ]) => ({
          summary,
          molecules,
          experiment,
          // publication,
          uniprotData,
          interproMapping,
          pfamMapping,
          files,
          qualityScores,
          cathMapping,
          scopMapping,
          modifications,
          residueListing,
          keyValidationStats,
          xRayRefine,
          primaryPublication,
          articlesCiting,
          complexDetails,
          assembliesData,
          carbohydratesData,
        })
      )
    );
  }

  public changeCurrentTab(tabName: string) {
    this.previousTab = `${tabName}`;
    this.tabSwitchOrigin.set('main');
    this.currentTab.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
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
}
