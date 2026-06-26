import { Route } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const appRoutes: Route[] = [
  {
    path: 'show/:ligandId',
    loadComponent: () => import('./components/pages/main/main.component').then((m) => m.LigandsMainPageComponent),
    title: 'PDBe-KB Ligand Pages (PDBeChem)',
  },
  { path: 'error', component: ErrorPageComponent, title: 'Error Page' },

  { path: '**', redirectTo: 'error' },
];
