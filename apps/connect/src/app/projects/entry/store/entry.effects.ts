import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EntryStoreState, UniProtMappingData } from './entry-store.model';
import { EntryActions } from './entry.actions';
import { catchError, filter, forkJoin, map, mergeMap, of, switchMap, take } from 'rxjs';
import { EntryApiService } from '../services/entry-api.service';
import { EntrySelectors } from './entry.selectors';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { UniProtMapping } from '../data-models/uniprot-mapping.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { MainDataProcessingFacade } from '../pages/main/data-processing.facade';
import { CitationDetail } from '../data-models/publication.model';
import { IRRMCExperimentRawData } from '../data-models/experiment-raw-data.model';
import { PvDataApiService } from '../services/entry-pv-nightingale-api.service';
import { EntryUtilService } from '../services/entry-util.service';

@Injectable()
export class EntryEffects {
  private readonly entryAPIService = inject(EntryApiService);
  private readonly protvistaAPIService = inject(PvDataApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<EntryStoreState>);
  private dataProcessing = inject(MainDataProcessingFacade);
  private readonly entryUtilService = inject(EntryUtilService);

  getSummaryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSummaryData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntrySummary(entryId).pipe(
          map((summaryData) => EntryActions.getSummaryDataSuccess({ summaryData })),
          catchError(() => of(EntryActions.getSummaryDataFailure()))
        )
      )
    )
  );

  getInterproMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getInterproMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getInterproMapping(entryId).pipe(
          map((interproMapping) => EntryActions.getInterproMappingSuccess({ interproMapping })),
          catchError(() => of(EntryActions.getInterproMappingFailure()))
        )
      )
    )
  );

  getIsoformsMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getIsoformsMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getIsoformsMapping(entryId).pipe(
          map((isoformsMapping) => EntryActions.getIsoformsMappingSuccess({ isoformsMapping })),
          catchError(() => of(EntryActions.getIsoformsMappingFailure()))
        )
      )
    )
  );

  getLLMAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getLLMAnnotations),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getLLMAnnotations(entryId).pipe(
          map((llmAnnotations) => EntryActions.getLLMAnnotationsSuccess({ llmAnnotations })),
          catchError(() => of(EntryActions.getLLMAnnotationsFailure()))
        )
      )
    )
  );

  getGOMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getGOMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getGOMapping(entryId).pipe(
          map((goMapping) => EntryActions.getGOMappingSuccess({ goMapping })),
          catchError(() => of(EntryActions.getGOMappingFailure()))
        )
      )
    )
  );

  getSymmetry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSymmetry),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSymmetry(entryId).pipe(
          map((symmetry) => EntryActions.getSymmetrySuccess({ symmetry })),
          catchError(() => of(EntryActions.getSymmetryFailure()))
        )
      )
    )
  );

  getECMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getECMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getECMapping(entryId).pipe(
          map((ecMapping) => EntryActions.getECMappingSuccess({ ecMapping })),
          catchError(() => of(EntryActions.getECMappingFailure()))
        )
      )
    )
  );

  getInteractions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getInteractions),
      switchMap((action) =>
        this.store.select(EntrySelectors.interactions).pipe(
          // select entire interactions object
          take(1),
          map((interactions) => {
            const cached = interactions?.[action.chainId]?.[action.residueId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached && cached.length > 0) {
          // Return success action with cached value
          return of(
            EntryActions.getInteractionsSuccess({
              chainId: action.chainId,
              residueId: action.residueId,
              interactions: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.entryAPIService.getEntryInteractions(entryId, action.chainId, action.residueId).pipe(
              map((data) =>
                EntryActions.getInteractionsSuccess({
                  chainId: action.chainId,
                  residueId: action.residueId,
                  interactions: data.interactions,
                })
              ),
              catchError(() => of(EntryActions.getInteractionsFailure()))
            )
          )
        );
      })
    )
  );

  getResidueListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getResidueListing),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.entryAPIService.getResiduesForChain(entryId, action.chainId).pipe(
          map((data) => EntryActions.getResidueListingSuccess({ residueListing: data })),
          catchError(() => of(EntryActions.getResidueListingFailure()))
        )
      )
    )
  );

  getPfamMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPfamMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPfamMapping(entryId).pipe(
          map((pfamMapping) => EntryActions.getPfamMappingSuccess({ pfamMapping })),
          catchError(() => of(EntryActions.getPfamMappingFailure()))
        )
      )
    )
  );

  getSCOP175Mapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getScop175Mapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSCOP175Mapping(entryId).pipe(
          map((scop175Mapping) => EntryActions.getScop175MappingSuccess({ scop175Mapping })),
          catchError(() => of(EntryActions.getScop175MappingFailure()))
        )
      )
    )
  );

  getModifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getModifications),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getModifications(entryId).pipe(
          map((modifications) => EntryActions.getModificationsSuccess({ modifications })),
          catchError(() => of(EntryActions.getModificationsFailure()))
        )
      )
    )
  );

  getValidationKeyStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getValidationKeyStats),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getValidationKeyStats(entryId).pipe(
          map((validationKeyStats) => EntryActions.getValidationKeyStatsSuccess({ validationKeyStats })),
          catchError(() => of(EntryActions.getValidationKeyStatsFailure()))
        )
      )
    )
  );

  getModelQualityXray$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getModelQualityXray),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getModelQualityXray(entryId).pipe(
          map((modelQualityXray) => EntryActions.getModelQualityXraySuccess({ modelQualityXray })),
          catchError(() => of(EntryActions.getModelQualityXrayFailure()))
        )
      )
    )
  );

  getCathMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCathMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getCATHMapping(entryId).pipe(
          map((cathMapping) => EntryActions.getCathMappingSuccess({ cathMapping })),
          catchError(() => of(EntryActions.getCathMappingFailure()))
        )
      )
    )
  );

  getSummaryQualityScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSummaryQualityScores),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSummaryQualityScores(entryId).pipe(
          map((summaryQualityScores) => EntryActions.getSummaryQualityScoresSuccess({ summaryQualityScores })),
          catchError(() => of(EntryActions.getSummaryQualityScoresFailure()))
        )
      )
    )
  );

  getPDBRedoQualityScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPDBRedoQualityScores),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPDBRedoData(entryId).pipe(
          map((pdbRedoQualityScore) => EntryActions.getPDBRedoQualityScoresSuccess({ pdbRedoQualityScore })),
          catchError(() => of(EntryActions.getPDBRedoQualityScoresFailure()))
        )
      )
    )
  );

  getDownloadOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getDownloadOptions),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPDBEntryFiles(entryId).pipe(
          map((data) => {
            const downloadOptions = this.dataProcessing.processFilesData(data).downloads;
            const viewOptions = this.dataProcessing.processFilesData(data).views;
            return EntryActions.getDownloadOptionsSuccess({ data: { downloadOptions, viewOptions } });
          }),
          catchError(() => of(EntryActions.getDownloadOptionsFailure()))
        )
      )
    )
  );

  getEntryMolecules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryMolecules),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryMolecules(entryId).pipe(
          map((data) => {
            const molecules = data[entryId];

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

            const organismScientificNames: string[] = [];

            for (const entityDetail of molecules) {
              const sources = entityDetail['source'] ?? [];
              for (const eachSource of sources) {
                const organismName = eachSource['organism_scientific_name'] ?? undefined;
                if (organismName && organismScientificNames.indexOf(organismName) === -1) {
                  organismScientificNames.push(organismName);
                }
              }
            }

            const hasRNA = molecules.filter((mol) => mol.molecule_type.includes('polyribonucleotide')).length > 0;
            return EntryActions.getEntryMoleculesSuccess({ data: { macroMolecules, boundLigands, organismScientificNames, hasRNA } });
          }),
          catchError(() => of(EntryActions.getEntryMoleculesFailure()))
        )
      )
    )
  );

  getExperiment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperiment),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperiment(entryId).pipe(
          map((response: any) => {
            const experimentalDetails = response;

            const experimentalMethod = response.length > 1 ? 'Hybrid' : (response[0].experimental_method as string);
            const resolutionValues: Array<number | undefined> = response.map((datum: AnyExperimentDetail) => {
              if ('resolution' in datum && datum['resolution']) return datum['resolution'];
              else return undefined;
            });

            return EntryActions.getExperimentSuccess({ data: { experimentalDetails, resolutionValues, experimentalMethod } });
          }),
          catchError(() => of(EntryActions.getExperimentFailure()))
        )
      )
    )
  );

  getUniProtMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getUniprotMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getUniprotMapping(entryId).pipe(
          map((data) => EntryActions.getUniprotMappingSuccess({ uniprotMapping: data })),
          catchError(() => of(EntryActions.getUniprotMappingFailure()))
        )
      )
    )
  );

  getUniProtSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getUniprotSummary),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, _entryId]) =>
        this.entryAPIService.getProteinPagesSummaryStats(action.uniprotId).pipe(
          map((data) => EntryActions.getUniprotSummarySuccess({ unpSummaryData: data })),
          catchError(() => of(EntryActions.getUniprotSummaryFailure()))
        )
      )
    )
  );

  getValidationXRayRefine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getValidationXrayRefine),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getValidationXRayRefine(entryId).pipe(
          map((validationXRayRefine) => EntryActions.getValidationXrayRefineSuccess({ validationXRayRefine })),
          catchError(() => of(EntryActions.getValidationXrayRefineFailure()))
        )
      )
    )
  );

  getPrimaryPublication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPrimaryPublication),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPrimaryPublicationAbstract(entryId).pipe(
          map((primaryPublication) => EntryActions.getPrimaryPublicationSuccess({ primaryPublication })),
          catchError(() => {
            EntryActions.getPrimaryPublicationSuccess({ primaryPublication: {} as CitationDetail });
            return of(EntryActions.getPrimaryPublicationFailure());
          })
        )
      )
    )
  );

  getArticleCitingPDBEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getArticleCitingPDBEntry),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getArticleCitingPDBEntry(entryId).pipe(
          map((articlesCiting) => EntryActions.getArticleCitingPDBEntrySuccess({ articlesCiting })),
          catchError(() => of(EntryActions.getArticleCitingPDBEntryFailure()))
        )
      )
    )
  );

  getPreferredAssembly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPreferredAssembly),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPreferredAssembly(entryId).pipe(
          map((complexDetails) => EntryActions.getPreferredAssemblySuccess({ complexDetails })),
          catchError(() => {
            EntryActions.getPreferredAssemblySuccess({ complexDetails: [] });
            return of(EntryActions.getPreferredAssemblyFailure());
          })
        )
      )
    )
  );

  getAssemblies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getAssemblies),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getAssembly(entryId).pipe(
          mergeMap((data) => {
            const pisaAssemblyObservables = data
              .sort((a, b) => parseInt(a.assembly_id) - parseInt(b.assembly_id))
              .map((assemblyDatum) => this.entryAPIService.getPisaAssembly(entryId, assemblyDatum.assembly_id));

            return forkJoin(pisaAssemblyObservables).pipe(
              map((pisaAssembly) => {
                const assemblies = data;
                const pisaAssemblies = pisaAssembly;
                return EntryActions.getAssembliesSuccess({ data: { assemblies, pisaAssemblies } });
              }),
              catchError(() => of(EntryActions.getAssembliesFailure()))
            );
          })
        )
      )
    )
  );

  getCarbohydrates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCarbohydrates),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getCarbohydrates(entryId).pipe(
          map((carbohydrates) => EntryActions.getCarbohydratesSuccess({ carbohydrates })),
          catchError(() => of(EntryActions.getCarbohydratesFailure()))
        )
      )
    )
  );

  getExperimentRawDataBMRB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentBMRBRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataBMRB(entryId).pipe(
          map((experimentRawDataBMRB) => EntryActions.getExperimentBMRBRawDataSuccess({ experimentRawDataBMRB })),
          catchError(() => of(EntryActions.getExperimentBMRBRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataSBGrid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentSBGridRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataSBGrid(entryId).pipe(
          map((experimentRawDataSBGrid) => EntryActions.getExperimentSBGridRawDataSuccess({ experimentRawDataSBGrid })),
          catchError(() => of(EntryActions.getExperimentSBGridRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataIRRMC$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentIRRMCRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataIRRMC(entryId).pipe(
          map((experimentRawDataIRRMC) => {
            const data = experimentRawDataIRRMC === null ? ({} as IRRMCExperimentRawData) : experimentRawDataIRRMC;
            return EntryActions.getExperimentIRRMCRawDataSuccess({ experimentRawDataIRRMC: data });
          }),
          catchError(() => of(EntryActions.getExperimentIRRMCRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataEMPIAR$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentEMPIARRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataEMPIAR(entryId).pipe(
          map((experimentRawDataEMPIAR) => EntryActions.getExperimentEMPIARRawDataSuccess({ experimentRawDataEMPIAR })),
          catchError(() => of(EntryActions.getExperimentEMPIARRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataPDB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentPDBRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataPDB(entryId).pipe(
          map((experimentRawDataPDB) => EntryActions.getExperimentPDBRawDataSuccess({ experimentRawDataPDB })),
          catchError(() => of(EntryActions.getExperimentPDBRawDataFailure()))
        )
      )
    )
  );

  getEntryStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryStatus),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(filter(Boolean), take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryStatus(entryId).pipe(
          map((entryStatus) => EntryActions.getEntryStatusSuccess({ entryStatus })),
          catchError((error) => {
            console.error('Error fetching entry status:', error);
            this.entryUtilService.setError(error.status);
            this.entryUtilService.setEntryStatus('ERROR');
            return of(EntryActions.getEntryStatusFailure());
          })
        )
      )
    )
  );

  getPolymerCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryPolymerCoverage),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPolymerCoverage(entryId).pipe(
          map((polymerCoverage) => EntryActions.getEntryPolymerCoverageSuccess({ polymerCoverage })),
          catchError(() => of(EntryActions.getEntryPolymerCoverageFailure()))
        )
      )
    )
  );

  getLigandMonomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryLigandMonomers),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getLigandMonomers(entryId).pipe(
          map((ligandMonomers) => EntryActions.getEntryLigandMonomersSuccess({ ligandMonomers })),
          catchError(() => of(EntryActions.getEntryLigandMonomersFailure()))
        )
      )
    )
  );

  getResidueWiseOutliers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryResidueWiseOutliers),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getResidueWiseOutliers(entryId).pipe(
          map((residueWiseOutliers) => EntryActions.getEntryResidueWiseOutliersSuccess({ residueWiseOutliers })),
          catchError(() => of(EntryActions.getEntryResidueWiseOutliersFailure()))
        )
      )
    )
  );

  getEntryProtvistaUniprotMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaUniprotMapping),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityUniprotMappingTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaUniprotMappingSuccess({ entityPvUniprot: data })),
          catchError(() => of(EntryActions.getEntryProtvistaUniprotMappingFailure()))
        )
      )
    )
  );

  getEntryProtvistaChains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaChains),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityChainsTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaChainsSuccess({ entityPvChains: data })),
          catchError(() => of(EntryActions.getEntryProtvistaChainsFailure()))
        )
      )
    )
  );

  getEntryProtvistaDomains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaDomains),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityDomainsTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaDomainsSuccess({ entityPvDomains: data })),
          catchError(() => of(EntryActions.getEntryProtvistaDomainsFailure()))
        )
      )
    )
  );

  getEntryProtvistaRfam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaRfam),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityRfamTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaRfamSuccess({ entityPvRfam: data })),
          catchError(() => of(EntryActions.getEntryProtvistaRfamFailure()))
        )
      )
    )
  );

  getEntryProtvistaSecondaryStructure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaSecondaryStructure),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntitySecondaryStructureTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaSecondaryStructureSuccess({ entityPvSecondaryStructure: data })),
          catchError(() => of(EntryActions.getEntryProtvistaSecondaryStructureFailure()))
        )
      )
    )
  );

  getEntryProtvistaBindingSites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaBindingSites),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityBindingSitesTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaBindingSitesSuccess({ entityPvBindingSites: data })),
          catchError(() => of(EntryActions.getEntryProtvistaBindingSitesFailure()))
        )
      )
    )
  );

  getEntryProtvistaInterfaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaInterfaces),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityInterfacesTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaInterfacesSuccess({ entityPvInterfaces: data })),
          catchError(() => of(EntryActions.getEntryProtvistaInterfacesFailure()))
        )
      )
    )
  );

  getEntryProtvistaAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaAnnotations),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeEntityAnnotationsTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaAnnotationsSuccess({ entityPvAnnotations: data })),
          catchError(() => of(EntryActions.getEntryProtvistaAnnotationsFailure()))
        )
      )
    )
  );

  getEntryProtvistaConservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaConservation),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeConservationTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaConservationSuccess({ entityPvConservation: data })),
          catchError(() => of(EntryActions.getEntryProtvistaConservationFailure()))
        )
      )
    )
  );

  getEntryProtvistaVariation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaVariation),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.protvistaAPIService.getPdbeVariationTrackData(entryId, action.entityId).pipe(
          map((data) => EntryActions.getEntryProtvistaVariationSuccess({ entityPvVariation: data })),
          catchError(() => of(EntryActions.getEntryProtvistaVariationFailure()))
        )
      )
    )
  );
}
