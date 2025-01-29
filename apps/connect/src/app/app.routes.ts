import { Route } from '@angular/router';
// import { LigandHomepageComponent } from './projects/ligands/components/pages/ligand-homepage/ligand-homepage.component';
// import { LatestReleasesComponent } from './projects/ligands/components/pages/latest-releases/latest-releases.component';

export const appRoutes: Route[] = [
  // { path: '', component: LigandHomepageComponent, title: 'PDBe Knowledge base' },
  // { path: 'latest-releases', component: LatestReleasesComponent, title: 'PDBe Knowledge base' },
  {
    path: 'entry/pdb/:entryId',
    loadComponent: () => import('./projects/entry/pages/main/main.component').then((m) => m.EntryMainPageComponent),
    title: 'PDBe Entry Pages',
  },
  // { path: 'proteins/:entryId', component: ProteinsMainPageComponent, title: 'PDBe Proteins Pages' },
  {
    path: 'complex/:complexId',
    loadComponent: () => import('./projects/complex/components/pages/main/main.component').then((m) => m.MainComponent),
    title: 'Complex Pages',
  },
  {
    path: 'chemicalCompound/show/:ligandId',
    loadComponent: () => import('./projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component').then((m) => m.LigandWrapperComponent),
    title: 'PDBe-KB Ligand Pages (PDBeChem)',
  },
  // { path: '**', redirectTo: '', pathMatch: 'full' },
];
