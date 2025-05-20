import { Route } from '@angular/router';
import { environment } from '../environments/environment';
import { ErrorPageComponent } from './error-page/error-page.component';
import { localComplexMatcher } from './error-page/local-complex-matcher';
import { LocalComplexRedirectComponent } from './projects/complex/components/pages/local-complex-redirect.component';

const entryPath = environment.isLocal ? 'pdb/:entryId' : 'entry/pdb/:entryId';
const complexPath = environment.isLocal ? ':complexId' : 'complex/:complexId';

export const appRoutes: Route[] = [
  // ...(environment.isLocal
  //   ? [
  //       {
  //         matcher: localComplexMatcher,
  //         component: LocalComplexRedirectComponent,
  //       },
  //     ]
  //   : []),
  {
    path: entryPath,
    loadComponent: () => import('./projects/entry/pages/main/main.component').then((m) => m.EntryMainPageComponent),
    title: 'PDBe Entry Pages',
  },
  {
    path: complexPath,
    loadComponent: () => import('./projects/complex/components/pages/main/main.component').then((m) => m.MainComponent),
    title: 'Complex Pages',
  },
  {
    path: 'chemicalCompound/show/:ligandId',
    loadComponent: () => import('./projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component').then((m) => m.LigandWrapperComponent),
    title: 'PDBe-KB Ligand Pages (PDBeChem)',
  },
  { path: 'error', component: ErrorPageComponent, title: 'Error Page' },
  { path: '**', redirectTo: 'error' }, // Always have a fallback route
];
