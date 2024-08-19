import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

type macromoleculeTypes =
  | 'polypeptide(L)'
  | 'polypeptide(R)'
  | 'polyribonucleotide'
  | 'polydeoxyribonucleotide'
  | 'polydeoxyribonucleotide/polyribonucleotide hybrid'
  | 'carbohydrate polymer';

export type extraInfoObj = {
  value: string;
  type: string;
  link?: {
    txt: string;
    src: string;
  };
  values?: {
    colNames: string[];
    rows: {
      molstarSelection?: {
        entityId: string;
        authChainId: string;
        residues: {
          authBegin: string;
          authBeginIns: string;
          authEnd: string;
          authEndIns: string;
        }[];
      };
      data: string[];
    }[];
  };
  temp?: string[];
  molstarInteractivity?: boolean;
};

export type MenuItemMolObj = {
  name: string;
  img: string;
  envImg?: string;
  extraInfo: extraInfoObj[];
};

type MULTIMER_MAPPING_KEYS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

const MULTIMER_MAPPING = {
  // see http://en.wikipedia.org/wiki/IUPAC_numerical_multiplier
  1: 'monomer',
  2: 'dimer',
  3: 'trimer',
  4: 'tetramer',
  5: 'pentamer',
  6: 'hexamer',
  7: 'heptamer',
  8: 'octamer',
  9: 'nonamer',
  10: 'decamer',
  11: 'undecamer',
  12: 'dodecamer',
  13: 'tridecamer',
  14: 'tetradecamer',
  15: 'pentadecamer',
  16: 'hexadecamer',
  17: 'heptadecamer',
  18: 'octadecamer',
  19: 'nonadecamer',
  20: 'icosamer',
};

@Injectable({
  providedIn: 'root',
})
export class StructureExplorerService {
  private BASE_API = 'https://www.ebi.ac.uk/pdbe/api/pdb/entry/';
  private BASE_API_AGG = 'https://www.ebi.ac.uk/pdbe/aggregated-api/';
  private BASE_API_MAP = 'https://www.ebi.ac.uk/pdbe/api/mappings/';

  private readonly http = inject(HttpClient);

  public getPreferredAssembly(entryId: string): Observable<any> {
    // https://www.ebi.ac.uk/pdbe/aggregated-api/complex/details/7v08?id_type=pdb_id
    return this.http.get<any>(`${this.BASE_API_AGG}complex/details/${entryId}?id_type=pdb_id`).pipe(
      map((data) => {
        const assemblies = data[entryId][0].assemblies;
        let preferredAssemblyId = undefined;
        for (const assembly of assemblies) {
          if (assembly.preferred_assembly) {
            preferredAssemblyId = assembly.assembly_id;
          }
        }
        const participants: { accession: string; stoichiometry: number }[] = data[entryId][0].participants;

        const participantTypes = [];
        let mericityTotal = 0;
        for (const participant of participants) {
          if (participantTypes.indexOf(participant.accession) === -1) {
            participantTypes.push(participant.accession);
            mericityTotal += participant.stoichiometry;
          }
        }

        let compositionPrefix = 'homo ';
        if (participantTypes.length > 1) {
          compositionPrefix = 'hetero ';
        }
        let compositionSuffix = `${mericityTotal}-mer`;
        if (mericityTotal <= 20) {
          compositionSuffix = MULTIMER_MAPPING[mericityTotal as MULTIMER_MAPPING_KEYS];
        }
        let composition = `${compositionPrefix}${compositionSuffix}`;
        if (composition === 'homo monomer') {
          composition = 'monomeric';
        }
        return {
          preferred: preferredAssemblyId,
          complexId: data[entryId][0].pdb_complex_id,
          composition: composition,
        };
      })
    );
  }

  public getAssemblyComposition(entryId: string, assemblyId: number): Observable<any> {
    return this.http.get<any>(`https://www.ebi.ac.uk/pdbe/api/pisa/assembly/${entryId}/${assemblyId}`).pipe(
      map((data) => {
        // def comp_matcher = assemblyJson['formula'] =~ participant_pattern
        // def form = null
        // if (comp_matcher && comp_matcher.size() > 1) {
        //     form = "Heteromeric"
        // } else {
        //     form = "Homomeric"
        // }
        // def mericity = ((assemblyJson['composition'] =~ /_/).count)
        // mericity =  mericity > 20 ? mericity+"-mer": this.MULTIMER_MAPPING[mericity]
      })
    );
  }

  public getUniprotsByEntityId(entryId: string): Observable<any> {
    // https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/6hr1
    return this.http.get<any>(`${this.BASE_API_MAP}uniprot/${entryId}`).pipe(
      map((data) => {
        const uniprotsByEntityId: { [key: number]: string[] } = {};
        const uniprotDictionary: {
          [key: string]: {
            name: string;
            mappings: Array<{
              entity_id: number;
              chain_id: string;
              struct_asym_id: string;
              unp_start: number;
              unp_end: number;
              start: {
                residue_number: number;
                author_residue_number: number;
                author_insertion_code: string;
              };
              end: {
                residue_number: number;
                author_residue_number: number;
                author_insertion_code: string;
              };
            }>;
          };
        } = data[entryId].UniProt;
        for (const [uniprotId, uniprotDetails] of Object.entries(uniprotDictionary)) {
          for (const mapObj of uniprotDetails.mappings) {
            if (!Object.prototype.hasOwnProperty.call(uniprotDictionary, mapObj.entity_id)) {
              uniprotsByEntityId[mapObj.entity_id] = [];
            }
            uniprotsByEntityId[mapObj.entity_id].push(uniprotId);
          }
        }
        return uniprotsByEntityId;
      })
    );
  }

  public getMacromoleculesLigands(entryId: string, uniprotsByEntityId: { [key: number]: string[] }): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}molecules/${entryId}`).pipe(
      map((data) => {
        const macromoleculeTypesToNames = {
          'polypeptide(L)': 'Protein',
          'polypeptide(R)': 'D-Protein',
          polyribonucleotide: 'RNA',
          polydeoxyribonucleotide: 'DNA',
          'polydeoxyribonucleotide/polyribonucleotide hybrid': 'DNA/RNA hybrid',
          'carbohydrate polymer': 'Carbohydrate',
        };
        const macromoleculeTypesCounts: {
          [key: string]: number;
        } = {};
        const entityIdsToProteinNames: {
          [key: number]: string;
        } = {};
        const macromoleculeTypes = Object.keys(macromoleculeTypesToNames);
        let totalMacromoleculeCount = 0;
        const molecules = data[entryId];
        const macromoleculeNamesAndImgs: MenuItemMolObj[] = [];
        const ligandsNamesAndImgs: MenuItemMolObj[] = [];
        for (const entityDetail of molecules) {
          // if macromolecule
          if (macromoleculeTypes.indexOf(entityDetail.molecule_type) > -1) {
            const chainNames = entityDetail.in_chains.join(', ');
            const chainWord = entityDetail.in_chains.length > 1 ? 'Chains' : 'Chain';
            const macromoleculeTypeName = macromoleculeTypesToNames[entityDetail.molecule_type as macromoleculeTypes];
            const extraInfoData: extraInfoObj[] = [];

            let moleculeMainName = `${macromoleculeTypeName}`;
            if (Object.prototype.hasOwnProperty.call(entityDetail, 'molecule_name') && entityDetail.molecule_name) {
              if (entityDetail.molecule_name.length > 0) {
                moleculeMainName = entityDetail.molecule_name[0];
                if (macromoleculeTypeName === 'DNA') {
                  moleculeMainName = `DNA - ${entityDetail.sequence}`;
                }
                if (macromoleculeTypeName.includes('Protein')) {
                  if (entityDetail.gene_name.length > 0) {
                    moleculeMainName = entityDetail.gene_name[entityDetail.gene_name.length - 1];
                  }
                }
                extraInfoData.push({ value: 'Molecule names:', type: 'title' });
                extraInfoData.push({ value: `${entityDetail.molecule_name.join(', ')}`, type: 'text' });
              }
            }
            if (Object.prototype.hasOwnProperty.call(entityDetail, 'gene_name') && entityDetail.gene_name) {
              if (entityDetail.gene_name.length > 0) {
                extraInfoData.push({ value: 'Gene names:', type: 'title' });
                extraInfoData.push({ value: `${entityDetail.gene_name.join(', ')}`, type: 'text' });
              }
            }
            if (Object.prototype.hasOwnProperty.call(entityDetail, 'source') && entityDetail.source) {
              if (entityDetail.source.length > 0) {
                const sourceOrganisms = entityDetail.source.map((eachSource: any) => eachSource.organism_scientific_name).join(', ');
                extraInfoData.push({ value: 'Source organisms:', type: 'title' });
                extraInfoData.push({ value: `${sourceOrganisms}`, type: 'text' });
              }
            }
            if (Object.prototype.hasOwnProperty.call(uniprotsByEntityId, entityDetail.entity_id) === true) {
              moleculeMainName += ` - ${uniprotsByEntityId[entityDetail.entity_id]}`;

              extraInfoData.push({
                value: '',
                type: 'kb-link',
                link: {
                  txt: `Learn more about ${moleculeMainName} in PDBe-KB`,
                  src: `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${uniprotsByEntityId[entityDetail.entity_id]}`,
                },
              });
            }
            entityIdsToProteinNames[entityDetail.entity_id] = moleculeMainName;

            const moleculeIdOrChains = `(${chainWord}: ${chainNames})`;
            macromoleculeNamesAndImgs.push({
              name: `${moleculeMainName} ${moleculeIdOrChains}`,
              img: `${entryId.toLowerCase()}_entity_${entityDetail.entity_id}_front`,
              extraInfo: extraInfoData,
            });
            if (Object.prototype.hasOwnProperty.call(macromoleculeTypesCounts, macromoleculeTypeName) === false) {
              macromoleculeTypesCounts[macromoleculeTypeName] = 0;
            }
            macromoleculeTypesCounts[macromoleculeTypeName] += 1;
            totalMacromoleculeCount += 1;
          }
          // if ligand
          else if (entityDetail.molecule_type === 'bound') {
            const ligandId = entityDetail.chem_comp_ids[0];
            const ligandName = entityDetail.molecule_name[0];

            ligandsNamesAndImgs.push({
              name: `${ligandId} - ${ligandName}`,
              img: `${entryId.toLowerCase()}_entity_${entityDetail.entity_id}_front`,
              envImg: `${entryId.toLowerCase()}_ligand_${ligandId}`,
              extraInfo: [
                // {
                //     value: "Molecule names:",
                //     type: "title"
                // },
                // {
                //     value: `${entityDetail.molecule_name.join(', ')}`,
                //     type: "text"
                // },
                {
                  value: `${ligandId}`,
                  type: 'lig-btn',
                  link: {
                    txt: `View ligand environment for ${ligandId}`,
                    src: `${entryId.toLowerCase()}_ligand_${ligandId}`,
                  },
                },
                {
                  value: '',
                  type: 'kb-link',
                  link: {
                    txt: `Learn more about ${ligandId} in PDBe-KB`,
                    src: `https://wwwdev.ebi.ac.uk/pdbe/connect/ligands/${ligandId}`,
                  },
                },
              ],
            });
          }
        }
        const countStrings = [];
        for (const [moleculeType, moleculeCount] of Object.entries(macromoleculeTypesCounts)) {
          countStrings.push(`${moleculeCount} unique ${moleculeType.replace('Protein', 'protein')}`);
        }
        const lastMolecule = countStrings.pop();
        const lastMoleculeName = totalMacromoleculeCount > 1 ? `and ${lastMolecule}` : lastMolecule;
        // const toBeMacromolecules = totalMacromoleculeCount > 1 ? "are" : "is";
        const pluralMacromolecules = totalMacromoleculeCount > 1 ? 'molecules' : 'molecule';
        // const macromoleculeCountsStr = `There ${toBeMacromolecules} ${countStrings.join(', ')} ${lastMoleculeName} ${pluralMacromolecules} in this assembly.`;
        const macromoleculeCountsStr = `${countStrings.join(', ')} ${lastMoleculeName} ${pluralMacromolecules}`;
        return {
          macromolecules: macromoleculeNamesAndImgs,
          macromoleculeCountsStr: macromoleculeCountsStr,
          entityIdsToProteinNames: entityIdsToProteinNames,
          ligands: ligandsNamesAndImgs,
        };
      })
    );
  }

  public getScop(entryId: string, images: string[], entityIdsToProteinNames: { [key: number]: string }): Observable<any> {
    return this.http.get<any>(`${this.BASE_API_MAP}scop/${entryId}`).pipe(
      map((data) => {
        const scopEntityMappingsNames: string[] = [];
        const scopEntityMappings: {
          name: string;
          molecules: MenuItemMolObj[];
        }[] = [];
        const scopFamilies = data[entryId]['SCOP'];
        const scopFamiliesIds = Object.keys(scopFamilies);
        for (const scopId of scopFamiliesIds) {
          for (const eachMapping of scopFamilies[scopId].mappings) {
            const entityId = eachMapping.entity_id;
            const chainId = eachMapping.chain_id;
            const imgName = `${entryId.toLowerCase()}_${entityId}_${chainId}_SCOP_${scopId}`;

            // mappings from chains not in images are not considered
            if (images.indexOf(imgName) === -1) continue;

            if (scopEntityMappingsNames.indexOf(scopId) === -1) {
              // Array of entities with Pfam mappings
              scopEntityMappings.push({
                name: scopId,
                molecules: [],
              });
              scopEntityMappingsNames.push(scopId);
            }
            const scopIdx = scopEntityMappingsNames.indexOf(scopId);

            const moleculeName = `${entityIdsToProteinNames[entityId]} (Chain: ${chainId})`;
            let mappedMolecules = scopEntityMappings[scopIdx].molecules.map((eachMapped: any) => eachMapped.name);
            if (mappedMolecules.indexOf(moleculeName) === -1) {
              scopEntityMappings[scopIdx].molecules.push({
                name: moleculeName,
                img: imgName,
                extraInfo: [
                  { value: 'Family name:', type: 'title' },
                  { value: `${scopFamilies[scopId].description} (${scopFamilies[scopId].sccs})`, type: 'text' },
                  { value: 'Mappings:', type: 'title' },
                  { value: '', temp: [], type: 'text' }, // temp save for domainIds
                  {
                    value: '',
                    values: {
                      // colNames: ["Domain", "Seg. idx", "Begin", "End", "Begin (Auth)", "End (Auth)"],
                      colNames: ['Domain', 'Seg. idx', 'Begin', 'End'],
                      rows: [],
                    },
                    type: 'table',
                    molstarInteractivity: true,
                  },
                ],
              });
              mappedMolecules = scopEntityMappings[scopIdx].molecules.map((eachMapped: any) => eachMapped.name);
            }
            const mappedIdx = mappedMolecules.indexOf(moleculeName);

            const domainId = eachMapping.scop_id;
            if (scopEntityMappings[scopIdx].molecules[mappedIdx]['extraInfo'][3].temp!.indexOf(domainId) === -1) {
              scopEntityMappings[scopIdx].molecules[mappedIdx]['extraInfo'][3].temp!.push(domainId);
            }

            const segmentId = eachMapping.segment_id;
            // const residueText = `Start: ${eachMapping.start.residue_number} - End: ${eachMapping.end.residue_number} (Auth: ${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code} - ${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code}; Segment ${segmentId} of ${domainId})`
            // scopEntityMappings[scopIdx].molecules[mappedIdx].extraInfo.push({value: residueText, type: "text"});
            scopEntityMappings[scopIdx].molecules[mappedIdx].extraInfo[4].values!.rows.push({
              molstarSelection: {
                entityId: `${entityId}`,
                authChainId: `${chainId}`,
                residues: [
                  {
                    authBegin: `${eachMapping.start.author_residue_number}`,
                    authBeginIns: `${eachMapping.start.author_insertion_code}`,
                    authEnd: `${eachMapping.end.author_residue_number}`,
                    authEndIns: `${eachMapping.end.author_insertion_code}`,
                  },
                ],
              },
              data: [
                `${domainId}`,
                `${segmentId}`,
                // `${eachMapping.start.residue_number}`,
                // `${eachMapping.end.residue_number}`,
                `${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code}`,
                `${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code}`,
              ],
            });
          }
          const scopIdx = scopEntityMappingsNames.indexOf(scopId);
          for (let index = 0; index < scopEntityMappings[scopIdx].molecules.length; index++) {
            const domainCount = scopEntityMappings[scopIdx].molecules[index]['extraInfo'][3].temp!.length;
            const domainNames = scopEntityMappings[scopIdx].molecules[index]['extraInfo'][3].temp!.join(', ');

            const toBeDomains = domainCount > 1 ? 'are' : 'is';
            const nameDomains = domainCount > 1 ? 'domains' : 'domain';
            const moleculeName = scopEntityMappings[scopIdx].molecules[index].name;

            scopEntityMappings[scopIdx].molecules[index].extraInfo[3] = {
              value: `There ${toBeDomains} ${domainCount} ${nameDomains} (${domainNames}) mapped to the following residues of ${moleculeName}:`,
              type: 'text',
            };
          }
        }
        return {
          domains: scopEntityMappings,
          count: Object.keys(scopEntityMappings).length,
        };
        // let scopNamesAndImgs = [];
        // const scopFamilies = data[entryId]['SCOP'];
        // const scopFamiliesIds = Object.keys(scopFamilies);
        // for (const scopId of scopFamiliesIds) {
        //     for (const eachMapping of scopFamilies[scopId].mappings) {
        //         const entityId = eachMapping.entity_id
        //         const chainId = eachMapping.chain_id;
        //         scopNamesAndImgs.push({
        //             name: `${scopId}`,
        //             img: `${entryId.toLowerCase()}_${entityId}_${chainId}_SCOP_${scopId}`
        //         })
        //     }
        // }
        // return scopNamesAndImgs;
      })
    );
  }

  public getCath(entryId: string, images: string[], entityIdsToProteinNames: { [key: number]: string }): Observable<any> {
    return this.http.get<any>(`${this.BASE_API_MAP}cath/${entryId}`).pipe(
      map((data) => {
        const cathEntityMappingsNames: string[] = [];
        const cathEntityMappings: {
          name: string;
          molecules: MenuItemMolObj[];
        }[] = [];
        const cathFamilies = data[entryId]['CATH'];
        const cathFamiliesIds = Object.keys(cathFamilies);
        for (const cathId of cathFamiliesIds) {
          for (const eachMapping of cathFamilies[cathId].mappings) {
            const entityId = eachMapping.entity_id;
            const chainId = eachMapping.chain_id;
            const imgName = `${entryId.toLowerCase()}_${entityId}_${chainId}_CATH_${cathId}`;

            // mappings from chains not in images are not considered
            if (images.indexOf(imgName) === -1) continue;

            if (cathEntityMappingsNames.indexOf(cathId) === -1) {
              // Array of entities with CATH mappings
              cathEntityMappings.push({
                name: cathId,
                molecules: [],
              });
              cathEntityMappingsNames.push(cathId);
            }
            const cathIdx = cathEntityMappingsNames.indexOf(cathId);

            const moleculeName = `${entityIdsToProteinNames[entityId]} (Chain: ${chainId})`;
            let mappedMolecules = cathEntityMappings[cathIdx].molecules.map((eachMapped: any) => eachMapped.name);
            if (mappedMolecules.indexOf(moleculeName) === -1) {
              cathEntityMappings[cathIdx].molecules.push({
                name: moleculeName,
                img: `${entryId.toLowerCase()}_${entityId}_${chainId}_CATH_${cathId}`,
                extraInfo: [
                  { value: 'Homologous superfamily name:', type: 'title' },
                  { value: cathFamilies[cathId].homology, type: 'text' },
                  { value: 'Mappings:', type: 'title' },
                  { value: '', temp: [], type: 'text' }, // temp save for domainIds
                  {
                    value: '',
                    values: {
                      // colNames: ["Domain", "Seg. idx", "Begin", "End", "Begin (Auth)", "End (Auth)"],
                      colNames: ['Domain', 'Seg. idx', 'Begin', 'End'],
                      rows: [],
                    },
                    type: 'table',
                    molstarInteractivity: true,
                  },
                ],
              });
              mappedMolecules = cathEntityMappings[cathIdx].molecules.map((eachMapped: any) => eachMapped.name);
            }
            const mappedIdx = mappedMolecules.indexOf(moleculeName);

            const domainId = eachMapping.domain;
            if (cathEntityMappings[cathIdx].molecules[mappedIdx]['extraInfo'][3].temp!.indexOf(domainId) === -1) {
              cathEntityMappings[cathIdx].molecules[mappedIdx]['extraInfo'][3].temp!.push(domainId);
            }

            const segmentId = eachMapping.segment_id;
            // const residueText = `Start: ${eachMapping.start.residue_number} - End: ${eachMapping.end.residue_number} (Auth: ${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code} - ${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code}; Segment ${segmentId} of ${domainId})`
            // cathEntityMappings[cathIdx].molecules[mappedIdx].extraInfo.push({value: residueText, type: "text"});
            cathEntityMappings[cathIdx].molecules[mappedIdx].extraInfo[4].values!.rows.push({
              molstarSelection: {
                entityId: `${entityId}`,
                authChainId: `${chainId}`,
                residues: [
                  {
                    authBegin: `${eachMapping.start.author_residue_number}`,
                    authBeginIns: `${eachMapping.start.author_insertion_code}`,
                    authEnd: `${eachMapping.end.author_residue_number}`,
                    authEndIns: `${eachMapping.end.author_insertion_code}`,
                  },
                ],
              },
              data: [
                `${domainId}`,
                `${segmentId}`,
                // `${eachMapping.start.residue_number}`,
                // `${eachMapping.end.residue_number}`,
                `${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code}`,
                `${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code}`,
              ],
            });
          }
          const cathIdx = cathEntityMappingsNames.indexOf(cathId);
          for (let index = 0; index < cathEntityMappings[cathIdx].molecules.length; index++) {
            const domainCount = cathEntityMappings[cathIdx].molecules[index]['extraInfo'][3].temp!.length;
            const domainNames = cathEntityMappings[cathIdx].molecules[index]['extraInfo'][3].temp!.join(', ');

            const toBeDomains = domainCount > 1 ? 'are' : 'is';
            const nameDomains = domainCount > 1 ? 'domains' : 'domain';
            const moleculeName = cathEntityMappings[cathIdx].molecules[index].name;

            cathEntityMappings[cathIdx].molecules[index].extraInfo[3] = {
              value: `There ${toBeDomains} ${domainCount} ${nameDomains} (${domainNames}) mapped to the following residues of ${moleculeName}:`,
              type: 'text',
            };
          }
        }
        return {
          domains: cathEntityMappings,
          count: Object.keys(cathEntityMappings).length,
        };

        // let cathImgs = [];
        // let cathNamesAndImgs = [];
        // const cathFamilies = data[entryId]['CATH'];
        // const cathFamiliesIds = Object.keys(cathFamilies);
        // let segmentsByChainAndDomain: any = {};
        // for (const cathId of cathFamiliesIds) {
        //     for (const eachMapping of cathFamilies[cathId].mappings) {
        //         const domainId = eachMapping.domain;
        //         const entityId = eachMapping.entity_id
        //         const chainId = eachMapping.chain_id;
        //         const cathObj = {
        //             name: `${cathId}`,
        //             img: `${entryId.toLowerCase()}_${entityId}_${chainId}_CATH_${cathId}`,
        //             extraInfo: [
        //                 {value: "Domain name:", type: "title"},
        //                 {value: cathFamilies[cathId].homology, type: "text"},
        //                 {value: "Description:", type: "title"},
        //             ]
        //         }
        //         if (cathImgs.indexOf(cathObj.img) === -1) {
        //             cathNamesAndImgs.push(cathObj);
        //             cathImgs.push(cathObj.img);
        //         }
        //         if (Object.keys(segmentsByChainAndDomain).indexOf(chainId) === -1) {
        //             segmentsByChainAndDomain[chainId] = {};
        //         }
        //         if (Object.keys(segmentsByChainAndDomain[chainId]).indexOf(domainId) === -1) {
        //             segmentsByChainAndDomain[chainId][domainId] = [];
        //         }
        //         segmentsByChainAndDomain[chainId][domainId].push(
        //             `${eachMapping.start} - ${eachMapping.end} (${eachMapping.start} - ${eachMapping.end})`
        //         )
        //     }
        // }

        // NEXT: Add in component.html a way to parse extraInfo into content
        // NEXT: Do the same for data of Macromolecules, Ligands, Modifications

        // return cathNamesAndImgs;
      })
    );
  }

  public getPfam(entryId: string, images: string[], entityIdsToProteinNames: { [key: number]: string }): Observable<any> {
    return this.http.get<any>(`${this.BASE_API_MAP}pfam/${entryId}`).pipe(
      map((data) => {
        const pfamEntityMappingsNames: string[] = [];
        const pfamEntityMappings: {
          name: string;
          molecules: MenuItemMolObj[];
        }[] = [];
        const pfamFamilies = data[entryId]['Pfam'];
        const pfamFamiliesIds = Object.keys(pfamFamilies);
        for (const pfamId of pfamFamiliesIds) {
          for (const eachMapping of pfamFamilies[pfamId].mappings) {
            const entityId = eachMapping.entity_id;
            const chainId = eachMapping.chain_id;
            const imgName = `${entryId.toLowerCase()}_${entityId}_${chainId}_Pfam_${pfamId}`;

            // mappings from chains not in images are not considered
            if (images.indexOf(imgName) === -1) continue;

            if (pfamEntityMappingsNames.indexOf(pfamId) === -1) {
              // Array of entities with Pfam mappings
              pfamEntityMappings.push({
                name: pfamId,
                molecules: [],
              });
              pfamEntityMappingsNames.push(pfamId);
            }
            const pfamIdx = pfamEntityMappingsNames.indexOf(pfamId);

            const moleculeName = `${entityIdsToProteinNames[entityId]} (Chain: ${chainId})`;
            let mappedMolecules = pfamEntityMappings[pfamIdx].molecules.map((eachMapped: any) => eachMapped.name);
            if (mappedMolecules.indexOf(moleculeName) === -1) {
              pfamEntityMappings[pfamIdx].molecules.push({
                name: moleculeName,
                img: imgName,
                extraInfo: [
                  { value: 'Domain name:', type: 'title' },
                  { value: `${pfamFamilies[pfamId].identifier} (${pfamFamilies[pfamId].name})`, type: 'text' },
                  { value: 'Mappings:', type: 'title' },
                  { value: `This Pfam domain is mapped to the following residues of ${moleculeName}:`, type: 'text' },
                  {
                    value: '',
                    values: {
                      // colNames: ["Begin", "End", "Begin (Auth)", "End (Auth)"],
                      colNames: ['Begin', 'End'],
                      rows: [],
                    },
                    type: 'table',
                    molstarInteractivity: true,
                  },
                ],
              });
              mappedMolecules = pfamEntityMappings[pfamIdx].molecules.map((eachMapped: any) => eachMapped.name);
            }
            const mappedIdx = mappedMolecules.indexOf(moleculeName);

            // const residueText = `Start: ${eachMapping.start.residue_number} - End: ${eachMapping.end.residue_number} (Auth: ${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code} - ${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code})`
            // pfamEntityMappings[pfamIdx].molecules[mappedIdx].extraInfo.push({value: residueText, type: "text"});

            pfamEntityMappings[pfamIdx].molecules[mappedIdx].extraInfo[4].values!.rows.push({
              molstarSelection: {
                entityId: `${entityId}`,
                authChainId: `${chainId}`,
                residues: [
                  {
                    authBegin: `${eachMapping.start.author_residue_number}`,
                    authBeginIns: `${eachMapping.start.author_insertion_code}`,
                    authEnd: `${eachMapping.end.author_residue_number}`,
                    authEndIns: `${eachMapping.end.author_insertion_code}`,
                  },
                ],
              },
              data: [
                // `${eachMapping.start.residue_number}`,
                // `${eachMapping.end.residue_number}`,
                `${eachMapping.start.author_residue_number}${eachMapping.start.author_insertion_code}`,
                `${eachMapping.end.author_residue_number}${eachMapping.end.author_insertion_code}`,
              ],
            });
          }
        }
        return {
          domains: pfamEntityMappings,
          count: Object.keys(pfamEntityMappings).length,
        };

        // let pfamNamesAndImgs = [];
        // const pfamFamilies = data[entryId]['Pfam'];
        // const pfamFamiliesIds = Object.keys(pfamFamilies);
        // for (const pfamId of pfamFamiliesIds) {
        //     for (const eachMapping of pfamFamilies[pfamId].mappings) {
        //         const entityId = eachMapping.entity_id
        //         const chainId = eachMapping.chain_id;
        //         pfamNamesAndImgs.push({
        //             name: `${pfamId}`,
        //             img: `${entryId.toLowerCase()}_${entityId}_${chainId}_Pfam_${pfamId}`
        //         })
        //     }
        // }
        // return pfamNamesAndImgs;
      })
    );
  }

  public getModifications(entryId: string, entityIdsToProteinNames: { [key: number]: string }): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}modified_AA_or_NA/${entryId}`).pipe(
      map((data) => {
        if (!data) return [];
        const modificationsImgs = [];
        const modificationsNamesAndImgs = [];
        const modifications = data[entryId];
        for (const modification of modifications) {
          const modificationObj = {
            name: `${modification.chem_comp_id} - ${modification.chem_comp_name}`,
            img: `${entryId.toLowerCase()}_modres_${modification.chem_comp_id}_front`,
            extraInfo: [
              {
                value: `List of modified ${modification.chem_comp_name} residues:`,
                type: 'title',
              },
              {
                value: '',
                values: {
                  // colNames: ["Molecule", "Residue", "Chain", "Resid. Id (Auth)", "Asym Id", "Resid. Id"],
                  colNames: ['Molecule', 'Residue', 'Chain', 'Resid. Id'],
                  rows: [
                    {
                      molstarSelection: {
                        entityId: `${modification.entity_id}`,
                        authChainId: `${modification.chain_id}`,
                        residues: [
                          {
                            authBegin: `${modification.author_residue_number}`,
                            authBeginIns: `${modification.author_insertion_code}`,
                            authEnd: `${modification.author_residue_number}`,
                            authEndIns: `${modification.author_insertion_code}`,
                          },
                        ],
                      },
                      data: [
                        `${entityIdsToProteinNames[modification.entity_id]}`,
                        `${modification.chem_comp_id}`,
                        `${modification.chain_id}`,
                        `${modification.author_residue_number}${modification.author_insertion_code}`,
                        // `${modification.struct_asym_id}`,
                        // `${modification.residue_number}`
                      ],
                    },
                  ],
                },
                type: 'table',
                molstarInteractivity: true,
              },
              {
                value: '',
                type: 'kb-link',
                link: {
                  txt: `Learn more about ${modification.chem_comp_id} in PDBe-KB`,
                  src: `https://wwwdev.ebi.ac.uk/pdbe/connect/ligands/${modification.chem_comp_id}`,
                },
              },
            ],
          };
          if (modificationsImgs.indexOf(modificationObj.img) === -1) {
            modificationsNamesAndImgs.push(modificationObj);
            modificationsImgs.push(modificationObj.img);
          } else {
            modificationsNamesAndImgs[modificationsImgs.indexOf(modificationObj.img)].extraInfo[1].values!.rows.push({
              molstarSelection: {
                entityId: `${modification.entity_id}`,
                authChainId: `${modification.chain_id}`,
                residues: [
                  {
                    authBegin: `${modification.author_residue_number}`,
                    authBeginIns: `${modification.author_insertion_code}`,
                    authEnd: `${modification.author_residue_number}`,
                    authEndIns: `${modification.author_insertion_code}`,
                  },
                ],
              },
              data: [
                `${entityIdsToProteinNames[modification.entity_id]}`,
                `${modification.chem_comp_id}`,
                `${modification.chain_id}`,
                `${modification.author_residue_number}${modification.author_insertion_code}`,
                // `${modification.struct_asym_id}`,
                // `${modification.residue_number}`
              ],
            });
          }
        }
        return modificationsNamesAndImgs;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Handle 404 error specifically, e.g., return an empty array or a default value
          return of([]); // Returning an empty array as a fallback
        } else {
          // Handle other types of errors
          return of([]); // or you could throw an error or return a default value
        }
      })
    );
  }
}
