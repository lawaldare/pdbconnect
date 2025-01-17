import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { EntryApiService } from '../../services/entry-api.service';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { catchError, combineLatest, EMPTY, forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { AnyExperimentDetail } from '../../data-models/experimental-details.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { EntryDropdownComponent } from '../../components/entry-dropdown/entry-dropdown.component';
import { TabConfig } from '../../components/overview-molstar/state-management.service';
import { MainDataProcessingFacade } from './data-processing.facade';
import { ProteinSummaryStats } from '../../data-models/protein-summary-stats.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../../data-models/experiment-raw-data.model';
import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryMainAlternativeComponent } from '../../components/entry-main-alternative/entry-main-alternative.component';

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains';

// Some interesting entries:
// 4aqd carbs
// 6hr1 chimera protein from 4 different organisms (preferred assembly does not have all chains)
// 7v08 large em
// 3irj only carb
// 3l3t 4 assemblies
// 1trn interesting varying domain definitions, modifications

/**
 * TODO:
 * - Add status pages
 * - Make <SCRIPT> tags loading Dynamic
 */
@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    ClickOutsideDirective,
    MainInformationAreaComponent,
    OverviewMolstarComponent,
    InteractiveTablesComponent,
    DetailsDashboardComponent,
    ExperimentsValidationTabComponent,
    CitationsTabComponent,
    EntryDropdownComponent,
    NgxSkeletonLoaderModule,
    EntryMainAlternativeComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements AfterViewInit {
  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly allTabs = allTabs;
  public readonly tableTabs = tableTabs;

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'
  public showDownloadOptions = signal(false);
  public showViewOptions = signal(false);

  private route = inject(ActivatedRoute);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly entryAPIService = inject(EntryApiService);
  private _snackBar = inject(MatSnackBar);
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  private dataProcessing = inject(MainDataProcessingFacade);

  public currentTab = this.compCommunication.currentTab;
  public tabSwitchOrigin = this.compCommunication.tabSwitchOrigin;
  public previousTab = 'undefined';

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  // signal that holds whether an API call is pending or done for all needed APIs
  public apiLoadedStatus = signal(INITIAL_API_STATUS);

  // signals for residue listing information provided by Molstar inside OverviewMolstar component
  public molstarResidueInfoLoaded = this.compCommunication.molstarResidueInfoLoaded; // boolean
  public molstarResidueInfo = this.compCommunication.molstarResidueInfo; // residue listing

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

  // Use an effect to trigger side effects when componentLoadedStatus status for detailsDashboard changes to true
  // this happens when all API endpoints required information is loaded
  _loadRowsEffect = effect(
    () => {
      const status = this.componentLoadedStatus();
      if (status['detailsDashboard'] && this.compCommunication.isTabDataGenerated() === false && this.molstarResidueInfoLoaded()) {
        // Call processInteractiveTablesData only when 'detailsDashboard' is loaded and tab data not generated yet
        this.dataProcessing.processInteractiveTablesData(
          this.complexDetails,
          this.assemblies,
          this.pisaAssemblies,
          this.pfamMapping,
          this.cathMapping,
          this.scop175Mapping,
          this.boundLigands,
          this.modifications,
          this.carbohydrates,
          this.uniprotMapping,
          this.bestStructuresMappingsByUniProtIds,
          this.macroMolecules,
          this.molstarResidueInfo()
        );
      }
    },
    { allowSignalWrites: true }
  );

  // signal that computes whether interactive table tabs have any rows (data) to display
  public tabsInfo = computed(() => {
    const isTabDataGenerated = this.compCommunication.isTabDataGenerated();
    const tabsConfig: TabConfig[] = [];
    const tabsStatus: { [key: string]: string } = {};
    const tableTabsData = allTabs.filter((tab) => tableTabs.indexOf(tab.name) > -1);
    for (const tab of tableTabsData) {
      // an interactive table has data if the data has been loaded and the number of table rows is bigger than 0
      tabsStatus[tab.name] = isTabDataGenerated ? 'loaded' : 'loading';
      const dataExists = isTabDataGenerated ? this.compCommunication.getTabData(tab.name).tableRows().length > 0 : false;
      if (isTabDataGenerated) tabsStatus[tab.name] = dataExists ? 'has-data' : 'empty-data';

      const hasData = isTabDataGenerated && dataExists;
      tabsConfig.push({
        id: tab.name,
        displayName: tab.display,
        width: '229px',
        tagContent: hasData ? '' : 'N/A',
        tagClass: hasData ? 'no-chip' : 'na',
      });
    }
    tabsConfig.push({
      id: 'Experiments',
      displayName: 'Experiments and Validation',
      width: '229px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    tabsConfig.push({
      id: 'Citations',
      displayName: 'Citations',
      width: '96px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    return {
      config: tabsConfig,
      status: tabsStatus,
    };
  });

  // API data from getEntrySummary https://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/:entryID
  public summaryData!: ProcessedSummary;

  // API data from getEntryMolecules https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/:entryID
  public macroMolecules!: Molecule[];
  public boundLigands!: Molecule[];
  public organismScientificNames!: string[];
  public hasRna = false;

  // API data from getExperiment https://www.ebi.ac.uk/pdbe/api/pdb/entry/experiment/:entryID
  public experimentalDetails!: AnyExperimentDetail[];
  public experimentalMethod!: string;
  public resolutionValues!: Array<number | undefined>;

  // API data from getUniprotMapping https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/:entryID
  public uniprotMapping!: UniProtMapping;
  public uniprotCountsInPDBe!: { [key: string]: number };
  public bestStructuresMappingsByUniProtIds!: { [key: string]: BestStructureMapping[] };
  public proteinPagesSummaryByUniProtIds!: { [key: string]: ProteinSummaryStats };

  // API data from getInterproMapping https://www.ebi.ac.uk/pdbe/api/mappings/interpro/:entryID
  public interproMapping!: InterProMappings;

  // API data from getPDBEntryFiles https://www.ebi.ac.uk/pdbe/api/pdb/entry/files/:entryID
  public downloadOptions: DownloadOption[] = [];
  public viewOptions: DownloadOption[] = [];

  // API data from getPfamMapping https://www.ebi.ac.uk/pdbe/api/mappings/pfam/:entryID
  public pfamMapping!: PfamMappings;

  // API data from getSummaryQualityScores https://www.ebi.ac.uk/pdbe/api/validation/summary_quality_scores/entry/:entryID
  public summaryQualityScores?: ProcessedQualityScores;

  // API data from getPDBRedoData
  public pdbRedoQualityScore?: ProcessedQualityScores;

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

  // API data from getExperimentRawDataBMRB https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/:entryID
  public experimentRawDataBMRB?: BMRBExperimentRawData[];

  // API data from getExperimentRawDataSBGrid https://data.sbgrid.org/api/pdbe/:entryID
  public experimentRawDataSBGrid?: SBGRIDExperimentRawData;

  // API data from getExperimentRawDataIRRMC https://proteindiffraction.org/api/ebi/:entryID
  public experimentRawDataIRRMC?: IRRMCExperimentRawData;

  // API data from getExperimentRawDataEMPIAR https://www.ebi.ac.uk/empiar/api/pdb_ref/:entryID
  public experimentRawDataEMPIAR?: EMPIARExperimentRawData[];

  // API data from getExperimentRawDataPDB https://www.ebi.ac.uk/pdbe/api/pdb/entry/related_experiment_data/:entryID
  public experimentRawDataPDB?: PDBExperimentRawData[];

  public statusCode = signal<StatusCode>('INITIAL');
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  constructor() {
    effect(async () => {
      // Access the current state
      const tabState = this.compCommunication.tabState();

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

  async ngAfterViewInit() {
    this.previousTab = `${this.currentTab()}`;

    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.entryId.set(entryId);
          return this.entryAPIService.getEntryStatus(entryId).pipe(
            tap((status: EntryStatus) => this.entryStatus.set({ ...status, entryId })),
            map((response: EntryStatus) => response.status_code)
          );
        }),
        mergeMap((statusCode: StatusCode) => {
          console.log('statusCode', statusCode);
          this.statusCode.set(statusCode);
          if (statusCode === 'REL') {
            setTimeout(() => {
              this.molstarVisualisation.renderMolstarInitial(this.entryId(), this.molstarViewer.nativeElement);
            });
            return this.setPageData();
          } else {
            this.statusCode.set(statusCode);
            return EMPTY;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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

          // const boundLigandsEntries = boundLigands.map((boundLigand) =>
          //   this.ligandAggAPIService.fetchBoundEntries(boundLigand.chem_comp_ids[0]).pipe(
          //     map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
          //   )
          // );
          // const boundLigandsInteractions = boundLigands.map((boundLigand) =>
          //   this.ligandAggAPIService.fetchIntxData(boundLigand.chem_comp_ids[0]).pipe(
          //     map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
          //   )
          // );
          // const boundLigandsRelated = boundLigands.map((boundLigand) =>
          //   this.ligandAggAPIService.getRelatedLigands(boundLigand.chem_comp_ids[0]).pipe(
          //     map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
          //   )
          // );

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

          const hasRna = molecules.filter((mol) => mol.molecule_type.includes('polyribonucleotide')).length > 0;

          this.macroMolecules = macroMolecules;
          this.boundLigands = boundLigands;
          this.organismScientificNames = organismNames;
          this.hasRna = hasRna;

          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            macroMolecules: 'done', // update the specific key dynamically
            boundLigands: 'done', // update the specific key dynamically
            organismScientificNames: 'done', // update the specific key dynamically
            hasRna: 'done',
          }));

          return {
            macroMolecules: macroMolecules,
            boundLigands: boundLigands,
            organismScientificNames: organismNames,
          };
        })
      ),
      // this.entryAPIService.getEntryMolecules(this.entryId()).pipe(
      //   mergeMap((data) => {
      //     const molecules = data[this.entryId()];

      //     const macromoleculeSortedTypesArray = [
      //       'polypeptide(L)',
      //       'polypeptide(R)',
      //       'carbohydrate polymer',
      //       'polyribonucleotide',
      //       'polydeoxyribonucleotide',
      //       'polydeoxyribonucleotide/polyribonucleotide hybrid',
      //     ];

      //     const macroMolecules = molecules
      //       .filter((mol) => macromoleculeSortedTypesArray.indexOf(mol.molecule_type) > -1)
      //       .sort((a, b) => macromoleculeSortedTypesArray.indexOf(a.molecule_type) - macromoleculeSortedTypesArray.indexOf(b.molecule_type));

      //     const boundLigands = molecules.filter((mol) => mol.molecule_type === 'bound');

      //     const boundLigandsEntries = boundLigands.map((boundLigand) =>
      //       this.ligandAggAPIService.fetchBoundEntries(boundLigand.chem_comp_ids[0]).pipe(
      //         map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
      //       )
      //     );
      //     const boundLigandsInteractions = boundLigands.map((boundLigand) =>
      //       this.ligandAggAPIService.fetchIntxData(boundLigand.chem_comp_ids[0]).pipe(
      //         map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
      //       )
      //     );
      //     const boundLigandsRelated = boundLigands.map((boundLigand) =>
      //       this.ligandAggAPIService.getRelatedLigands(boundLigand.chem_comp_ids[0]).pipe(
      //         map((result) => ({ [boundLigand.chem_comp_ids[0]]: result })) // Wrap each result in an object with uniprotId as key
      //       )
      //     );

      //     const organismNames: string[] = [];

      //     // See: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/1trn
      //     // and a more different example at: https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/6hr1
      //     for (const entityDetail of molecules) {
      //       const sources = entityDetail['source'] ?? [];
      //       for (const eachSource of sources) {
      //         const organismName = eachSource['organism_scientific_name'] ?? undefined;
      //         if (organismName && organismNames.indexOf(organismName) === -1) {
      //           organismNames.push(organismName);
      //         }
      //       }
      //     }

      //     // Use forkJoin to wait for all observables to complete
      //     return forkJoin({
      //       boundLigandsEntries: forkJoin(boundLigandsEntries),
      //       boundLigandsInteractions: forkJoin(boundLigandsInteractions),
      //       boundLigandsRelated: forkJoin(boundLigandsRelated),
      //     }).pipe(
      //       map(({ boundLigandsEntries, boundLigandsInteractions, boundLigandsRelated }) => {

      //           this.macroMolecules = macroMolecules;
      //           this.boundLigands = boundLigands;
      //           this.organismScientificNames = organismNames;

      //           this.apiLoadedStatus.update((state) => ({
      //             ...state, // spread the existing state
      //             macroMolecules: 'done', // update the specific key dynamically
      //             boundLigands: 'done', // update the specific key dynamically
      //             organismScientificNames: 'done', // update the specific key dynamically
      //           }));

      //           console.log("boundLigands")
      //           console.log(boundLigands)
      //           console.log("boundLigandsEntries")
      //           console.log(boundLigandsEntries)
      //           console.log("boundLigandsInteractions")
      //           console.log(boundLigandsInteractions)
      //           console.log("boundLigandsRelated")
      //           console.log(boundLigandsRelated)

      //           return {
      //             macroMolecules: macroMolecules,
      //             boundLigands: boundLigands,
      //             organismScientificNames: organismNames,
      //             boundLigandsEntries: boundLigandsEntries,
      //             boundLigandsInteractions: boundLigandsInteractions,
      //             boundLigandsRelated: boundLigandsRelated
      //           };
      //       })
      //     )
      //   })
      // ),
      this.entryAPIService.getExperiment(this.entryId()).pipe(
        map((response) => {
          this.experimentalDetails = response;

          const experimentalMethodTitle = response.length > 1 ? 'Hybrid' : (response[0].experimental_method as string);
          const resolutionValues: Array<number | undefined> = response.map((datum: AnyExperimentDetail) => {
            if ('resolution' in datum && datum['resolution']) return datum['resolution'];
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
          // For each UniProt id we create observables for bestStructures and proteinPagesSummary
          const uniprotIds = Object.keys(data);
          const bestStructuresObservables = uniprotIds.map((uniprotId) =>
            this.entryAPIService.getBestStructures(uniprotId).pipe(
              map((result) => ({ [uniprotId]: result })) // Wrap each result in an object with uniprotId as key
            )
          );

          const proteinPagesSummaryObservables = uniprotIds.map((uniprotId) =>
            this.entryAPIService.getProteinPagesSummaryStats(uniprotId).pipe(
              map((result) => ({ [uniprotId]: result })) // Wrap each result in an object with uniprotId as key
            )
          );

          // Use forkJoin to wait for all observables to complete
          return forkJoin({
            bestStructures: forkJoin(bestStructuresObservables),
            proteinPagesSummary: forkJoin(proteinPagesSummaryObservables),
          }).pipe(
            map(({ bestStructures, proteinPagesSummary }) => {
              // Combine results into dictionaries
              const bestStructuresMappingsByUniProtIds: { [key: string]: BestStructureMapping[] } = {};
              const uniprotCountsInPDBe: { [key: string]: number } = {};
              const proteinPagesSummaryByUniProtIds: { [key: string]: ProteinSummaryStats } = {};

              // Process bestStructures results
              for (const uniprotDict of bestStructures) {
                const uniprotId = Object.keys(uniprotDict)[0];
                const bestStructureDict = uniprotDict[uniprotId] as unknown as BestStructureDict;
                const uniprotData = bestStructureDict[uniprotId];

                // Update uniprotCountsInPDBe with counts of unique PDB ids
                const uniquePDBIds = uniprotData.map((datum) => datum.pdb_id).filter((value, index, array) => array.indexOf(value) === index);
                uniprotCountsInPDBe[uniprotId] = uniquePDBIds.length;

                // Update bestStructuresMappingsByUniProtIds with filtered data
                const uniprotDataFiltered = bestStructureDict[uniprotId].filter((datum) => datum.pdb_id === this.entryId());
                bestStructuresMappingsByUniProtIds[uniprotId] = bestStructuresMappingsByUniProtIds[uniprotId] ?? [];
                bestStructuresMappingsByUniProtIds[uniprotId].push(...uniprotDataFiltered);
              }

              // Process proteinPagesSummary results
              for (const summaryDict of proteinPagesSummary as { [key: string]: ProteinSummaryStats }[]) {
                const uniprotId = Object.keys(summaryDict)[0];
                proteinPagesSummaryByUniProtIds[uniprotId] = summaryDict[uniprotId];
              }

              // Update component properties
              this.uniprotMapping = data;
              this.uniprotCountsInPDBe = uniprotCountsInPDBe;
              this.bestStructuresMappingsByUniProtIds = bestStructuresMappingsByUniProtIds;
              this.proteinPagesSummaryByUniProtIds = proteinPagesSummaryByUniProtIds;

              this.apiLoadedStatus.update((state) => ({
                ...state,
                uniprotMapping: 'done',
                uniprotCountsInPDBe: 'done',
                bestStructuresMappingsByUniProtIds: 'done',
                proteinPagesSummaryByUniProtIds: 'done',
              }));

              return {
                uniprotMapping: data,
                uniprotCountsInPDBe,
                bestStructuresMappingsByUniProtIds,
                proteinPagesSummaryByUniProtIds,
              };
            })
          );
        }), // TODO: Improve error handling when some observables contain data and others not. Needed for some pages like: 3irj
        catchError((_error: HttpErrorResponse) => {
          this.uniprotMapping = {};
          this.uniprotCountsInPDBe = {};
          this.bestStructuresMappingsByUniProtIds = {};

          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            uniprotMapping: 'done', // update the specific key dynamically
            uniprotCountsInPDBe: 'done', // update the specific key dynamically
            bestStructuresMappingsByUniProtIds: 'done', // update the specific key dynamically
            proteinPagesSummaryByUniProtIds: 'done',
          }));

          return of({
            uniprotMapping: {},
            uniprotCountsInPDBe: {},
            bestStructuresMappingsByUniProtIds: {},
            proteinPagesSummaryByUniProtIds: {},
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
          this.downloadOptions = this.dataProcessing.processFilesData(data).downloads;
          this.viewOptions = this.dataProcessing.processFilesData(data).views;
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
      this.entryAPIService.getPDBRedoData(this.entryId()).pipe(
        map((data) => {
          this.pdbRedoQualityScore = data;
          this.apiLoadedStatus.update((state) => ({
            ...state,
            pdbRedoQualityScore: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.pdbRedoQualityScore = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            pdbRedoQualityScore: 'done', // update the specific key dynamically
          }));
          return of({});
        })
      ),
      this.entryAPIService.getExperimentRawDataBMRB(this.entryId()).pipe(
        map((data) => {
          this.experimentRawDataBMRB = data as BMRBExperimentRawData[];
          this.apiLoadedStatus.update((state) => ({
            ...state,
            experimentRawDataBMRB: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.experimentRawDataBMRB = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentRawDataBMRB: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getExperimentRawDataSBGrid(this.entryId()).pipe(
        map((data) => {
          this.experimentRawDataSBGrid = data as SBGRIDExperimentRawData;
          this.apiLoadedStatus.update((state) => ({
            ...state,
            experimentRawDataSBGrid: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.experimentRawDataSBGrid = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentRawDataSBGrid: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getExperimentRawDataIRRMC(this.entryId()).pipe(
        map((data) => {
          this.experimentRawDataIRRMC = data;
          this.apiLoadedStatus.update((state) => ({
            ...state,
            experimentRawDataIRRMC: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.experimentRawDataIRRMC = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentRawDataIRRMC: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getExperimentRawDataEMPIAR(this.entryId()).pipe(
        map((data) => {
          this.experimentRawDataEMPIAR = data as EMPIARExperimentRawData[];
          this.apiLoadedStatus.update((state) => ({
            ...state,
            experimentRawDataEMPIAR: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.experimentRawDataEMPIAR = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentRawDataEMPIAR: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
      this.entryAPIService.getExperimentRawDataPDB(this.entryId()).pipe(
        map((data) => {
          this.experimentRawDataPDB = data as PDBExperimentRawData[];
          this.apiLoadedStatus.update((state) => ({
            ...state,
            experimentRawDataPDB: 'done',
          }));
          return data;
        }),
        catchError((_error: HttpErrorResponse) => {
          this.experimentRawDataEMPIAR = undefined;
          this.apiLoadedStatus.update((state) => ({
            ...state, // spread the existing state
            experimentRawDataPDB: 'done', // update the specific key dynamically
          }));
          return of(undefined);
        })
      ),
    ]);
  }

  public changeCurrentTab(tabName: string) {
    this.previousTab = `${tabName}`;
    this.tabSwitchOrigin.set('main');
    this.currentTab.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
  }

  // private processFilesData(data: any) {
  //   const order = ['Archive mmCIF file', 'Updated mmCIF file', 'PDB file', 'Compatible PDB file bundle (tar.gz)', 'FASTA (Entry)', 'Full report (PDF)'];

  //   let downloads: any[] = [];
  //   let views: any[] = [];

  //   Object.keys(data).forEach((key) => {
  //     if (data[key].downloads) {
  //       downloads = downloads.concat(data[key].downloads);
  //     }
  //     if (data[key].views) {
  //       views = views.concat(data[key].views);
  //     }
  //   });

  //   downloads.sort((a, b) => {
  //     const indexA = order.indexOf(a.label);
  //     const indexB = order.indexOf(b.label);

  //     if (indexA === -1 && indexB === -1) {
  //       return 0;
  //     } else if (indexA === -1) {
  //       return 1;
  //     } else if (indexB === -1) {
  //       return -1;
  //     } else {
  //       return indexA - indexB;
  //     }
  //   });

  //   views.sort((a, b) => {
  //     const indexA = order.indexOf(a.label);
  //     const indexB = order.indexOf(b.label);

  //     if (indexA === -1 && indexB === -1) {
  //       return 0;
  //     } else if (indexA === -1) {
  //       return 1;
  //     } else if (indexB === -1) {
  //       return -1;
  //     } else {
  //       return indexA - indexB;
  //     }
  //   });

  //   const downloadsUpdated = downloads.map((d) => {
  //     return {
  //       name: d.label,
  //       url: d.url,
  //       downloadable: true,
  //     };
  //   });

  //   const viewsUpdated = views.map((d) => {
  //     return {
  //       name: d.label,
  //       url: d.url,
  //       downloadable: false,
  //     };
  //   });

  //   return { downloads: downloadsUpdated, views: viewsUpdated };
  // }

  public onClickedOutside() {
    this.showViewOptions.set(false);
    this.showDownloadOptions.set(false);
  }
}
