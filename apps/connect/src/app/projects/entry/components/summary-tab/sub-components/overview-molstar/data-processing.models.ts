import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { DomainsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';

export type ParsedComplexDetails = {
  name: string | null | undefined;
  preferred: number | null | undefined;
  composition: string | null | undefined;
  complexId: string | null | undefined;
};

export type NestedDomainsData = Array<{
  macromolecule: MacromoleculesRowData;
  domains: DomainsRowData[];
}>;
