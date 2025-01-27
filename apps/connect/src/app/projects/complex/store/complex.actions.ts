import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { NavSection } from '@pdbc/core';
import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { ComplexLigand } from '../components/page-sections/complex-ligands/complex-ligands.component';

export const ComplexActions = createActionGroup({
  source: 'Ligands Page',
  events: {
    'Get ComplexData': emptyProps(),
    'Get ComplexData Success': props<{ complexData: ComplexData }>(),
    'Get ComplexData Failure': emptyProps(),
    'Get Ligands For Complexes': emptyProps(),
    'Get Ligands For Complexes Success': props<{ complexLigands: ComplexLigand[] }>(),
    'Get Ligands For Complexes Failure': emptyProps(),
    'Get ComplexInteractions': emptyProps(),
    'Get ComplexInteractions Success': props<{ subComplexInteractions: ComplexInteraction[]; superComplexInteractions: ComplexInteraction[] }>(),
    'Get ComplexInteractions Failure': emptyProps(),
    'Set Current ComplexId': props<{ complexId: string }>(),
    'Set Nav Items': props<{ navItems: NavSection[] }>(),
    'Toggle Loader': props<{ status: string }>(),
  },
});
