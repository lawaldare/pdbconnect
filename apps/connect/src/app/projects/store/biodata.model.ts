import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { LigandSummary } from '../ligands/data-models/description.model';
import { LigandStructure } from '../ligands/data-models/structure.model';
import { DescriptionData } from '../ligands/services/aggregated-api.service';

export interface BiodataState {
  ligandId: string;
  structures: LigandStructure[];
  summary: LigandSummary;
  description: DescriptionData;
  downloadOptions: DownloadOption[];
}
