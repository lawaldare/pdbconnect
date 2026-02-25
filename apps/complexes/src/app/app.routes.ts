import { Route } from '@angular/router';
import { complexIdGuard } from './guards/complex.guard';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const appRoutes: Route[] = [
  {
    path: ':complexId',
    loadComponent: () => import('./components/pages/main/main.component').then((m) => m.MainComponent),
    title: 'Complex Pages',
    canActivate: [complexIdGuard],
  },

  { path: 'error', component: ErrorPageComponent, title: 'Error Page' },

  { path: '**', redirectTo: 'error' },
];
