import { Route } from '@angular/router';
import { environment } from '../environments/environment';
import { ErrorPageComponent } from './error-page/error-page.component';
import { complexIdGuard } from './projects/complex/guards/complex.guard';

export const appRoutes: Route[] = [
  {
    path: environment.isLocal ? 'pdb/:entryId' : 'entry/pdb/:entryId',
    loadComponent: () => import('./projects/entry/pages/main/main.component').then((m) => m.EntryMainPageComponent),
    title: 'PDBe Entry Pages',
  },
  {
    path: 'chemicalCompound/show/:ligandId',
    loadComponent: () => import('./projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component').then((m) => m.LigandWrapperComponent),
    title: 'PDBe-KB Ligand Pages (PDBeChem)',
  },
  {
    path: environment.isLocal ? ':complexId' : 'complex/:complexId',
    loadComponent: () => import('./projects/complex/components/pages/main/main.component').then((m) => m.MainComponent),
    title: 'Complex Pages',
    canActivate: [complexIdGuard],
  },
  { path: 'error', component: ErrorPageComponent, title: 'Error Page' },
  // { path: '**', redirectTo: 'error' },
];
