import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { environment } from '../../../../../environments/environment';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { otherResourcesTooltips } from '../../entry-constant';

const removeEmpty = (obj: any) => (obj ? (({ empty, ...rest }) => rest)(obj) : obj);

@Component({
  selector: 'pdbc-other-resources-tab',
  standalone: true,
  imports: [CommonModule, HelpIconWithTooltipComponent],
  templateUrl: './other-resources-tab.component.html',
  styleUrl: './other-resources-tab.component.scss',
})
export class OtherResourcesTabComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly hasMDDB = toSignal(this.globalStore.select(EntrySelectors.hasMDDB));

  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly ligandMonomers = toSignal(this.globalStore.select(EntrySelectors.ligandMonomers));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly experimentRawDataBMRB = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataBMRB));
  public readonly experimentRawDataIRRMC = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataIRRMC));
  public readonly experimentRawDataEMPIAR = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataEMPIAR));
  public readonly experimentRawDataSBGrid = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataSBGrid));

  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scop175Mappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly interproMappings = toSignal(this.globalStore.select(EntrySelectors.interproMapping));
  public readonly rfamMappings = toSignal(this.globalStore.select(EntrySelectors.rfamMapping));

  public readonly goMappings = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMappings = toSignal(this.globalStore.select(EntrySelectors.ecMapping));

  private otherResourcesTooltips = otherResourcesTooltips;

  public resourceCategories = signal([
    'Show all',
    'Related PDBe resources',
    'Protein dynamics',
    '3D structure databases',
    'Sequence databases',
    'Family and domain databases',
    'Functional annotation',
    'Other resources',
  ]);

  public currentCategory = signal('Show all');

  public currentResourceCategories = computed(() => {
    const category = this.currentCategory();
    if (category === 'Show all') {
      return [...this.resourceCategories().filter((cat) => cat !== 'Show all')];
    } else {
      return [...this.resourceCategories().filter((cat) => cat === category)];
    }
  });

  public switchResourceCategory(category: string) {
    this.currentCategory.set(category);
  }

  public expandedLinkGroups = signal<Record<string, boolean>>({});

  public toggleLinkGroup(key: string): void {
    this.expandedLinkGroups.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  public isLinkGroupExpanded(key: string): boolean {
    return !!this.expandedLinkGroups()[key];
  }

  public resourceCategoriesLinksAndStatus = computed(() => {
    const resourceCategoriesLinksAndStatus: Record<
      string,
      {
        done: boolean;
        links: {
          name: string;
          tooltip: string;
          urls: {
            urlName: string;
            url: string;
            extra?: string;
          }[];
        }[];
      }
    > = {};

    for (const cat of this.resourceCategories()) {
      resourceCategoriesLinksAndStatus[cat] = { done: false, links: [] };
    }

    /**
     * 1. Related PDBe resources
     */

    resourceCategoriesLinksAndStatus['Related PDBe resources'] = {
      done: true,
      links: [
        {
          name: 'PDBe API Endpoints',
          tooltip: this.otherResourcesTooltips['PDBe API Endpoints'],
          urls: [
            {
              urlName: 'go to page',
              url: `${environment.baseUrl}pdbe/api/v2/doc/`,
            },
          ],
        },
        {
          name: 'PDBe GitHub',
          tooltip: this.otherResourcesTooltips['PDBe GitHub'],
          urls: [
            {
              urlName: 'go to page',
              url: `https://github.com/PDBeurope/`,
            },
          ],
        },
        {
          name: 'PDBe Hugging Face',
          tooltip: this.otherResourcesTooltips['PDBe Hugging Face'],
          urls: [
            {
              urlName: 'go to page',
              url: `https://huggingface.co/PDBEurope`,
            },
          ],
        },
      ],
    };

    /**
     * 2. Protein Dynamics
     */

    const hasMDDB = this.hasMDDB();
    resourceCategoriesLinksAndStatus['Protein dynamics'] = {
      done: hasMDDB !== undefined,
      links: hasMDDB
        ? [
            {
              name: 'MDposit',
              tooltip: this.otherResourcesTooltips['MDposit'],
              urls: [
                {
                  urlName: `${this.entryId()?.toUpperCase()}`,
                  url: `https://mdposit-dev.mddbr.eu/#/pointer?ref=pdbs&id=${this.entryId()?.toUpperCase()}`,
                },
              ],
            },
          ]
        : [],
    };

    /**
     * 3. 3D structure databases
     */

    const primaryPublication = this.primaryPublication();
    let uniprotMappings = this.uniprotMappings();
    uniprotMappings = removeEmpty(uniprotMappings);
    let ligandMonomers = this.ligandMonomers();
    if (ligandMonomers && (ligandMonomers as any).empty === true) {
      ligandMonomers = [];
    }
    let complexDetails = this.complexDetails();
    if (complexDetails && (complexDetails as any).empty === true) {
      complexDetails = [];
    }
    const pdbRedoData = this.pdbRedoData();

    const experimentRawDataBMRB = this.experimentRawDataBMRB();
    const experimentRawDataIRRMC = this.experimentRawDataIRRMC();
    const experimentRawDataEMPIAR = this.experimentRawDataEMPIAR();
    const experimentRawDataSBGrid = this.experimentRawDataSBGrid();

    resourceCategoriesLinksAndStatus['3D structure databases'].done =
      uniprotMappings !== undefined &&
      primaryPublication !== undefined &&
      ligandMonomers !== undefined &&
      complexDetails !== undefined &&
      pdbRedoData !== undefined &&
      experimentRawDataBMRB !== undefined &&
      experimentRawDataIRRMC !== undefined &&
      experimentRawDataEMPIAR !== undefined &&
      experimentRawDataSBGrid !== undefined;

    const relatedEntries = primaryPublication?.associated_entries ? primaryPublication.associated_entries.split(',').map((entry) => entry.trim()) : [];
    const uniprotIds = uniprotMappings ? Object.keys(uniprotMappings) : [];
    const uniqueLigandIds = ligandMonomers ? Array.from(new Set(ligandMonomers.map((ligand) => ligand.chem_comp_id))) : [];
    const uniqueComplexIds = complexDetails ? Array.from(new Set(complexDetails.map((complex) => complex.pdb_complex_id))) : [];
    // const uniqueComplexPortalIds = complexDetails
    //   ? Array.from(new Set(complexDetails.map((complex) => complex.complex_portal_id).filter((id): id is string => !!id)))
    //   : [];
    const emdbIds = this.summary()?.relatedStructures;

    if (relatedEntries.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'Related entries',
        tooltip: this.otherResourcesTooltips['Related entries'],
        urls: relatedEntries.map((entry) => ({
          urlName: `pdb_0000${entry}`,
          url: `${environment.baseUrl}pdbe/entry/${entry}`,
        })),
      });
    }

    if (uniprotIds.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'PDBe-KB Proteins',
        tooltip: this.otherResourcesTooltips['PDBe-KB Proteins'],
        urls: uniprotIds.map((id) => ({
          urlName: id,
          url: `${environment.baseUrl}pdbe/pdbe-kb/proteins/${id}`,
        })),
      });
    }

    if (uniqueLigandIds.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'PDBe-KB Ligands',
        tooltip: this.otherResourcesTooltips['PDBe-KB Ligands'],
        urls: uniqueLigandIds.map((id) => ({
          urlName: id,
          url: `${environment.baseUrl}pdbe-srv/pdbechem/chemicalCompound/show/${id}`,
        })),
      });
    }

    if (uniqueComplexIds.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'PDBe-KB Complexes',
        tooltip: this.otherResourcesTooltips['PDBe-KB Complexes'],
        urls: uniqueComplexIds.map((id) => ({
          urlName: id,
          url: `${environment.baseUrl}pdbe/pdbe-kb/complexes/${id}`,
        })),
      });
    }

    if (uniprotIds.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'AlphaFold DB',
        tooltip: this.otherResourcesTooltips['AlphaFold DB'],
        urls: uniprotIds.map((id) => ({
          urlName: `AF-${id}-F1`,
          url: `https://alphafold.ebi.ac.uk/entry/AF-${id}-F1`,
        })),
      });
    }

    resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
      name: 'wwPDB',
      tooltip: this.otherResourcesTooltips['wwPDB'],
      urls: [
        {
          urlName: `pdb_0000${this.entryId()} in wwPDB`,
          url: `https://www.wwpdb.org/pdb?id=pdb_0000${this.entryId()}`,
        },
      ],
    });

    resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
      name: 'PDBj',
      tooltip: this.otherResourcesTooltips['PDBj'],
      urls: [
        {
          urlName: `pdb_0000${this.entryId()} in PDBj`,
          url: `https://pdbj.org/mine/summary/${this.entryId()}`,
        },
      ],
    });

    resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
      name: 'RCSB PDB',
      tooltip: this.otherResourcesTooltips['RCSB PDB'],
      urls: [
        {
          urlName: `pdb_0000${this.entryId()} in RCSB`,
          url: `https://rcsb.org/structure/${this.entryId()}`,
        },
      ],
    });

    if (emdbIds && emdbIds.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'EMDB',
        tooltip: this.otherResourcesTooltips['EMDB'],
        urls: emdbIds.map((structure) => ({
          urlName: structure.accession,
          url: `https://www.ebi.ac.uk/emdb/${structure.accession}`,
        })),
      });
    }

    if (pdbRedoData && Object.keys(pdbRedoData).length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'PDB-REDO',
        tooltip: this.otherResourcesTooltips['PDB-REDO'],
        urls: [
          {
            urlName: `pdb_0000${this.entryId()} in PDB-REDO`,
            url: `https://pdb-redo.eu/db/${this.entryId()}`,
          },
        ],
      });
    }

    if (experimentRawDataEMPIAR && experimentRawDataEMPIAR.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'EMPIAR',
        tooltip: this.otherResourcesTooltips['EMPIAR'],
        urls: experimentRawDataEMPIAR.map((dataset: any) => ({
          urlName: dataset.name,
          url: `https://www.ebi.ac.uk/empiar/${dataset.name}`,
        })),
      });
    }

    if (experimentRawDataBMRB && experimentRawDataBMRB.length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'BMRB',
        tooltip: this.otherResourcesTooltips['BMRB'],
        urls: experimentRawDataBMRB.map((dataset: any) => ({
          urlName: dataset.bmrb_id,
          url: dataset.url,
        })),
      });
    }

    if (experimentRawDataIRRMC && Object.keys(experimentRawDataIRRMC).length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'IRRMC 2.0',
        tooltip: this.otherResourcesTooltips['IRRMC'],
        urls: [
          {
            urlName: `${experimentRawDataIRRMC.name}`,
            url: `https://proteindiffraction.org/project/${experimentRawDataIRRMC.name}`,
          },
        ],
      });
    }

    if (experimentRawDataSBGrid && Object.keys(experimentRawDataSBGrid).length > 0) {
      resourceCategoriesLinksAndStatus['3D structure databases'].links.push({
        name: 'SBGrid',
        tooltip: this.otherResourcesTooltips['SBGrid'],
        urls: experimentRawDataSBGrid.datasets.map((dataset: any) => ({
          urlName: dataset.data_doi,
          url: `${dataset.landing_page}`,
        })),
      });
    }

    // TODO: BMRB, EMPIAR, IRRMC, SBGrid

    /**
     * 4. Sequence databases
     */

    resourceCategoriesLinksAndStatus['Sequence databases'].done = uniprotMappings !== undefined;
    if (uniprotIds.length > 0) {
      resourceCategoriesLinksAndStatus['Sequence databases'].links.push({
        name: 'UniProt',
        tooltip: this.otherResourcesTooltips['UniProt'],
        urls: uniprotIds.map((id) => ({
          urlName: id,
          url: `https://www.uniprot.org/uniprot/${id}`,
        })),
      });
    }

    /**
     * 5. Family and domain databases
     */

    let pfamMappings = this.pfamMappings();
    let cathMappings = this.cathMappings();
    let scop175Mappings = this.scop175Mappings();
    let interproMappings = this.interproMappings();
    let rfamMappings = this.rfamMappings();

    // remove empty keys (in case of 404 responses)
    pfamMappings = removeEmpty(pfamMappings);
    cathMappings = removeEmpty(cathMappings);
    scop175Mappings = removeEmpty(scop175Mappings);
    interproMappings = removeEmpty(interproMappings);
    rfamMappings = removeEmpty(rfamMappings);

    resourceCategoriesLinksAndStatus['Family and domain databases'].done =
      pfamMappings !== undefined && cathMappings !== undefined && scop175Mappings !== undefined && interproMappings !== undefined;
    const pfamKeys = pfamMappings ? Object.keys(pfamMappings) : [];
    const cathKeys = cathMappings ? Object.keys(cathMappings) : [];
    const scop175Keys = scop175Mappings ? Object.keys(scop175Mappings) : [];
    const interproKeys = interproMappings ? Object.keys(interproMappings) : [];
    const rfamKeys = rfamMappings ? Object.keys(rfamMappings) : [];

    if (cathKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Family and domain databases'].links.push({
        name: 'CATH',
        tooltip: this.otherResourcesTooltips['CATH'],
        urls: cathKeys.map((key) => ({
          urlName: key,
          url: `https://www.cathdb.info/version/latest/superfamily/${key}`,
        })),
      });
    }

    if (scop175Keys.length > 0) {
      resourceCategoriesLinksAndStatus['Family and domain databases'].links.push({
        name: 'SCOP 1.75',
        tooltip: this.otherResourcesTooltips['SCOP'],
        urls: scop175Keys.map((key) => ({
          urlName: key,
          url: `https://scop.berkeley.edu/domain/${key}`,
        })),
      });
    }

    if (pfamKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Family and domain databases'].links.push({
        name: 'Pfam',
        tooltip: this.otherResourcesTooltips['Pfam'],
        urls: pfamKeys.map((key) => ({
          urlName: key,
          url: `https://www.ebi.ac.uk/interpro/entry/pfam/${key}`,
        })),
      });
    }

    if (interproKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Family and domain databases'].links.push({
        name: 'InterPro',
        tooltip: this.otherResourcesTooltips['InterPro'],
        urls: interproKeys.map((key) => ({
          urlName: key,
          url: `https://www.ebi.ac.uk/interpro/entry/InterPro/${key}`,
        })),
      });
    }

    if (rfamKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Family and domain databases'].links.push({
        name: 'Rfam',
        tooltip: this.otherResourcesTooltips['Rfam'],
        urls: rfamKeys.map((key) => ({
          urlName: key,
          url: `https://rfam.org/family/${key}`,
        })),
      });
    }

    /**
     * 6. Functional annotation
     */

    let goMappings = this.goMappings();
    let ecMappings = this.ecMappings();

    // remove empty keys (in case of 404 responses)
    goMappings = removeEmpty(goMappings);
    ecMappings = removeEmpty(ecMappings);

    resourceCategoriesLinksAndStatus['Functional annotation'].done = goMappings !== undefined && ecMappings !== undefined;
    const goKeys = goMappings ? Object.keys(goMappings) : [];
    const ecKeys = ecMappings ? Object.keys(ecMappings) : [];
    const goCategories = Object.entries(goMappings ?? {}).map(([key, value]) => value.category);

    if (goKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Functional annotation'].links.push({
        name: 'Gene Ontology (GO)',
        tooltip: this.otherResourcesTooltips['Gene Ontology'],
        urls: goKeys.map((key, i) => ({
          urlName: key,
          url: `https://www.ebi.ac.uk/QuickGO/term/${key}`,
          extra: goCategories[i].replace('_', ' '),
        })),
      });
    }

    if (ecKeys.length > 0) {
      resourceCategoriesLinksAndStatus['Functional annotation'].links.push({
        name: 'ENZYME (EC)',
        tooltip: this.otherResourcesTooltips['ENZYME'],
        urls: ecKeys.map((key) => ({
          urlName: key,
          url: `https://enzyme.expasy.org/EC/${key}`,
        })),
      });
    }

    /**
     * 7. Other resources
     */

    const primaryPubMed = primaryPublication?.pubmed_id;
    resourceCategoriesLinksAndStatus['Other resources'].done = primaryPublication !== undefined;
    if (primaryPublication && primaryPubMed) {
      resourceCategoriesLinksAndStatus['Other resources'].links.push({
        name: 'EuropePMC',
        tooltip: this.otherResourcesTooltips['EuropePMC'],
        urls: primaryPubMed
          ? [
              {
                urlName: 'go to page',
                url: `https://europepmc.org/article/MED/${primaryPubMed}/`,
              },
            ]
          : [],
      });
    }

    if (this.entryId()) {
      resourceCategoriesLinksAndStatus['Other resources'].links.push({
        name: 'Proteopedia',
        tooltip: this.otherResourcesTooltips['Proteopedia'],
        urls: [
          {
            urlName: `pdb_0000${this.entryId()} in Proteopedia`,
            url: `https://proteopedia.org/w/${this.entryId()}`,
          },
        ],
      });
    }

    return resourceCategoriesLinksAndStatus;
  });
}
