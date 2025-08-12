import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { DataToTable } from '../data-classes/data-processing/abstract-base-row-class';
import { BehaviorSubject } from 'rxjs';
import { AssembliesRowData, DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { InitParams } from 'pdbe-molstar/lib/spec';
import { EntryDescription, OutliersByModelId, PreferredAssemblyData } from '../data-classes/data-models-and-definitions/other-models';
@Injectable({
  providedIn: 'root',
})
export class ComponentCommunicationService {
  public currentTabName = signal<string | undefined>(undefined);

  public preferredAssemblyData = signal<PreferredAssemblyData | undefined>(undefined);
  public descriptions = signal<EntryDescription | undefined>(undefined);
  public chainToEntityId = signal<{ [key: string]: string }>({});
  public outliersByModelId = signal<OutliersByModelId | undefined>(undefined);
  public relatedEntries: WritableSignal<string[]> = signal([]);

  public mobileMolstar?: MolstarComponent;
  public mobileMolstarLoaded$ = new BehaviorSubject<boolean>(false);
  public mobileModelIdx$ = new BehaviorSubject<string>('1');
  public configForMobileMolstar = signal<InitParams | undefined>(undefined);
  public mobileMolstarDisplay = 'none';

  public isTabDataGenerated = computed(() => {
    return this.hasProcessedAssemblies() && this.hasProcessedLigands() && this.hasProcessedDomains() && this.hasProcessedMacromolecules();
  });

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

  getTabData(tabName: string): DataToTable | undefined {
    if (tabName === 'Macromolecules') {
      return this.macromoleculesTableData;
    } else if (tabName === 'Ligands') {
      return this.ligandsTableData;
    } else if (tabName === 'Domains') {
      return this.domainsTableData;
    } else if (tabName === 'Assemblies') {
      return this.assembliesTableData;
    }
    return undefined;
  }

  private sidebarState = signal<boolean>(false);
  public isSidebarCollapsed = this.sidebarState.asReadonly();
  public setSidebarState() {
    this.sidebarState.update((state) => !state);
  }
}
