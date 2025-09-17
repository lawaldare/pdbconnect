import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { ComplexLigand } from '../models/complex-ligands.model';
import { PISAAssemblyParam } from '../models/pisa-assembly-param.model';

export interface ComplexStoreState {
  complexId: string;
  complexData: ComplexData;
  loadingState: string;
  complexLigands: ComplexLigand[];
  subComplexInteractions: ComplexInteraction[];
  superComplexInteractions: ComplexInteraction[];
  pisa: PISAAssemblyParam[];
}
