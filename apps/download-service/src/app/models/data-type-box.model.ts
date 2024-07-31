import { DataContentModels } from './data-content.model';
import { Descriptor } from './descriptor.model';

export interface DataType {
  descriptorType: Descriptor;
  dataContent: DataContentModels[];
  submissionType: string;
}
