import { Route } from '@angular/router';
import { EntryMainPageComponent } from './projects/entry/pages/main/main.component';
import { LigandsMainPageComponent } from './projects/ligands/pages/main/main.component';
import { ProteinsMainPageComponent } from './projects/proteins/pages/main/main.component';

export const appRoutes: Route[] = [
  { path: 'pdbe/entry/pdb/:entryId', component: EntryMainPageComponent, title: 'PDBe Entry Pages' },
  { path: 'pdbe/pdbe-kb/proteins/:entryId', component: ProteinsMainPageComponent, title: 'PDBe Proteins Pages' },
  { path: 'pdbe/pdbe-kb/ligands/:entryId', component: LigandsMainPageComponent, title: 'PDBe Ligand Pages' },
];
