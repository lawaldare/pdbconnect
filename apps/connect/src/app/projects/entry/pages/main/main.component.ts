import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
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
import { pdbeLogoConfig, pdbeSearchConfig, allTabs, tableTabs, COMPONENT_DEPENDENCIES, INITIAL_API_STATUS } from '../../entry-constant';
import { Molecule } from '../../data-models/molecule.model';
import { CathMappings, InterProMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { KeyValidationStats } from '../../data-models/key-validation-stats.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import { CitationDetail } from '../../data-models/publication.model';
import { RelatedPublication } from '../../data-models/related-publications.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { AssemblyData } from '../../data-models/assembly.model';
import { PisaAssembly } from '../../data-models/pisa-assembly.model';
import { CarbohydrateMolecule } from '../../data-models/carbohydrate-polymer.model';
import { ProcessedSummary } from '../../data-models/summary.model';
import { ProcessedQualityScores } from '../../data-models/summary-quality-scores.model';
import { MatSnackBar } from '@angular/material/snack-bar';

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains';
/**
 * TODO:
 * - Move CSS of child components so their width/height is relative to CSS in this component
 * - Make <SCRIPT> tags loading Dynamic
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
  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly allTabs = allTabs;
  public readonly tableTabs = tableTabs;

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'
  public showDownloadOptions = signal(false);
  public showViewOptions = signal(false);

  private route = inject(ActivatedRoute);
  public readonly signals = inject(ComponentCommunicationService);
  private readonly entryAPIService = inject(EntryApiService);
  private _snackBar = inject(MatSnackBar);

  public currentTab = this.signals.currentTab;
  public tabSwitchOrigin = this.signals.tabSwitchOrigin;
  public previousTab = 'undefined';

  private readonly destroyRef = inject(DestroyRef);

  // public pageData$!: Observable<any>;

  // signal that holds whether an API call is pending or done for all needed APIs
  public apiLoadedStatus = signal(INITIAL_API_STATUS);

  // signals for residue listing information provided by Molstar inside OverviewMolstar component
  public molstarResidueInfoLoaded = this.signals.molstarResidueInfoLoaded; // boolean
  public molstarResidueInfo = this.signals.molstarResidueInfo; // residue listing

  // signal that is computed as API calls go from pending to done
  // for each component it holds the necessary API calls that need status done
  public componentLoadedStatus = computed(() => {
    const apiStatus = this.apiLoadedStatus();
    const status: Record<string, boolean> = {};

    // for each component name and the list of API dependencies in COMPONENT_DEPENDENCIES dictionary
    Object.entries(COMPONENT_DEPENDENCIES).forEach(([component, dependencies]) => {
      // component load status is updated to true if every needed API dependency has status 'done'
      status[component] = dependencies.every((dep) => apiStatus[dep] === 'done');
    });

    return status;
  });

  // API data from getEntrySummary https://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/:entryID
  public summaryData!: ProcessedSummary;

  // API data from getEntryMolecules https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/:entryID
  public macroMolecules!: Molecule[];
  public boundLigands!: Molecule[];
  public organismScientificNames!: string[];

  // API data from getExperiment https://www.ebi.ac.uk/pdbe/api/pdb/entry/experiment/:entryID
  public experimentalDetails!: AnyExperimentDetail[];
  public experimentalMethod!: string;
  public resolutionValues!: Array<number | undefined>;

  // API data from getUniprotMapping https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/:entryID
  public uniprotMapping!: UniProtMapping;
  public uniprotCountsInPDBe!: { [key: string]: number };
  public bestStructuresMappingsByUniProtIds!: { [key: string]: BestStructureMapping[] };

  // API data from getInterproMapping https://www.ebi.ac.uk/pdbe/api/mappings/interpro/:entryID
  public interproMapping!: InterProMappings;

  // API data from getPDBEntryFiles https://www.ebi.ac.uk/pdbe/api/pdb/entry/files/:entryID
  public downloadOptions: DownloadOption[] = [];
  public viewOptions: DownloadOption[] = [];

  // API data from getPfamMapping https://www.ebi.ac.uk/pdbe/api/mappings/pfam/:entryID
  public pfamMapping!: PfamMappings;

  // API data from getSummaryQualityScores https://www.ebi.ac.uk/pdbe/api/validation/summary_quality_scores/entry/:entryID
  public summaryQualityScores?: ProcessedQualityScores;

  // API data from getCATHMapping https://www.ebi.ac.uk/pdbe/api/mappings/cath/:entryID
  public cathMapping!: CathMappings;

  // API data from getSCOP175Mapping https://www.ebi.ac.uk/pdbe/api/mappings/scop/:entryID
  public scop175Mapping!: ScopMappings;

  // API data from getModifications https://www.ebi.ac.uk/pdbe/api/pdb/entry/modified_AA_or_NA/:entryID
  public modifications!: ModifiedResidue[];

  // API data from getValidationKeyStats https://www.ebi.ac.uk/pdbe/api/validation/key_validation_stats/entry/:entryID
  public validationKeyStats?: KeyValidationStats;

  // API data from getValidationXRayRefine https://www.ebi.ac.uk/pdbe/api/validation/xray_refine_data_stats/entry/:entryID
  public validationXRayRefine?: XRayRefine;

  // API data from getPrimaryPublicationAbstract https://www.ebi.ac.uk/pdbe/api/pdb/entry/publications/:entryID
  public primaryPublication?: CitationDetail;

  // API data from getArticleCitingPDBEntry https://www.ebi.ac.uk/pdbe/api/pdb/entry/related_publications/:entryID
  public articlesCiting?: RelatedPublication;

  // API data from getPreferredAssembly https://www.ebi.ac.uk/pdbe/aggregated-api/complex/details/:entryID:?id_type=pdb_id
  public complexDetails!: ComplexDetails[];

  // API data from getAssembly https://www.ebi.ac.uk/pdbe/api/pdb/entry/assembly/:entryID and https://www.ebi.ac.uk/pdbe/api/pisa/assembly/:entryID:/:entityId
  public assemblies!: AssemblyData[];
  public pisaAssemblies!: PisaAssembly[];

  // API data from getCarbohydrates https://www.ebi.ac.uk/pdbe/api/pdb/entry/carbohydrate_polymer/:entryID
  public carbohydrates!: CarbohydrateMolecule[];

  constructor() {
    effect(async () => {
      // Access the current state
      const tabState = this.signals.tabState();

      if (this.tabSwitchOrigin() !== 'main') {
        if (this.componentLoadedStatus()['detailsDashboard'] === false) {
          // this.utilService.openSnackBar('Please wait until page completely loads', 'Dismiss');
          this._snackBar.open('Please wait until page completely loads', 'Dismiss'), { duration: 3000 };
        }
        // if (this.currentTab() !== this.previousTab) {
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
      .subscribe();
    // .subscribe((data) => {
    //   console.log('data');
    //   console.log(data);
    //   this.pageData$ = of(data);
    // });
  }

  private setPageData(): Observable<any> {
    return combineLatest([
      this.entryAPIService.getEntrySummary(this.entryId()).pipe(
        map((data) => {
          this.summaryData = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            summaryData: 'done', // update the specific key dynamically
          }));
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

          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            macroMolecules: 'done', // update the specific key dynamically
            boundLigands: 'done', // update the specific key dynamically
            organismScientificNames: 'done', // update the specific key dynamically
          }));

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
          const resolutionValues: Array<number | undefined> = response.map((datum: AnyExperimentDetail) => {
            if ('resolution' in datum) return datum['resolution'];
            else return undefined;
          });

          this.experimentalMethod = experimentalMethodTitle;
          this.resolutionValues = resolutionValues;

          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentalDetails: 'done', // update the specific key dynamically
            experimentalMethod: 'done', // update the specific key dynamically
            resolutionValues: 'done', // update the specific key dynamically
          }));

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

              this.apiLoadedStatus.update((state) => ({
                ...state, // spread the existing state
                uniprotMapping: 'done', // update the specific key dynamically
                uniprotCountsInPDBe: 'done', // update the specific key dynamically
                bestStructuresMappingsByUniProtIds: 'done', // update the specific key dynamically
              }));

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

          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            uniprotMapping: 'done', // update the specific key dynamically
            uniprotCountsInPDBe: 'done', // update the specific key dynamically
            bestStructuresMappingsByUniProtIds: 'done', // update the specific key dynamically
          }));

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
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            interproMapping: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.interproMapping = {};
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            interproMapping: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getPfamMapping(this.entryId()).pipe(
        map((data) => {
          this.pfamMapping = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            pfamMapping: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.pfamMapping = {};
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            pfamMapping: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getPDBEntryFiles(this.entryId()).pipe(
        map((data) => {
          this.downloadOptions = this.processData(data).downloads;
          this.viewOptions = this.processData(data).views;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            downloadOptions: 'done', // update the specific key dynamically
            viewOptions: 'done', // update the specific key dynamically
          }));
          return data;
        })
      ),
      this.entryAPIService.getSummaryQualityScores(this.entryId()).pipe(
        map((data) => {
          this.summaryQualityScores = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            summaryQualityScores: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.summaryQualityScores = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            summaryQualityScores: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getCATHMapping(this.entryId()).pipe(
        map((data) => {
          this.cathMapping = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            cathMapping: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.cathMapping = {};
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            cathMapping: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getSCOP175Mapping(this.entryId()).pipe(
        map((data) => {
          this.scop175Mapping = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            scop175Mapping: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.scop175Mapping = {};
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            scop175Mapping: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getModifications(this.entryId()).pipe(
        map((data) => {
          this.modifications = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            modifications: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.modifications = [];
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            modifications: 'done', // update the specific key dynamically
          }));
          return of([]);
        })
      ),
      this.entryAPIService.getValidationKeyStats(this.entryId()).pipe(
        map((data) => {
          this.validationKeyStats = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            validationKeyStats: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.validationKeyStats = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            validationKeyStats: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getValidationXRayRefine(this.entryId()).pipe(
        map((data) => {
          this.validationXRayRefine = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            validationXRayRefine: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.validationXRayRefine = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            validationXRayRefine: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getPrimaryPublicationAbstract(this.entryId()).pipe(
        map((data) => {
          this.primaryPublication = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            primaryPublication: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.primaryPublication = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            primaryPublication: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getArticleCitingPDBEntry(this.entryId()).pipe(
        map((data) => {
          this.articlesCiting = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            articlesCiting: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.articlesCiting = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            articlesCiting: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getPreferredAssembly(this.entryId()).pipe(
        map((data) => {
          this.complexDetails = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            complexDetails: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.complexDetails = [];
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            complexDetails: 'done', // update the specific key dynamically
          }));
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
              this.apiLoadedStatus.update((state) => ({
                ...state, // spread the existing state
                assemblies: 'done', // update the specific key dynamically
                pisaAssemblies: 'done', // update the specific key dynamically
              }));
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
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            assemblies: 'done', // update the specific key dynamically
            pisaAssemblies: 'done', // update the specific key dynamically
          }));
          return of({
            assemblies: [],
            pisaAssemblies: [],
          });
        })
      ),
      this.entryAPIService.getCarbohydrates(this.entryId()).pipe(
        map((data) => {
          this.carbohydrates = data;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            carbohydrates: 'done', // update the specific key dynamically
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.carbohydrates = [];
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            carbohydrates: 'done', // update the specific key dynamically
          }));
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
          uniprotData,
          interproMapping,
          pfamMapping,
          files,
          qualityScores,
          cathMapping,
          scopMapping,
          modifications,
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
