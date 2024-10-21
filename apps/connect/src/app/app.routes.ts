import { Route } from '@angular/router';
import { EntryMainPageComponent } from './projects/entry/pages/main/main.component';
import { ProteinsMainPageComponent } from './projects/proteins/pages/main/main.component';
import { EntryMainAltOnePageComponent } from './projects/entry/pages/main-alt-one/main-alt-one.component';
import { LigandWrapperComponent } from './projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component';
import { MainComponent } from './projects/complex/components/pages/main/main.component';
import { UnreleasedComponent } from './projects/ligands/components/pages/unreleased/unreleased.component';

export const appRoutes: Route[] = [
  { path: 'entry/:entryId', component: EntryMainPageComponent, title: 'PDBe Entry Pages' },
  { path: 'entry/alt-one/:entryId', component: EntryMainAltOnePageComponent, title: 'PDBe Entry Pages' },
  { path: 'proteins/:entryId', component: ProteinsMainPageComponent, title: 'PDBe Proteins Pages' },
  { path: 'complex/:complexId', component: MainComponent, title: 'Complex Pages' },
  { path: 'chemicalCompound/show/:ligandId', component: LigandWrapperComponent, title: 'PDBe Ligand Pages (PDBeChem)' },
  { path: 'chemicalCompound/show/:ligandId/unreleased', component: UnreleasedComponent, title: 'PDBe Ligand Pages (PDBeChem)' },
];
