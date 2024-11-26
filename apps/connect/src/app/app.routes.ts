import { Route } from '@angular/router';
import { LigandWrapperComponent } from './projects/ligands/components/pages/ligand-wrapper/ligand-wrapper.component';

export const appRoutes: Route[] = [{ path: 'chemicalCompound/show/:ligandId', component: LigandWrapperComponent, title: 'PDBe Ligand Pages (PDBeChem)' }];
