import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'entry/pdb/:entryId',
    loadComponent: () => import('./projects/entry/pages/main/main.component').then((m) => m.EntryMainPageComponent),
    title: 'PDBe Entry Pages',
  },
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
