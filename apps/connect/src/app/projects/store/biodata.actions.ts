import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LigandStructure } from '../ligands/data-models/structure.model';
import { LigandSummary } from '../ligands/data-models/description.model';
import { DescriptionData } from '../ligands/services/aggregated-api.service';

export const BiodataActions = createActionGroup({
  source: 'Ligands Page',
  events: {
    'Get Structures': emptyProps(),
    'Get Structures Success': props<{ structures: LigandStructure[] }>(),
    'Get Structures Failure': emptyProps(),
    'Set Current LigandId': props<{ ligandId: string }>(),
    'Get Summary': emptyProps(),
    'Get Summary Success': props<{ summary: LigandSummary }>(),
    'Get Summary Failure': emptyProps(),
    'Set Description': props<{ description: DescriptionData }>(),
    'Set Download Options': emptyProps(),
  },
});
