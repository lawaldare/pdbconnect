import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { LigandSummary } from '../data-models/description.model';
import { Fragment, LigandStructure, Polymer } from '../data-models/structure.model';
import { DescriptionData } from '../services/aggregated-api.service';
import { RelatedLigand } from '../data-models/related-ligands.model';
import { NavSection } from '@pdbc/core';

export interface LigandStoreState {
  ligandId: string;
  structures: LigandStructure[];
  summary: LigandSummary;
  description: DescriptionData;
  downloadOptions: DownloadOption[];
  relatedLigands: RelatedLigand;
  supercomponents: string[];
  loadingState: string;
  emptyPageText: string;
  fragments: Fragment[];
  navItems: NavSection[];
  polymers: Polymer[];
  numberOfProteins: number;
  numberOfPDBStructures: number;
  numberOfLigandInstances: number;
  mdpositInchikeys: string[];
}
