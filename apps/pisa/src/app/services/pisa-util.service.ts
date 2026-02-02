import { Injectable, signal } from '@angular/core';
import { GridApi } from 'ag-grid-community';

export type PageView = 'INITIAL' | 'PROCESS' | 'ERROR';
export type LoadingView = 'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR_LOADING';
export type TabView = 'INITIAL' | 'SINGLE_INTERFACE' | 'ERROR';

import type { ParseFormatT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';

@Injectable({
  providedIn: 'root',
})
export class PisaUtilService {
  private _pageView = signal<PageView>('INITIAL');
  public pageView = this._pageView.asReadonly();

  private _loadingView = signal<LoadingView>('INITIAL');
  public loadingView = this._loadingView.asReadonly();

  private _complexesTabView = signal<TabView>('INITIAL');
  public complexesTabView = this._complexesTabView.asReadonly();

  private _interfacesTabView = signal<TabView>('INITIAL');
  public interfacesTabView = this._interfacesTabView.asReadonly();

  private _currentInterfaceIdOnComplexesTab = signal<number>(1);
  public currentInterfaceIdOnComplexesTab = this._currentInterfaceIdOnComplexesTab.asReadonly();

  private _currentInterfaceIdOnInterfacesTab = signal<number>(1);
  public currentInterfaceIdOnInterfacesTab = this._currentInterfaceIdOnInterfacesTab.asReadonly();

  public currentFileType = signal<ParseFormatT>('mmcif');

  public setCurrentInterfaceIdOnComplexesTab(interfaceId: number) {
    this._currentInterfaceIdOnComplexesTab.set(interfaceId);
  }

  public setCurrentInterfaceIdOnInterfacesTab(interfaceId: number) {
    this._currentInterfaceIdOnInterfacesTab.set(interfaceId);
  }

  public setPageView(view: PageView) {
    this._pageView.set(view);
  }

  public setComplexesTabView(view: TabView) {
    this._complexesTabView.set(view);
  }

  public setInterfacesTabView(view: TabView) {
    this._interfacesTabView.set(view);
  }
  public setLoadingView(view: LoadingView) {
    this._loadingView.set(view);
  }

  public saveDataInSessionStorage(payload: any, storageId: string): void {
    sessionStorage.setItem(storageId, JSON.stringify(payload));
  }

  public removeDataInSessionStorage(storageId: string): void {
    sessionStorage.removeItem(storageId);
  }

  public getDataInSessionStorage(storageId: string): any | null {
    const payload = sessionStorage.getItem(storageId);
    return payload ? JSON.parse(payload) : null;
  }

  private _currentTabName = signal<string>('summary');
  public currentTabName = this._currentTabName.asReadonly();

  public updateCurrentTabName(tabName: string): void {
    this._currentTabName.set(tabName);
  }

  private _currentGridAPI = signal<GridApi | null>(null);
  public currentGridAPI = this._currentGridAPI.asReadonly();

  public setCurrentGridAPI(gridApi: GridApi): void {
    this._currentGridAPI.set(gridApi);
  }

  public async loadFileToGetContentType(jobId: string): Promise<void> {
    const url = `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${jobId}`;

    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type') ?? '';
      const blob = await res.blob();
      if (!blob.size) throw new Error('Empty response');

      // Pick filename + infer format
      const filetype = contentType.includes('cif') ? `mmcif` : contentType.includes('pdb') ? `pdb` : contentType.includes('ent') ? `pdb` : `mmcif`;
      this.currentFileType.set(filetype);
    } catch (e) {
      console.error(e);
    }
  }

  public generateInterfaceJSON(interfaceResult: any): void {
    const structure1 = interfaceResult.interface.molecules[0];
    const structure2 = interfaceResult.interface.molecules[1];

    const authAsymIdForStructure1 = interfaceResult.interface.molecules[0].auth_asym_id;
    const authAsymIdForStructure2 = interfaceResult.interface.molecules[1].auth_asym_id;

    const residuesForStructure1 = interfaceResult.interface.molecules[0]?.residues?.residues || [];
    const residuesForStructure2 = interfaceResult.interface.molecules[1]?.residues?.residues || [];

    const structure1Data = residuesForStructure1.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure1 }));
    const structure2Data = residuesForStructure2.map((residue: any) => ({ ...residue, auth_sym_id: authAsymIdForStructure2 }));
    const interfaceJSON: any = {
      interface: {
        structure_1: {
          symmetry_operation: structure1.symmetry_operation,
          symmetry_id: structure1.symmetry_id,
          atoms: {
            interface: structure1.int_natoms,
            surface: structure1.extendedData.n_surface_atoms,
            total: structure1.extendedData.total_atoms,
          },
          residues: {
            interface: structure1.int_nres,
            surface: structure1.extendedData.n_surface_residues,
            total: structure1.extendedData.total_residues,
          },
          solvent_accessible_area: {
            interface: structure1.int_area,
            total: structure1.extendedData.asa,
          },
          solvation_energy: {
            isolated_structure: structure1.extendedData.solv_energy,
            gain_at_complexation: -6.3,
            p_value: structure1.pvalue,
          },
        },
        structure_2: {
          symmetry_operation: structure2.symmetry_operation,
          symmetry_id: structure2.symmetry_id,
          atoms: {
            interface: structure2.int_natoms,
            surface: structure2.extendedData.n_surface_atoms,
            total: structure2.extendedData.total_atoms,
          },
          residues: {
            interface: structure2.int_nres,
            surface: structure2.extendedData.n_surface_residues,
            total: structure2.extendedData.total_residues,
          },
          solvent_accessible_area: {
            interface: structure2.int_area,
            total: structure2.extendedData.asa,
          },
          solvation_energy: {
            isolated_structure: structure2.extendedData.solv_energy,
            gain_at_complexation: -4.5,
            p_value: structure2.pvalue,
          },
        },
      },
      interfacing_residues: {
        structure_1: structure1Data,
        structure_2: structure2Data,
      },
      interfacing_bonds: {
        hydrogen_bonds: interfaceResult.interface.h_bonds.bonds || [],
        salt_bridges: interfaceResult.interface.salt_bridges.bonds || [],
        disulphide_bonds: interfaceResult.interface.ss_bonds.bonds || [],
        covalent_links: interfaceResult.interface.cov_bonds.bonds || [],
      },
    };

    if (interfaceJSON) {
      this.downloadJSON(interfaceJSON, `interface_${interfaceResult.interface_id}`);
    }
  }

  public downloadJSON(data: any, name: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public getPisaAssetUrl(path: string): string {
    const raw = (path ?? '').trim();
    if (!raw) return raw;

    // Absolute URL
    if (/^https?:\/\//i.test(raw)) return raw;

    // Normalize leading slashes for consistent checks
    const p = raw.replace(/^\/+/, ''); // removes one or many leading '/'

    // If caller already included the mount, return as absolute (prevents doubling)
    if (p === 'pdbe/pisa' || p.startsWith('pdbe/pisa/')) {
      return `/${p}`;
    }

    // Otherwise prefix with base href
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
    const base = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');

    return `${base}/${p}`;
  }
}
