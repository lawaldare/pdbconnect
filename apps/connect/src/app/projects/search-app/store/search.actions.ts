import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SearchAppActions = createActionGroup({
  source: 'Search App Page',
  events: {
    'Set Current PdbIds': props<{ pdbIds: string }>(),
    'Get Molecules': emptyProps(),
    'Get Molecules Success': props<{ moleculesResponse: any }>(),
    'Get Molecules Failure': emptyProps(),
  },
});
