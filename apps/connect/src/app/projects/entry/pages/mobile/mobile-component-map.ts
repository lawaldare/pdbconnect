import { MobileTabChips } from '../../data-classes/data-models-and-definitions/other-models';
import { MbAssembliesComponent } from './mb-assemblies/mb-assemblies.component';
import { MbDomainsComponent } from './mb-domains/mb-domains.component';
import { MbLigandsComponent } from './mb-ligands/mb-ligands.component';
import { MbMacromoleculeComponent } from './mb-macromolecules/mb-macromolecule.component';
import { MbModelQualityComponent } from './mb-model-quality/mb-model-quality.component';

// Map tab chips to their respective bottom sheet components
export const MOBILE_COMPONENT_MAP = {
  [MobileTabChips.MQuality]: MbModelQualityComponent,
  [MobileTabChips.Assemblies]: MbAssembliesComponent,
  [MobileTabChips.Macromolecules]: MbMacromoleculeComponent,
  [MobileTabChips.Ligands]: MbLigandsComponent,
  [MobileTabChips.Domains]: MbDomainsComponent,
} as const;
