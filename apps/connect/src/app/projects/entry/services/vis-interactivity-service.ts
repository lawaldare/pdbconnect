import { Injectable, signal } from '@angular/core';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';

@Injectable({
  providedIn: 'root',
})
export class VisualisationInteractivityService {
  public currentSelectionData = signal<QueryParam[]>([]);
  public currentMolstarComponent?: MolstarComponent;
  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);
}
