import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { DataToTable } from '../data-classes/data-processing/abstract-base-row-class';
import { BehaviorSubject } from 'rxjs';
import { AssembliesRowData, DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';
import { OutliersByModelId } from '../pages/main/data-processing.facade';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { InitParams } from 'pdbe-molstar/lib/spec';

export interface PreferredAssemblyData {
  name: string;
  preferred: number;
  composition: string | undefined;
  complexId: string | undefined;
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
  public outliersByModelId = signal<OutliersByModelId | undefined>(undefined);
  public relatedEntries: WritableSignal<string[]> = signal([]);

  public mobileMolstar?: MolstarComponent;
  public mobileMolstarLoaded$ = new BehaviorSubject<boolean>(false);
  public mobileModelIdx$ = new BehaviorSubject<string>('1');
  public configForMobileMolstar = signal<InitParams | undefined>(undefined);

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

  public isTabDataGenerated = computed(() => {
    return this.hasProcessedAssemblies() && this.hasProcessedLigands() && this.hasProcessedDomains() && this.hasProcessedMacromolecules();
  });

  public tabTableData = signal<{ [key: string]: DataToTable }>({});

  public assemblySelection$ = new BehaviorSubject<number | undefined>(undefined);
  public macromoleculeSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public ligandSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public domainSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public llmSelection$ = new BehaviorSubject<number | undefined>(undefined);

  public assembliesTableData?: DataToTable;
  public hasProcessedAssemblies = signal<boolean>(false);
  public processedAssemblies: AssembliesRowData[] = [];

  public macromoleculesTableData?: DataToTable;
  public hasProcessedMacromolecules = signal<boolean>(false);
  public processedMacromolecules: MacromoleculesRowData[] = [];

  public ligandsTableData?: DataToTable;
  public hasProcessedLigands = signal<boolean>(false);
  public processedLigandsAndModifications: LigandsRowData[] = [];
  public processedLigands: LigandsRowData[] = [];
  public processedModifications: LigandsRowData[] = [];

  public domainsTableData?: DataToTable;
  public hasPreProcessedDomains = signal<boolean>(false);
  public hasProcessedDomains = signal<boolean>(false);
  public processedDomainsAsList: DomainsRowData[] = [];
  public processedDomains: {
    macromolecule: MacromoleculesRowData;
    domains: DomainsRowData[];
  }[] = [];

  setTabState(tabName: string, newState: string | number) {
    this.tabState.update((state) => ({
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
