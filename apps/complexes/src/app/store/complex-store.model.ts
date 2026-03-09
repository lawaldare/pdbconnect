import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { ComplexLigand } from '../models/complex-ligands.model';
import { PISAAssemblyParam } from '../models/pisa-assembly-param.model';
import { ComplexIdHistory } from '../models/complexId-history.model';

export interface ComplexStoreState {
  complexId: string;
  complexData: ComplexData | null;
  loadingState: string;
  complexLigands: ComplexLigand[];
  subComplexInteractions: ComplexInteraction[];
  superComplexInteractions: ComplexInteraction[];
  pisa: PISAAssemblyParam[];
  history: ComplexIdHistory | null;
}
