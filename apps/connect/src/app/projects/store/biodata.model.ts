import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { LigandSummary } from '../ligands/data-models/description.model';
import { LigandStructure, Substructure } from '../ligands/data-models/structure.model';
import { DescriptionData } from '../ligands/services/aggregated-api.service';
import { RelatedLigand } from '../ligands/data-models/related-ligands.model';

export interface BiodataState {
  ligandId: string;
  structures: LigandStructure[];
  summary: LigandSummary;
  description: DescriptionData;
  downloadOptions: DownloadOption[];
  relatedLigands: RelatedLigand;
  supercomponents: string[];
  substructures: Substructure;
}
