import { Injectable, signal } from '@angular/core';
import { MolstarResidueInfo } from '../helpers/molstar/molstar-helpers';
import { DataToTable } from '../components/interactive-tables/data-processing/abstract-base-row-class';

@Injectable({
  providedIn: 'root',
})
export class ComponentCommunicationService {
  public molstarResidueInfoLoaded = signal<boolean>(false);
  public molstarResidueInfo = signal<MolstarResidueInfo[]>([]);

  public currentTab = signal<string>('Assemblies');
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
}
