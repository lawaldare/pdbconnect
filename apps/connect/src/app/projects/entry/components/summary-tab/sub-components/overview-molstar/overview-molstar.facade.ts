/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { combineLatest, filter, firstValueFrom, forkJoin, map } from 'rxjs';
import { Molecule } from '../../../../data-models/molecule.model';
import { MolstarResidueInfo, MolstarSelectionObj } from '../../../../helpers/molstar/molstar-helpers';
import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import { ComplexDetails } from '../../../../data-models/complex-details.model';
import { calculateAssemblyComposition } from '../../../../helpers/assembly-helpers';
import { CathMappings, DomainMapping, PfamMappings, ScopMappings } from '../../../../data-models/domains.model';
import { EntryApiService } from '../../../../services/entry-api.service';
import { formatSegments } from '../../../../helpers/domain-helpers';
import { CitationDetail } from '../../../../data-models/publication.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { UtilService } from '@pdbc/core';

type ParsedComplexDetails = {
  name: string | null | undefined;
  preferred: number | null | undefined;
  composition: string | null | undefined;
  complexId: string | null | undefined;
};

interface MolstarNamedSelections {
  name: string;
  selection: MolstarSelectionObj;
}

export interface ListSelectable {
  id: string;
  name: string;
  colors: string[];
  // TODO: molstarGalleryImg and molstarNamedSelections to be replaced by MolViewSpec objects in the future
  molstarGalleryImg: string;
  molstarNamedSelections: MolstarNamedSelections[];
}

export interface NestedListSelectable {
  parentId: string; // same as key
  parentName: string;
  parentColor: string;
  nestedSelectables: ListSelectable[];
}

export interface DataForListViews {
  // ListSelectable for macromolecules, ligands, modifications, dict of NestedListSelectable for domains
  [key: string]: ListSelectable[] | { [key: string]: NestedListSelectable[] };
}

@Injectable({
  providedIn: 'root',
})
export class OverviewMolstarFacade {
  private readonly entryAPIService = inject(EntryApiService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly util = inject(UtilService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly inputModifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));

  public relatedEntries: WritableSignal<string[]> = signal([]);

  public assemblyData: WritableSignal<ParsedComplexDetails> = signal({
    name: undefined,
    preferred: undefined,
    composition: undefined,
    complexId: undefined,
  });

  public colorsFromMolj: WritableSignal<{ [key: string | number]: string }> = signal({});

  public macromoleculesDescription: WritableSignal<string> = signal('');
  public entryContentsDescription: WritableSignal<string[]> = signal([]);
  public listViewSelectablesByTab: WritableSignal<DataForListViews> = signal({});

  public numLigands = signal(0);
  public numModifications = signal(0);
  public domainCountByResource: WritableSignal<{ [key: string]: number }> = signal({
    CATH: 0,
    Pfam: 0,
    SCOP: 0,
  });

  public dataParsed = signal(false);

  public macromoleculesOverviewData = signal<ListSelectable[]>([]);
  public ligandsOverviewData = signal<ListSelectable[]>([]);
  public modificationsOverviewData = signal<ListSelectable[]>([]);
  public domainsOverviewData = signal<{
    [key: string]: NestedListSelectable[];
  }>({});

  public readonly descriptions = computed(() => {
    let moleculeTypeConditions = [
      {
        moleculeTypes: ['polypeptide(L)', 'polypeptide(R)'],
        moleculeDescriptionSuffix: 'unique protein',
        entryContentsDescriptionSuffix: 'distinct polypeptide',
      },
      {
        moleculeTypes: ['polydeoxyribonucleotide'],
        moleculeDescriptionSuffix: 'DNA',
        entryContentsDescriptionSuffix: 'distinct DNA',
      },
      {
        moleculeTypes: ['polyribonucleotide'],
        moleculeDescriptionSuffix: 'RNA',
        entryContentsDescriptionSuffix: 'distinct RNA',
      },
      {
        moleculeTypes: ['polydeoxyribonucleotide/polyribonucleotide hybrid'],
        moleculeDescriptionSuffix: 'DNA/RNA hybrid',
        entryContentsDescriptionSuffix: 'distinct DNA/RNA hybrid',
      },
      {
        moleculeTypes: ['carbohydrate polymer'],
        moleculeDescriptionSuffix: 'carbohydrate',
        entryContentsDescriptionSuffix: 'distinct carbohydrate polymer',
      },
    ];

    moleculeTypeConditions = moleculeTypeConditions.filter((condition) => {
      const macromoleculesForCondition = (this.macromolecules() ?? []).filter((mol) => condition.moleculeTypes.indexOf(mol.molecule_type) > -1);
      return macromoleculesForCondition.length > 0;
    });

    let totalMolecules = 0;
    let macromoleculesDescription = '';
    const entryContentsDescription: string[] = [];

    // for each macromolecule type (protein, dna, rna, dna/rna hybrid, carbohydrate)
    for (let i = 0; i < moleculeTypeConditions.length; i++) {
      const moleculeTypeCondition = moleculeTypeConditions[i];
      // filter the complete macromolecule list by the type
      const filteredMacromolecules = (this.macromolecules() ?? []).filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);

      // add comma if this is between second and penultimate item
      if (i > 0 && i < moleculeTypeConditions.length - 1) macromoleculesDescription += ', ';

      // add 'and' if more than one item and this is last item
      if (i > 0 && i === moleculeTypeConditions.length - 1) macromoleculesDescription += ' and ';

      macromoleculesDescription += `${filteredMacromolecules.length} ${moleculeTypeCondition.moleculeDescriptionSuffix}`;
      totalMolecules += filteredMacromolecules.length;

      const hasPlural = filteredMacromolecules.length > 1 ? 's' : '';
      entryContentsDescription.push(`${filteredMacromolecules.length} ${moleculeTypeCondition.entryContentsDescriptionSuffix} molecule${hasPlural}`);
    }
    macromoleculesDescription += totalMolecules > 1 ? ' molecules' : ' molecule';

    return { macromoleculesDescription, entryContentsDescription };
  });

  public generateListSelectable(imageList: string[], molstarResidueInfo: MolstarResidueInfo[]) {
    const entryId = this.entryId() ?? '';
    const macromolecules = this.macromolecules() ?? [];
    const modifications = this.inputModifications() ?? [];
    const cathMappings = this.cathMappings();
    const pfamMappings = this.pfamMappings();
    const scopMappings = this.scopMappings();
    const ligands = this.ligands() ?? [];

    this.numLigands.set(ligands.length);

    const listViewSelectablesByTab: DataForListViews = {};
    listViewSelectablesByTab['Assembly'] = [];

    // convert macromolecule objects to listview objects
    const macromoleculesToListView: ListSelectable[] = [];

    for (let i = 0; i < macromolecules.length; i++) {
      const macromolecule = macromolecules[i];

      // check which macromolecule chains exist in molstar assembly
      const chainsForMacromoleculeInAssembly = [
        ...new Set(
          molstarResidueInfo
            .filter((resid) => {
              return resid.label_entity_id && resid.label_asym_id && resid.label_entity_id === macromolecule.entity_id + '';
            })
            .map((resid) => resid.label_asym_id!)
        ),
      ];

      // created molstar selection objects for each chain
      const molstarNamedSelections: MolstarNamedSelections[] = [];
      for (const chain of chainsForMacromoleculeInAssembly) {
        molstarNamedSelections.push({
          name: `Chain: ${chain}`,
          selection: {
            entityId: macromolecule.entity_id + '',
            authChainId: chain,
            residues: [],
          },
        });
      }

      const macromoleculeColors = [this.colorsFromMolj()[macromolecule.entity_id]];

      // save listview object with all necessary details to display
      macromoleculesToListView.push({
        id: `macromolecule-${i + 1}`,
        name: macromolecule.molecule_name[0],
        colors: macromoleculeColors,
        molstarGalleryImg: `${entryId}_entity_${macromolecule.entity_id}_front`,
        molstarNamedSelections: molstarNamedSelections,
      });
    }
    listViewSelectablesByTab['Macromolecules'] = macromoleculesToListView;
    this.macromoleculesOverviewData.set(macromoleculesToListView);

    // convert ligand objects to listview objects
    const ligandsToListView: ListSelectable[] = [];
    for (let j = 0; j < ligands.length; j++) {
      const ligand = ligands[j];

      // check which ligand residues exist in molstar assembly
      const ligandResidueInfo = molstarResidueInfo.filter((residInfo) => {
        return (
          residInfo.label_entity_id &&
          residInfo.auth_asym_id &&
          residInfo.label_asym_id &&
          residInfo.label_entity_id === ligand.entity_id + '' &&
          ligand.in_chains.indexOf(residInfo.auth_asym_id) > -1 &&
          ligand.in_struct_asyms.indexOf(residInfo.label_asym_id) > -1
        );
      });

      // created molstar selection objects for each residue
      const molstarNamedSelections: MolstarNamedSelections[] = ligandResidueInfo.map((ligResidInfo) => {
        const chain = ligResidInfo.auth_asym_id!;
        const resNum = ligResidInfo.auth_seq_id! + '';
        const resIns = ligResidInfo.pdbx_PDB_ins_code || '';
        return {
          name: `Chain: ${chain} - Res: ${resNum}${resIns}`,
          selection: {
            entityId: ligand.entity_id + '',
            authChainId: chain,
            residues: [
              {
                authBegin: resNum,
                authBeginIns: resIns,
                authEnd: resNum,
                authEndIns: resIns,
              },
            ],
          },
        };
      });

      const ligandColors = [this.colorsFromMolj()[ligand.entity_id]];

      // save listview object with all necessary details to display
      ligandsToListView.push({
        id: `ligand-${j + 1}`,
        name: `${ligand.molecule_name[0]} - ${ligand.chem_comp_ids[0]}`,
        colors: ligandColors,
        molstarGalleryImg: `${entryId}_entity_${ligand.entity_id}_front`,
        molstarNamedSelections: molstarNamedSelections,
      });
    }
    listViewSelectablesByTab['Ligands'] = ligandsToListView;
    this.ligandsOverviewData.set(ligandsToListView);

    // convert domain objects to listview objects
    const domainsToListViewByResource: { [key: string]: NestedListSelectable[] } = {};
    domainsToListViewByResource['CATH'] = [];
    domainsToListViewByResource['SCOP'] = [];
    domainsToListViewByResource['Pfam'] = [];

    const cathUniqueAccessions = new Set();
    const scopUniqueAccessions = new Set();
    const pfamUniqueAccessions = new Set();

    if (cathMappings) {
      for (const [resourceAcc, data] of Object.entries(cathMappings)) {
        // domain names in CATH are unique 'domain' fields inside mappings
        const domainDesc = data.homology;

        // first get corresponding images for a given accession
        const imagesForAccession = imageList.filter((img) => img.split('_')[4] === resourceAcc);

        // const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);
        // if we had images for each domainName:
        // for (const domainName of domainNames) {
        // const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

        for (const imgName of imagesForAccession) {
          const entityId = imgName.split('_')[1];
          const chainId = imgName.split('_')[2];
          const mappingsForImg = data.mappings.filter((mapping) => mapping.entity_id + '' === entityId && mapping.chain_id === chainId);

          // if no domain with valid image, skip it
          if (mappingsForImg.length === 0) continue;

          const domainNames = mappingsForImg.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

          // get parent macromolecules of a domain
          const macromoleculeOfDomain = macromolecules
            .map((mol, idx) => {
              return {
                id: `macromolecule-${idx + 1}`,
                name: mol.molecule_name[0],
                color: this.colorsFromMolj()[mol.entity_id],
                entityId: mol.entity_id + '',
              };
            })
            .filter((parsedMol) => parsedMol.entityId === entityId)[0];

          // filter mappings data for this assembly
          const segmentData = formatSegments(mappingsForImg, molstarResidueInfo);

          // if no observed segments for this domain in the assembly, skip it
          if (segmentData.segments.length === 0) continue;

          cathUniqueAccessions.add(resourceAcc);
          const accIdx = [...cathUniqueAccessions].indexOf(resourceAcc) + 1;

          // if macromolecule not yet in list view
          let parentIdx = domainsToListViewByResource['CATH'].map((data) => data.parentId).indexOf(macromoleculeOfDomain.id);
          if (parentIdx === -1) {
            domainsToListViewByResource['CATH'].push({
              parentId: macromoleculeOfDomain.id,
              parentName: macromoleculeOfDomain.name,
              parentColor: macromoleculeOfDomain.color,
              nestedSelectables: [],
            });
            parentIdx = domainsToListViewByResource['CATH'].length - 1;
          }

          const molstarNamedSelections = [
            {
              name: domainNames.join(', '),
              selection: segmentData.molstarSelection,
            },
          ];

          const domainColors = domainNames.map((domainName) => this.colorsFromMolj()[domainName]);
          domainsToListViewByResource['CATH'][parentIdx].nestedSelectables.push({
            id: `domain-cath-${accIdx}`,
            name: `${domainDesc} (${resourceAcc})`,
            colors: domainColors,
            molstarGalleryImg: imgName,
            molstarNamedSelections: molstarNamedSelections,
          });
        }
      }
    }

    if (scopMappings) {
      for (const [resourceAcc, data] of Object.entries(scopMappings)) {
        // domain names in CATH are unique 'domain' fields inside mappings
        const domainDesc = data.description;

        // first get corresponding images for a given accession
        const imagesForAccession = imageList.filter((img) => img.split('_')[4] === resourceAcc);

        // const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);
        // if we had images for each domainName:
        // for (const domainName of domainNames) {
        // const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

        for (const imgName of imagesForAccession) {
          const entityId = imgName.split('_')[1];
          const chainId = imgName.split('_')[2];
          const mappingsForImg = data.mappings.filter((mapping) => mapping.entity_id + '' === entityId && mapping.chain_id === chainId);

          // if no domain with valid image, skip it
          if (mappingsForImg.length === 0) continue;

          const domainNames = mappingsForImg.map((mapping) => mapping.scop_id!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

          // get parent macromolecules of a domain
          const macromoleculeOfDomain = macromolecules
            .map((mol, idx) => {
              return {
                id: `macromolecule-${idx + 1}`,
                name: mol.molecule_name[0],
                color: this.colorsFromMolj()[mol.entity_id],
                entityId: mol.entity_id + '',
              };
            })
            .filter((parsedMol) => parsedMol.entityId === entityId)[0];

          // filter mappings data for this assembly
          const segmentData = formatSegments(mappingsForImg, molstarResidueInfo);

          // if no observed segments for this domain in the assembly, skip it
          if (segmentData.segments.length === 0) continue;

          scopUniqueAccessions.add(resourceAcc);
          const accIdx = [...scopUniqueAccessions].indexOf(resourceAcc) + 1;

          // if macromolecule not yet in list view
          let parentIdx = domainsToListViewByResource['SCOP'].map((data) => data.parentId).indexOf(macromoleculeOfDomain.id);
          if (parentIdx === -1) {
            domainsToListViewByResource['SCOP'].push({
              parentId: macromoleculeOfDomain.id,
              parentName: macromoleculeOfDomain.name,
              parentColor: macromoleculeOfDomain.color,
              nestedSelectables: [],
            });
            parentIdx = domainsToListViewByResource['SCOP'].length - 1;
          }

          const molstarNamedSelections = [
            {
              name: domainNames.join(', '),
              selection: segmentData.molstarSelection,
            },
          ];

          const domainColors = domainNames.map((domainName) => this.colorsFromMolj()[domainName]);
          domainsToListViewByResource['SCOP'][parentIdx].nestedSelectables.push({
            id: `domain-scop-${accIdx}`,
            name: `${domainDesc} (${resourceAcc})`,
            colors: domainColors,
            molstarGalleryImg: imgName,
            molstarNamedSelections: molstarNamedSelections,
          });
        }
      }
    }

    if (pfamMappings) {
      for (const [resourceAcc, data] of Object.entries(pfamMappings)) {
        const domainDesc = data.description;

        // first get corresponding images for a given accession
        const imagesForAccession = imageList.filter((img) => img.split('_')[4] === resourceAcc);

        // const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);
        // if we had images for each domainName:
        // for (const domainName of domainNames) {
        // const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

        for (const imgName of imagesForAccession) {
          const entityId = imgName.split('_')[1];
          const chainId = imgName.split('_')[2];
          const mappingsForImg = data.mappings.filter((mapping) => mapping.entity_id + '' === entityId && mapping.chain_id === chainId);

          // if no domain with valid image, skip it
          if (mappingsForImg.length === 0) continue;

          const domainNames = mappingsForImg.map((_mapping, idx) => `${resourceAcc}_${idx + 1}`).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

          // get parent macromolecules of a domain
          const macromoleculeOfDomain = macromolecules
            .map((mol, idx) => {
              return {
                id: `macromolecule-${idx + 1}`,
                name: mol.molecule_name[0],
                color: this.colorsFromMolj()[mol.entity_id],
                entityId: mol.entity_id + '',
              };
            })
            .filter((parsedMol) => parsedMol.entityId === entityId)[0];

          // filter mappings data for this assembly
          const segmentData = formatSegments(mappingsForImg, molstarResidueInfo);

          // if no observed segments for this domain in the assembly, skip it
          if (segmentData.segments.length === 0) continue;

          pfamUniqueAccessions.add(resourceAcc);
          const accIdx = [...pfamUniqueAccessions].indexOf(resourceAcc) + 1;

          // if macromolecule not yet in list view
          let parentIdx = domainsToListViewByResource['Pfam'].map((data) => data.parentId).indexOf(macromoleculeOfDomain.id);
          if (parentIdx === -1) {
            domainsToListViewByResource['Pfam'].push({
              parentId: macromoleculeOfDomain.id,
              parentName: macromoleculeOfDomain.name,
              parentColor: macromoleculeOfDomain.color,
              nestedSelectables: [],
            });
            parentIdx = domainsToListViewByResource['Pfam'].length - 1;
          }

          const molstarNamedSelections = [
            {
              name: domainNames.join(', '),
              selection: segmentData.molstarSelection,
            },
          ];

          const domainColors = domainNames.map((domainName) => this.colorsFromMolj()[domainName]);
          domainsToListViewByResource['Pfam'][parentIdx].nestedSelectables.push({
            id: `domain-pfam-${accIdx}`,
            name: `${domainDesc} (${resourceAcc})`,
            colors: domainColors,
            molstarGalleryImg: imgName,
            molstarNamedSelections: molstarNamedSelections,
          });
        }
      }
    }
    listViewSelectablesByTab['Domains'] = domainsToListViewByResource;
    this.domainsOverviewData.set(domainsToListViewByResource);

    // convert modification objects to listview objects
    const modificationsToListView: ListSelectable[] = [];

    // first filter modifcations for current assembly
    const modsInAssembly = modifications.filter((mod) => {
      const modInResidueInfo = molstarResidueInfo.filter((resid) => {
        const insertionCode = resid.pdbx_PDB_ins_code || '';
        return (
          resid.label_entity_id &&
          resid.auth_asym_id &&
          resid.auth_seq_id &&
          resid.label_entity_id === mod.entity_id + '' &&
          resid.auth_asym_id === mod.chain_id &&
          resid.auth_seq_id === mod.author_residue_number &&
          insertionCode === mod.author_insertion_code
        );
      });
      return modInResidueInfo.length > 0;
    });

    // then get unique modifications chem_comp_ids
    const modificationUniqueIds = modsInAssembly.map((mod) => mod.chem_comp_id).filter((modId, idx, ids) => ids.indexOf(modId) === idx);
    this.numModifications.set(modificationUniqueIds.length);

    // parse data for each unique id
    for (let l = 0; l < modificationUniqueIds.length; l++) {
      const modId = modificationUniqueIds[l];
      const modificationsOfId = modsInAssembly.filter((mod) => mod.chem_comp_id === modId);

      const modName = modificationsOfId[0].chem_comp_name;

      const molstarNamedSelections = modificationsOfId.map((mod) => {
        return {
          name: `Chain: ${mod.chain_id} - Res: ${mod.author_residue_number}${mod.author_insertion_code}`,
          selection: {
            entityId: mod.entity_id + '',
            authChainId: mod.chain_id,
            residues: [
              {
                authBegin: mod.author_residue_number + '',
                authBeginIns: mod.author_insertion_code + '',
                authEnd: mod.author_residue_number + '',
                authEndIns: mod.author_insertion_code + '',
              },
            ],
          },
        };
      });

      const modificationColors = [this.colorsFromMolj()[modId]];
      // save listview object with all necessary details to display
      modificationsToListView.push({
        id: `modification-${l + 1}`,
        name: `${modName} - ${modId}`,
        colors: modificationColors,
        molstarGalleryImg: `${entryId}_modres_${modId}_front`,
        molstarNamedSelections: molstarNamedSelections,
      });
    }
    listViewSelectablesByTab['Modifications'] = modificationsToListView;
    this.modificationsOverviewData.set(modificationsToListView);

    this.domainCountByResource.set({
      CATH: cathUniqueAccessions.size,
      SCOP: scopUniqueAccessions.size,
      Pfam: pfamUniqueAccessions.size,
    });
    this.listViewSelectablesByTab.set(listViewSelectablesByTab);
    this.dataParsed.set(true);
  }

  public parseRelatedEntries(): void {
    this.globalStore
      .select(EntrySelectors.primaryPublication)
      .pipe(
        filter(Boolean),
        map((primaryPublication) => {
          if (primaryPublication) {
            let relatedEntries: string[] = [];
            if (primaryPublication && primaryPublication.associated_entries) {
              relatedEntries = primaryPublication.associated_entries.split(', ');
            }
            this.relatedEntries.set(relatedEntries);
          }
        })
      )
      .subscribe();
  }

  public parseComplexDetails(): void {
    const complexDetails = this.complexDetails() ?? [];
    if (complexDetails) {
      let preferredAssemblyId = undefined;
      for (const complexDetail of complexDetails) {
        for (const assemblyInfo of complexDetail.assemblies) {
          if (assemblyInfo.preferred_assembly) {
            preferredAssemblyId = assemblyInfo.assembly_id;
            const participants = complexDetail.participants;
            this.assemblyData.set({
              name: complexDetail.name,
              preferred: preferredAssemblyId,
              composition: calculateAssemblyComposition(participants),
              complexId: complexDetail.pdb_complex_id,
            });
            break;
          }
        }
        if (preferredAssemblyId) break;
      }
    }
  }

  public async getColorsFromMolj(moljDescriptions: string[]) {
    // let moljColors: { [key: string | number]: string } = {};

    // Create an array of observables for the molj queries
    const moljObservables = moljDescriptions.map((moljDescription) => {
      const isEntityQuery = moljDescription.includes('_chemically_distinct_molecules');
      const isModQuery = moljDescription.includes('_modres_');

      const colorThemeName = isEntityQuery ? 'entity-id' : 'uniform';

      return this.entryAPIService.getGalleryMolj(moljDescription).pipe(
        map((entries) => {
          for (const entry of entries) {
            const transforms = entry.snapshot.data.tree.transforms;
            const transforms3d = transforms.filter((transform: any) => transform.transformer == 'ms-plugin.structure-representation-3d');

            for (const transform of transforms3d) {
              // return early if colorTheme name different from expected
              if (transform.params.colorTheme.name !== colorThemeName) continue;

              // if this molj is domain related, check for domain key words and return early if not present
              const hasDomainsString = transform.parent.includes('/struct-model/domains/') && transform.parent.includes('/polymer');
              if (isEntityQuery === false && isModQuery === false && hasDomainsString === false) continue;

              const hasModQueryString = transform.parent.includes('/modified-residues/');
              // is this molJ is modification related, check for modification key words and return early if not present
              if (isModQuery === true && hasModQueryString === false) continue;

              // if this molj is domain or modification related, color dict key is the domain identifier (6th in split by '/')
              const moljColorKey = isEntityQuery ? 'entity-id' : transform.parent.split('/')[5];

              // retrieve color or list of colors according to if molj is domain related
              const moljColorValue = this.getMoljColors(transform, isEntityQuery);

              if (isEntityQuery) {
                for (let entityIdx = 0; entityIdx < moljColorValue.length; entityIdx++) {
                  // moljColors[entityIdx + 1] = moljColorValue[entityIdx];
                  // this.colorsFromMolj()[entityIdx + 1] = moljColorValue[entityIdx];
                  this.colorsFromMolj.update((state) => ({
                    ...state, // spread the existing state
                    [entityIdx + 1]: moljColorValue[entityIdx], // update the specific key dynamically
                  }));
                }
              } else {
                // moljColors[moljColorKey] = moljColorValue as string;
                // this.colorsFromMolj()[moljColorKey] = moljColorValue as string;
                this.colorsFromMolj.update((state) => ({
                  ...state, // spread the existing state
                  [moljColorKey]: moljColorValue as string, // update the specific key dynamically
                }));
              }
            }
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel and wait for all to complete
    // return forkJoin(moljObservables).pipe(
    //   map(() => moljColors) // Return the final moljColors object
    // );
    await firstValueFrom(forkJoin(moljObservables));
  }

  public getMoljColors(transform: any, isEntity: boolean) {
    if (isEntity) {
      const colors: number[] = transform.params.colorTheme.params.palette.params.list.colors;
      return colors.map((c) => '#' + ('000000' + c.toString(16)).slice(-6));
    } else {
      const color: number = transform.params.colorTheme.params.value;
      return '#' + ('000000' + color.toString(16)).slice(-6);
    }
  }
}
