import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PisaActions = createActionGroup({
  source: 'Pisa App',
  events: {
    'Submit PISA Job': props<{ payload: any }>(),
    'Submit PISA Job Success': props<{ jobId: string }>(),
    'Submit PISA Job Failure': emptyProps(),
    // 'Set Assembly Parameters': props<{ params: PISAAssemblyParam }>(),
    // 'Set Assembly Parameters Success': emptyProps(),
    // 'Set Assembly Parameters Failure': emptyProps(),
    'Set Job ID': props<{ jobId: string }>(),
    'Set Selected Complex Data On Complexes Tab': props<{ selectedComplexData: any }>(),
    'Get Assembly Result For JobId': emptyProps(),
    'Get Assembly Result For JobId Success': props<{ assemblyResults: any }>(),
    'Get Assembly Result For JobId Failure': emptyProps(),
    'Get Interface Result For InterfaceId': props<{ interfaceId: string }>(),
    'Get Interface Result For InterfaceId Success': props<{ interfaceResultForInterfaceId: any }>(),
    'Get Interface Result For InterfaceId Failure': emptyProps(),
  },
});
