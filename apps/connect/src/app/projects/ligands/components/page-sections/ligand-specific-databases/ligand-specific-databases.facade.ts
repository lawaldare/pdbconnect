import { inject, Injectable, signal } from '@angular/core';
import { CrossLink } from '../../../services/aggregated-api.service';
import { LigandUtilService } from '../../../ligand-util.service';
import { UtilService } from '@pdbc/core';
import { dataBaseOrder } from '../../../ligand.constant';

export interface MappedCrossLink {
  resource: string;
  resourceIds: string[];
  description?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LigandSpecificDatabasesComponentFacade {
  private readonly unwantedDatabases = ['actor', 'nih', 'rxnorm', 'dailymed', 'pdbe', 'atlas'];
  public crosslinks = signal<MappedCrossLink[]>([]);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly utilService = inject(UtilService);
  private unmappedCrossLinks = signal<CrossLink[]>([]);

  public init(crossLinks: CrossLink[]): void {
    this.unmappedCrossLinks.update(() => [...crossLinks]);
    const mappedLinks = crossLinks.reduce((acc: Record<string, string[]>, link: CrossLink) => {
      if (!this.unwantedDatabases.includes(link.resource.toLowerCase())) {
        if (acc[link.resource]) {
          acc[link.resource].push(link.resource_id);
        } else {
          acc[link.resource] = [link.resource_id];
        }
      }
      return acc;
    }, {} as Record<string, string[]>);

    const mappedLinksArray: MappedCrossLink[] = Object.entries(mappedLinks).map(([resource, resourceIds]) => ({ resource, resourceIds }));
    const sortedLinksArray = this.utilService.sortByArrayOrder(mappedLinksArray, dataBaseOrder);
    this.updateMappedLinks(sortedLinksArray);
  }

  private updateMappedLinks(crossLinks: MappedCrossLink[]): void {
    const updatedMappedLinksArray = crossLinks.map((mappedLink) => {
      switch (mappedLink.resource.toLocaleLowerCase()) {
        case 'bindingdb':
          return {
            ...mappedLink,
            description: 'A public database of measured binding affinities, focusing on drug-target interactions with small, drug-like molecules.',
            link: `https://www.bindingdb.org/bind/chemsearch/marvin/MolStructure.jsp?monomerid=`,
          };
        case 'brenda':
          return {
            ...mappedLink,
            description: 'A comprehensive enzyme information system containing enzyme functional data extracted directly from the primary literature.',
            link: `https://www.brenda-enzymes.org/ligand.php?brenda_ligand_id=`,
          };
        case 'chebi':
          return {
            ...mappedLink,
            description: 'A freely available dictionary of molecular entities focused on small chemical compounds.',
            link: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:`,
          };
        case 'chembl':
          return {
            ...mappedLink,
            description: 'A database of bioactive drug-like small molecules and bioactivities abstracted from the scientific literature.',
            link: `https://www.ebi.ac.uk/chembl/compound_report_card/`,
          };
        case 'chemicalbook':
          return {
            ...mappedLink,
            description: 'An online knowledge base of chemicals and a platform for Chinese domestic vendors in the chemical industry.',
            link: `https://www.chemicalbook.com/ChemicalProductProperty_EN_`,
          };
        case 'drugbank':
          return {
            ...mappedLink,
            description: 'A database combining chemical, pharmacological, and pharmaceutical drug data with drug target information.',
            link: `https://go.drugbank.com/drugs/`,
          };
        case 'drugcentral':
          return {
            ...mappedLink,
            description: 'An online drug information resource providing details on active ingredients, pharmaceutical products, and drug mode of action.',
            link: `https://drugcentral.org/drugcard/`,
          };
        case 'emolecules':
          return {
            ...mappedLink,
            description: 'A free chemical structure search engine containing millions of public domain structures.',
            link: `https://www.emolecules.com/cgi-bin/more?vid=`,
          };
        case 'epa comptox dashboard':
          return {
            ...mappedLink,
            description:
              'The EPA (Environmental Protection Agency) CompTox Dashboard provides access to data on over 700,000 chemicals for evaluating potential health risks. It offers chemical structures, experimental and predicted physicochemical and toxicity data, along with links to relevant resources. The dashboard supports chemical safety testing by mapping curated property data to corresponding chemical structures.',
            link: `https://comptox.epa.gov/dashboard/`,
          };
        case 'fdasrs':
          return {
            ...mappedLink,
            description: 'FDA/USP Substance Registration System (SRS) defines substances present in regulated products and assigns a unique UNII identifier.',
            link: `https://precision.fda.gov/uniisearch/srs/unii/`,
          };
        case 'guide to pharmacology':
          return {
            ...mappedLink,
            description: 'Contains structures of small molecule ligands, peptides, and antibodies with their affinities at protein targets.',
            link: `https://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=`,
          };
        case 'hmdb':
          return {
            ...mappedLink,
            description:
              'The Human Metabolome Database (HMDB) is a database containing detailed information about small molecule metabolites found in the human body, designed for metabolomics and biomarker discovery.',
            link: `http://www.hmdb.ca/metabolites/`,
          };
        case 'kegg ligand':
          return {
            ...mappedLink,
            description: 'A composite DB of compounds, glycans, reactions, and enzymes, identified by their respective numbers.',
            link: `https://www.genome.jp/dbget-bin/www_bget?`,
          };
        case 'lincs':
          return {
            ...mappedLink,
            description: 'LINCS (Library of Integrated Network-based Cellular Signatures) facilitates and standardizes information relevant to the LINCS assays.',
            link: `https://lincsportal.ccs.miami.edu/SmallMolecules/view/`,
          };
        case 'lipidmaps':
          return {
            ...mappedLink,
            description:
              'LIPID Metabolites And Pathways Strategy (LIPID MAPS) is a  multi-institutional effort to identify and quantify lipid species in mammalian cells using a systems biology approach.',
            link: `https://lipidmaps.org/databases/lmsd/`,
          };
        case 'mcule':
          return {
            ...mappedLink,
            description: 'An online drug discovery platform offering virtual screening and molecular modeling services.',
            link: `https://mcule.com/`,
          };
        case 'medchemexpress':
          return {
            ...mappedLink,
            description: 'A chemical supplier offering over 15,000 selective inhibitors and agonists.',
            link: `https://www.medchemexpress.com/`,
          };
        case 'metabolights':
          return {
            ...mappedLink,
            description: 'A database for metabolomics experiments, covering metabolite structures, biological roles, and reference spectra.',
            link: `https://www.ebi.ac.uk/metabolights/`,
          };
        case 'nikkaji':
          return {
            ...mappedLink,
            description:
              'Nikkaji (The Japan Chemical Substance Dictionary) is an organic compound dictionary database prepared by the Japan Science and Technology Agency (JST).',
            link: `https://jglobal.jst.go.jp/en/redirect?Nikkaji_No=`,
          };
        case 'nmrshiftdb':
          return {
            ...mappedLink,
            description:
              'An NMR database (web database) for organic structures and their nuclear magnetic resonance (nmr) spectra. It allows for spectrum prediction (13C, 1H and other nuclei) as well as for searching spectra, structures and other properties. Last not least, it features peer-reviewed submission of datasets by its users.',
            link: `http://www.nmrshiftdb.org/molecule/`,
          };
        case 'pharmgkb':
          return {
            ...mappedLink,
            description:
              'PharmGKB (Pharmacogenomics Knowledgebase) : A comprehensive resource curating knowledge about the impact of genetic variation on drug response.',
            link: `https://www.pharmgkb.org/chemical/`,
          };
        case 'probes and drugs':
          return {
            ...mappedLink,
            description: 'A resource providing data from the Probes and Drugs group at probes-drugs.org.',
            link: `https://www.probes-drugs.org/compound/`,
          };
        case 'pubchem':
          return {
            ...mappedLink,
            description: 'A database of normalized compounds and chemical structures from the PubChem database.',
            link: `https://pubchem.ncbi.nlm.nih.gov/compound/`,
          };
        case 'pubchem dotf':
          return {
            ...mappedLink,
            description: "A subset of the PubChem DB from the original depositor 'drugs of the future' (Prous).",
            link: `https://pubchem.ncbi.nlm.nih.gov/substance/`,
          };
        case 'pubchem tpharma':
          return {
            ...mappedLink,
            description: "A subset of the PubChem DB from the depositor 'Thomson Pharma'.",
            link: `https://pubchem.ncbi.nlm.nih.gov/substance/`,
          };
        case 'recon':
          return {
            ...mappedLink,
            description: 'A biochemical knowledge-base on human metabolism.',
            link: `https://www.vmh.life/#metabolite/`,
          };
        case 'rhea':
          return {
            ...mappedLink,
            description: 'An expert-curated resource of biochemical reactions for annotating enzymes and metabolic networks.',
            link: `https://www.rhea-db.org/rhea/?query=CHEBI:`,
          };
        case 'selleck':
          return {
            ...mappedLink,
            description: 'A supplier of biochemical products, including over 1,000 inhibitor products.',
            link: `https://www.selleckchem.com/products/`,
          };
        case 'surechembl':
          return {
            ...mappedLink,
            description: 'Automatically extracts chemistry from patents of major authorities, generating chemical depictions from text.',
            link: `https://www.surechembl.org/chemical/`,
          };
        case 'swisslipids':
          return {
            ...mappedLink,
            description: 'An expert-curated resource integrating lipid and lipidomic data with biological knowledge and models.',
            link: `https://www.swisslipids.org/#/entity/SLM`,
          };
        case 'zinc':
          return {
            ...mappedLink,
            description: 'A free database of commercially-available compounds for virtual screening, provided by the Shoichet Laboratory at UCSF.',
            link: `https://zinc15.docking.org/substances/`,
          };
        case 'clinicaltrials':
          return {
            ...mappedLink,
            description: 'A database of privately and publicly funded clinical studies conducted around the world.',
            link: `https://www.clinicaltrials.gov/search?term=`,
          };
        case 'ccdc':
          return {
            ...mappedLink,
            description: 'CSD structures from the Cambridge Crystallographic Data Centre',
            link: `https://www.ccdc.cam.ac.uk/structures/search?sid=UNICHEM&pid=csd:`,
          };
        default:
          return mappedLink;
      }
    });
    this.crosslinks.update(() => updatedMappedLinksArray);
  }

  public downloadJSON(): void {
    this.ligandUtilService.downloadJSON(this.unmappedCrossLinks(), 'crosslinks');
  }
}
