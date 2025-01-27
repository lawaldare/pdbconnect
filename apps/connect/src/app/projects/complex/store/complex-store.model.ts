import { NavSection } from '@pdbc/core';
import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { ComplexLigand } from '../components/page-sections/complex-ligands/complex-ligands.component';

export interface ComplexStoreState {
  complexId: string;
  complexData: ComplexData;
  navItems: NavSection[];
  loadingState: string;
  complexLigands: ComplexLigand[];
  subComplexInteractions: ComplexInteraction[];
  superComplexInteractions: ComplexInteraction[];
}
