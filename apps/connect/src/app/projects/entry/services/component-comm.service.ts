import { inject, Injectable, Injector, signal } from '@angular/core';
import { MolstarResidueInfo } from '@pdbe-lib/molstar-for-apps';
import { DataToTable } from '../components/shared/interactive-tables/data-processing/abstract-base-row-class';
import { OverviewStateManagementService } from '../components/summary-tab/sub-components/overview-molstar/state-management.service';
import { MolstarOverviewForTopPage } from '../helpers/molstar/molstar-overview-for-top-page';
import { OutliersByModelId } from '../pages/main/data-processing.facade';
import { toSignal } from '@angular/core/rxjs-interop';

export interface PreferredAssemblyData {
  name: string;
  preferred: number;
  composition: string | undefined;
  complexId: string;
}

export interface EntryDescription {
  macromoleculesDescription: string;
  entryContentsDescription: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ComponentCommunicationService {
  public preferredAssemblyData = signal<PreferredAssemblyData | undefined>(undefined);
  public descriptions = signal<EntryDescription | undefined>(undefined);
  public chainToEntityId = signal<{ [key: string]: string }>({});

  public currentTab = signal<string>('Information');
  public tabSwitchOrigin = signal<string>('main');
  public tabState = signal<{ [key: string]: string | number }>({
    Assemblies: 'Main',
    Macromolecules: 'Main',
    Ligands: 'Main',
    Domains: 'Main',
    // 'Experiments': 'Main',
    // 'Citations': 'Main',
  });

  public isTabDataGenerated = signal<boolean>(false);

  public tabTableData = signal<{ [key: string]: DataToTable }>({});

  public tabScrollState = signal<{ [key: string]: number }>({
    Assemblies: 0,
    Macromolecules: 0,
    Ligands: 0,
    Domains: 0,
    Experiments: 0,
    Citations: 0,
  });

  getTabState(tabName: string) {
    return this.tabState()[tabName];
  }

  setTabState(tabName: string, newState: string | number) {
    this.tabState.update((state) => ({
      ...state, // spread the existing state
      [tabName]: newState, // update the specific key dynamically
    }));
  }

  getTabScrollState(tabName: string) {
    return this.tabScrollState()[tabName];
  }

  setTabScrollState(tabName: string, newState: number) {
    this.tabScrollState.update((state) => ({
      ...state, // spread the existing state
      [tabName]: newState, // update the specific key dynamically
    }));
  }

  getTabData(tabName: string) {
    return this.tabTableData()[tabName];
  }

  setTabData(tabName: string, newState: DataToTable) {
    this.tabTableData.update((state) => ({
      ...state,
      [tabName]: newState,
    }));
  }

  private sidebarState = signal<boolean>(false);
  public isSidebarCollapsed = this.sidebarState.asReadonly();
  public setSidebarState() {
    this.sidebarState.update((state) => !state);
  }
}
