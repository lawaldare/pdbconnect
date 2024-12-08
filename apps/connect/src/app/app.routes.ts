import { Route } from '@angular/router';
import { LigandWrapperComponent } from './projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component';
import { MainComponent } from './projects/complex/components/pages/main/main.component';

export const appRoutes: Route[] = [
  // { path: '', component: LigandHomepageComponent, title: 'PDBe Knowledge base' },
  // { path: 'latest-releases', component: LatestReleasesComponent, title: 'PDBe Knowledge base' },
  // { path: 'entry/:entryId', component: EntryMainPageComponent, title: 'PDBe Entry Pages' },
  // { path: 'entry/alt-one/:entryId', component: EntryMainAltOnePageComponent, title: 'PDBe Entry Pages' },
  // { path: 'proteins/:entryId', component: ProteinsMainPageComponent, title: 'PDBe Proteins Pages' },
  { path: 'complex/:complexId', component: MainComponent, title: 'Complex Pages' },
  { path: 'chemicalCompound/show/:ligandId', component: LigandWrapperComponent, title: 'PDBe Ligand Pages (PDBeChem)' },
  // { path: '**', redirectTo: '', pathMatch: 'full' },
];
