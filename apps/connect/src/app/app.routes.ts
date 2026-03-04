import { Route } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { complexIdGuard } from './projects/complex/guards/complex.guard';
import { TabRedirectComponent } from './projects/entry/redirects/all-redirects.component';
import { SearchPageComponent } from './projects/entry/pages/search/search-page.component';
import { ExternalRedirectComponent } from './projects/entry/redirects/external-redirect.component';
import { SearchAppContainerComponent } from './projects/search-app/search-app-container/search-app-container.component';

// const hostname = document.location.hostname;
// const isLocal = hostname === 'localhost';

export const appRoutes: Route[] = [
  {
    path: 'search/index',
    component: SearchAppContainerComponent,
    title: 'Search the PDB Archive < PDBe < EMBL-EBI',
  },
  {
    path: 'pdb/:entryId/index',
    redirectTo: 'pdb/:entryId',
    pathMatch: 'full',
  },
  /**
   * Redirection patches to main page
   */
  {
    path: 'pdb',
    component: ExternalRedirectComponent,
    pathMatch: 'full',
  },
  {
    path: 'pdb/',
    component: ExternalRedirectComponent,
    pathMatch: 'full',
  },
  /**
   * Redirection patches until Google search updates
   */
  {
    path: 'pdb/:entryId/biology',
    redirectTo: 'pdb/:entryId',
    pathMatch: 'full',
  },
  {
    path: 'pdb/:entryId/portfolio',
    component: TabRedirectComponent,
    data: { activeTab: 'summary' },
  },
  {
    path: 'pdb/:entryId/citations',
    component: TabRedirectComponent,
    data: { activeTab: 'citations' },
  },
  {
    path: 'pdb/:entryId/experiment',
    component: TabRedirectComponent,
    data: { activeTab: 'model-quality' },
  },
  {
    path: 'pdb/:entryId/analysis',
    component: TabRedirectComponent,
    data: { activeTab: 'macromolecules' },
  },
  /**
   * Redirection patches until we have routes for these two
   */
  {
    path: 'pdb/:entryId/protein/:entityId',
    component: TabRedirectComponent,
    data: { activeTab: 'macromolecules' },
  },
  {
    path: 'pdb/:entryId/bound/:boundId',
    component: TabRedirectComponent,
    data: { activeTab: 'ligands' },
  },
  {
    path: 'pdb/:entryId/modified/:boundId',
    component: TabRedirectComponent,
    data: { activeTab: 'ligands' },
  },
  {
    path: 'pdb/:entryId',
    loadComponent: () => import('./projects/entry/pages/main/main.component').then((m) => m.EntryMainPageComponent),
    title: 'PDBe Entry Pages',
  },
  {
    path: 'pdb/:entryId/3d',
    loadComponent: () => import('./projects/entry/pages/3d/molstar-3d.component').then((m) => m.Entry3DPageComponent),
    title: 'PDBe Entry Pages - Molstar',
  },
  {
    path: 'view3D/:entryId',
    loadComponent: () => import('./projects/entry/pages/3d/molstar-3d.component').then((m) => m.Entry3DPageComponent),
    title: 'PDBe Entry Pages - Molstar',
  },
  {
    path: 'view3D/:entryId/:rest',
    loadComponent: () => import('./projects/entry/pages/3d/molstar-3d.component').then((m) => m.Entry3DPageComponent),
    title: 'PDBe Entry Pages - Molstar',
  },
  {
    path: 'chemicalCompound/show/:ligandId',
    loadComponent: () => import('./projects/ligands/components/pages/main/main.component').then((m) => m.LigandsMainPageComponent),
    title: 'PDBe-KB Ligand Pages (PDBeChem)',
  },
  { path: 'error', component: ErrorPageComponent, title: 'Error Page' },
  {
    path: 'complexes/:complexId',
    loadComponent: () => import('./projects/complex/components/pages/main/main.component').then((m) => m.MainComponent),
    title: 'Complex Pages',
    canActivate: [complexIdGuard],
  },

  { path: '**', redirectTo: 'error' },
];
