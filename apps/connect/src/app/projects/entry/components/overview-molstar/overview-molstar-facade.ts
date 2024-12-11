import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { Molecule } from '../../data-models/molecule.model';
import { MolstarResidueInfo, MolstarSelectionObj } from '../../helpers/molstar/molstar-helpers';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { calculateAssemblyComposition } from '../../helpers/assembly-helpers';
import { CathMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { EntryApiService } from '../../services/entry-api.service';

export type MappedModification = {
  name: string;
  img: string;
  chem_comp_id: string;
};

type ParsedDomainsByEntityAndResource = {
  [key: string]: {
    [key: string]: ParsedDomainsByEntity;
  };
};

type ParsedDomainsByEntity = {
  // first level: entity ids
  [key: string]: {
    accession: string;
    description: string;
    domains: {
      [key: string]: {
        domainId: string;
        domainAcc: string;
        segments: ParsedDomainSegment[];
      };
    };
    img: string;
  };
};

type ParsedDomainSegment = {
  chain_id: string;
  entity_id: string;
  classification_acc: string;
  domain_acc: string;
  domain_id: string;
  auth_begin: string;
  auth_begin_ins: string;
  auth_end: string;
  auth_end_ins: string;
  resn_begin: number;
  resn_end: number;
};

type ParsedComplexDetails = {
  name: string | null | undefined;
  preferred: number | null | undefined;
  composition: string | null | undefined;
  complexId: string | null | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class OverviewMolstarFacade {
  private readonly entryAPIService = inject(EntryApiService);

  public assemblyData: WritableSignal<ParsedComplexDetails> = signal({
    name: undefined,
    preferred: undefined,
    composition: undefined,
    complexId: undefined,
  });

  public moleculesDescription: WritableSignal<string[]> = signal([]);
  public entryContentsDescription: WritableSignal<string[]> = signal([]);
  public modifications: WritableSignal<MappedModification[]> = signal([]);
  public domainsByEntityAndResource: WritableSignal<ParsedDomainsByEntityAndResource> = signal({});
  public domainCountByResource: WritableSignal<{ [key: string]: number }> = signal({
    CATH: 0,
    Pfam: 0,
    SCOP: 0,
  });
  public moleculeNameByEntityId: WritableSignal<{ [key: string]: string }> = signal({});

  // public totalDomains = signal(0);
  public colorsFromMolj: WritableSignal<{ [key: string | number]: string }> = signal({});

  public parseComplexDetails(complexDetails: ComplexDetails[]) {
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
    // if (Object.keys(complexDetails).length > 1) {
    //   const assemblies = complexDetails.assemblies;
    //   let preferredAssemblyId = undefined;
    //   for (const assembly of assemblies) {
    //     if (assembly.preferred_assembly) {
    //       preferredAssemblyId = assembly.assembly_id;
    //     }
    //   }
    //   const participants = complexDetails.participants;

    //   this.assemblyData.set({
    //     name: complexDetails.name,
    //     preferred: preferredAssemblyId,
    //     composition: calculateAssemblyComposition(participants),
    //     complexId: complexDetails.pdb_complex_id
    //   })
    // }
  }

  public generateMoleculeCountText(macromolecules: Molecule[]) {
    const moleculeTypeConditions = [
      {
        moleculeTypes: ['polypeptide(L)', 'polypeptide(R)'],
        moleculeDescriptionSuffix: 'unique proteins',
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

    // for each macromolecule type (protein, dna, rna, dna/rna hybrid, carbohydrate)
    for (const moleculeTypeCondition of moleculeTypeConditions) {
      // filter the complete macromolecule list by the type
      const filteredMacromolecules = macromolecules.filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);
      if (filteredMacromolecules.length > 0) {
        // create text descriptions taken from object above (moleculeTypeConditions) for the count of each molecule type
        // this.moleculesDescription().push(`${filteredMacromolecules.length} ${moleculeTypeCondition.moleculeDescriptionSuffix}`);
        // this.entryContentsDescription().push(`${filteredMacromolecules.length} ${moleculeTypeCondition.entryContentsDescriptionSuffix} molecule`);
        this.moleculesDescription.update((descriptions) => [
          ...descriptions, // spread the current array
          `${filteredMacromolecules.length} ${moleculeTypeCondition.moleculeDescriptionSuffix}`, // add the new element
        ]);
        this.entryContentsDescription.update((descriptions) => [
          ...descriptions, // spread the current array
          `${filteredMacromolecules.length} ${moleculeTypeCondition.entryContentsDescriptionSuffix} molecule`, // add the new element
        ]);
        // if count bigger than one, add 's' to molecule
        if (filteredMacromolecules.length > 1) {
          // this.entryContentsDescription()[this.entryContentsDescription().length-1] += 's';
          this.entryContentsDescription.update((descriptions) => {
            const updatedDescriptions = [...descriptions]; // copy the array
            updatedDescriptions[updatedDescriptions.length - 1] += 's'; // update the element at index 1
            return updatedDescriptions;
          });
        }
      }
    }
  }

  public mapEntityIdToMoleculeName(allMolecules: Molecule[]) {
    for (const mol of allMolecules) {
      // this.moleculeNameByEntityId()[mol.entity_id+''] = mol.molecule_name[0];
      this.moleculeNameByEntityId.update((state) => ({
        ...state, // spread the existing state
        [mol.entity_id + '']: mol.molecule_name[0], // update the specific key dynamically
      }));
    }
  }

  public parseModifications(entryId: string, modifications: ModifiedResidue[], imageList: string[]) {
    for (const eachModification of modifications) {
      // generate image string
      const imgString = imageList.filter((eachImg) => eachImg === `${entryId}_modres_${eachModification.chem_comp_id}_front`);

      // add modification to list if does not exist yet
      const previousModifications = this.modifications().map((previousMod) => previousMod.name);
      if (imgString && previousModifications.indexOf(eachModification.chem_comp_name) === -1) {
        // this.modifications().push({
        //   "name": eachModification.chem_comp_name,
        //   "img": imgString[0],
        //   "chem_comp_id": eachModification.chem_comp_id
        // });
        this.modifications.update((descriptions) => [
          ...descriptions,
          {
            name: eachModification.chem_comp_name,
            img: imgString[0],
            chem_comp_id: eachModification.chem_comp_id,
          },
        ]);
      }
    }
  }

  // Helper function to ensure a nested structure exists and return a new state with updated values.
  private ensureNestedStructure<T extends Record<string | number, any>>(state: T, path: Array<string | number>, defaultValue: any): T {
    // first state of signal is copied
    const newState = { ...state };

    // current level is equal to signal current state
    let currentLevel: Record<string | number, any> = newState;

    // for each path (list of keys passed to function) we ...
    for (let i = 0; i < path.length; i++) {
      const key = path[i];

      // ...check if the path does not exist
      if (!(key in currentLevel)) {
        // ... if so we create the path mapping it to a value (passed to function)
        currentLevel[key] = i === path.length - 1 ? defaultValue : {};
      }

      // ...finally we keep navigating to path (change currentLevel)
      currentLevel = currentLevel[key];
    }

    // updates are also done in state copy which is now returned
    return newState;
  }

  public parseMolstarGalleryDomains(entryId: string, imageList: string[], domainsData: { [key: string]: CathMappings | PfamMappings | ScopMappings }) {
    const domainIdxByClassificationAcc: { [key: string]: number } = {};

    for (const resourceName of Object.keys(domainsData)) {
      const resourceData = domainsData[resourceName];

      const uniqueDomains = new Set();

      // Ensure resource exists
      this.domainsByEntityAndResource.update((state) => this.ensureNestedStructure(state, [resourceName], {}));

      for (const [groupId, groupData] of Object.entries(resourceData)) {
        let classificationDescription = (groupData as any)['description'];
        const mappings = (groupData as any)['mappings'];

        for (const mapping of mappings) {
          const domainImg = `${entryId.toLowerCase()}_${mapping.entity_id}_${mapping.chain_id}_${resourceName}_${groupId}`;

          // If the domain image is not in the image list, skip it
          if (imageList.indexOf(domainImg) === -1) continue;

          // Count domains for classification
          domainIdxByClassificationAcc[groupId] = (domainIdxByClassificationAcc[groupId] || 0) + 1;

          uniqueDomains.add(groupId);

          // Create domain identifiers based on resource
          let domainAcc = '';
          let domainId = '';
          if (resourceName === 'CATH') {
            domainAcc = mapping['domain'];
            domainId = mapping['domain'];
            classificationDescription = (groupData as any)['homology'];
          } else if (resourceName === 'SCOP') {
            domainAcc = mapping['scop_id'];
            domainId = mapping['scop_id'];
          } else if (resourceName === 'Pfam') {
            domainAcc = `${groupId}:${mapping['chain_id']}`;
            const pfamDomainIdx = domainIdxByClassificationAcc[groupId];
            domainId = `${groupId}_${pfamDomainIdx}`;
          }

          const segmentObj: ParsedDomainSegment = {
            chain_id: mapping['chain_id'],
            entity_id: mapping['entity_id'],
            classification_acc: groupId,
            domain_acc: domainAcc,
            domain_id: domainId,
            auth_begin: mapping['start']['author_residue_number'] + '',
            auth_begin_ins: mapping['start']['author_insertion_code'],
            auth_end: mapping['end']['author_residue_number'] + '',
            auth_end_ins: mapping['end']['author_insertion_code'],
            resn_begin: mapping['start']['residue_number'],
            resn_end: mapping['start']['residue_number'],
          };

          // Ensure entity exists
          this.domainsByEntityAndResource.update((state) => this.ensureNestedStructure(state, [resourceName, segmentObj['entity_id']], {}));

          // Ensure classification exists
          this.domainsByEntityAndResource.update((state) =>
            this.ensureNestedStructure(state, [resourceName, segmentObj['entity_id'], segmentObj['classification_acc']], {
              accession: segmentObj['classification_acc'],
              description: classificationDescription,
              img: domainImg,
              domains: {},
            })
          );

          // Ensure domain exists
          this.domainsByEntityAndResource.update((state) =>
            this.ensureNestedStructure(state, [resourceName, segmentObj['entity_id'], segmentObj['classification_acc'], 'domains', segmentObj['domain_id']], {
              domainId: segmentObj['domain_id'],
              domainAcc: segmentObj['domain_acc'],
              segments: [],
            })
          );

          // Add segment to the domain
          this.domainsByEntityAndResource.update((state) => {
            const newState = { ...state };
            newState[resourceName][segmentObj['entity_id']][segmentObj['classification_acc']].domains[segmentObj['domain_id']].segments.push(segmentObj);
            return newState;
          });
        }
      }

      // Set unique accession count
      this.domainCountByResource.update((state) => ({
        ...state,
        [resourceName]: (state[resourceName] || 0) + uniqueDomains.size,
      }));
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

  public getSelectionsFromImg(
    tabView: string,
    imgName: string,
    molstarResidueInfo: MolstarResidueInfo[],
    selectedEntity?: Molecule,
    selectedMods?: ModifiedResidue[]
  ) {
    let name: string | undefined = undefined;
    const molstarSelections: MolstarSelectionObj[] = [];

    if (tabView === 'Macromolecules') {
      name = selectedEntity!.molecule_name[0];
      for (const chain of selectedEntity!.in_chains) {
        molstarSelections.push({
          entityId: selectedEntity!.entity_id + '',
          authChainId: chain,
          residues: [],
        });
      }
    } else if (tabView === 'Ligands') {
      name = selectedEntity!.molecule_name[0];
      // const residueListingEntity = residueListing['molecules'].filter((entity) => entity.entity_id === selectedEntity!.entity_id)[0];
      // const chains = residueListingEntity['chains'].filter((chain) => {
      //   return selectedEntity!.in_chains.indexOf(chain.chain_id) > -1 && selectedEntity!.in_struct_asyms.indexOf(chain.struct_asym_id) > -1;
      // });
      // for (const chain of chains) {
      //   const newMolstarSelection: MolstarSelectionObj = {
      //     entityId: selectedEntity!.entity_id + '',
      //     authChainId: chain.chain_id,
      //     residues: [],
      //   };
      //   for (const resid of chain['residues']) {
      //     newMolstarSelection['residues'] = [
      //       {
      //         authBegin: resid.author_residue_number + '',
      //         authBeginIns: resid.author_insertion_code + '',
      //         authEnd: resid.author_residue_number + '',
      //         authEndIns: resid.author_insertion_code + '',
      //       },
      //     ];
      //     molstarSelections.push(newMolstarSelection);
      //   }
      // }
      const ligandResidueInfo = molstarResidueInfo.filter((residInfo) => {
        return (
          residInfo.label_entity_id &&
          residInfo.auth_asym_id &&
          residInfo.label_asym_id &&
          residInfo.label_entity_id === selectedEntity!.entity_id + '' &&
          selectedEntity!.in_chains.indexOf(residInfo.auth_asym_id) > -1 &&
          selectedEntity!.in_struct_asyms.indexOf(residInfo.label_asym_id) > -1
        );
      });
      const newMolstarSelections: MolstarSelectionObj[] = ligandResidueInfo.map((ligResidInfo) => {
        return {
          entityId: selectedEntity!.entity_id + '',
          authChainId: ligResidInfo.auth_asym_id!,
          residues: [
            {
              authBegin: ligResidInfo.auth_seq_id! + '',
              authBeginIns: ligResidInfo.pdbx_PDB_ins_code || '',
              authEnd: ligResidInfo.auth_seq_id! + '',
              authEndIns: ligResidInfo.pdbx_PDB_ins_code || '',
            },
          ],
        };
      });
      molstarSelections.push(...newMolstarSelections);
    } else if (tabView === 'Domains') {
      const entityId = parseInt(imgName.split('_')[1]);
      const resource = imgName.split('_')[3];
      const resourceId = imgName.split('_')[4];

      const molstarSelectionObj: MolstarSelectionObj = {
        entityId: entityId + '',
        residues: [],
      };
      const domainInfo = this.domainsByEntityAndResource()[resource][entityId][resourceId];
      name = domainInfo.description;

      for (const [_domain, domainData] of Object.entries(domainInfo.domains)) {
        for (const segment of domainData.segments) {
          const residueListingChain = molstarResidueInfo.filter((residInfo) => {
            return (
              residInfo.label_entity_id &&
              residInfo.auth_asym_id &&
              residInfo.label_seq_id &&
              residInfo.auth_seq_id &&
              residInfo.label_entity_id! === entityId + '' &&
              residInfo.auth_asym_id! === segment.chain_id
            );
          });
          const residuesOfChain = residueListingChain.sort((a, b) => a.label_seq_id! - b.label_seq_id!);

          let firstRes = {
            auth_begin: segment.auth_begin,
            auth_begin_ins: segment.auth_begin_ins,
          };
          if (segment.auth_begin === 'null') {
            // const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.residue_number >= segment.resn_begin);
            const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.label_seq_id! >= segment.resn_begin);
            firstRes = {
              // auth_begin: residuesOfChainAboveStart[0].author_residue_number + '',
              // auth_begin_ins: residuesOfChainAboveStart[0].author_insertion_code,
              auth_begin: residuesOfChainAboveStart[0].auth_seq_id + '',
              auth_begin_ins: residuesOfChainAboveStart[0].pdbx_PDB_ins_code || '',
            };
          }

          let lastRes = {
            auth_end: segment.auth_end,
            auth_end_ins: segment.auth_end_ins,
          };
          if (segment.auth_end === 'null') {
            // const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.residue_number <= segment.resn_end);
            const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.label_seq_id! <= segment.resn_end);
            lastRes = {
              // auth_end: residuesOfChain[residuesOfChain.length-1].author_residue_number+'',
              // auth_end_ins: residuesOfChain[residuesOfChain.length-1].author_insertion_code
              // auth_end: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_residue_number + '',
              // auth_end_ins: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_insertion_code,
              auth_end: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].auth_seq_id + '',
              auth_end_ins: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].pdbx_PDB_ins_code || '',
            };
          }

          molstarSelectionObj.residues.push({
            authBegin: firstRes.auth_begin,
            authBeginIns: firstRes.auth_begin_ins,
            authEnd: lastRes.auth_end,
            authEndIns: lastRes.auth_end_ins,
            authChainId: segment.chain_id,
          });
        }
      }
      molstarSelections.push(molstarSelectionObj);
    } else if (tabView === 'Modifications') {
      name = selectedMods![0].chem_comp_name;
      for (const mod of selectedMods!) {
        molstarSelections.push({
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
        });
      }
    }
    return {
      name: name,
      selections: molstarSelections,
    };
  }
}
