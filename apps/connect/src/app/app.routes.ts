import { Route } from '@angular/router';
import { EntryMainPageComponent } from './projects/entry/pages/main/main.component';
import { LigandsMainPageComponent } from './projects/ligands/pages/main/main.component';
import { ProteinsMainPageComponent } from './projects/proteins/pages/main/main.component';

export const appRoutes: Route[] = [
  { path: 'pdbe/:entryId', component: EntryMainPageComponent, title: 'PDBe Entry Pages' },
  { path: 'proteins/:entryId', component: ProteinsMainPageComponent, title: 'PDBe Proteins Pages' },
  { path: 'ligands/:entryId', component: LigandsMainPageComponent, title: 'PDBe Ligand Pages' },
];
