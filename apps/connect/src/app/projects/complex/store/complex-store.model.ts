import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { ComplexLigand } from '../components/page-sections/complex-ligands/complex-ligands.component';
import { PISAAssemblyParam } from '../components/page-sections/complex-pisa/complex-pisa.component';

export interface ComplexStoreState {
  complexId: string;
  complexData: ComplexData;
  loadingState: string;
  complexLigands: ComplexLigand[];
  subComplexInteractions: ComplexInteraction[];
  superComplexInteractions: ComplexInteraction[];
  pisa: PISAAssemblyParam[];
}
