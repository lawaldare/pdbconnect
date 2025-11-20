import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadPageFacade {
  public isLoading = signal(false);
  public errorMsg = signal('');
  public successMsg = signal('');
  public model = signal<any>(null);
  public structures = signal<any[]>([]);

  public modelSym = computed(() => {
    const model = this.model();
    return model?._staticPropertyData?.model_symmetry;
  });
  public modelSymParam = computed(() => {
    const cell = this.modelSym()?.spacegroup?.cell;
    return cell?.anglesInRadians?.map((r: any) => r * (180 / Math.PI));
  });
  public simplifiedSpacegroup = computed(() => {
    return this.modelSym()?.spacegroup?.name?.trim() ?? '';
  });
  public orthoCode = computed(() => {
    const modelSym = this.modelSym();
    let orthoCode = modelSym?.spacegroup?.to_orthogonal_axes ?? modelSym?.spacegroup?.to_orthogonal ?? '';

    if (!orthoCode) {
      const cell = modelSym?.spacegroup?.cell;
      if (cell?.anglesInRadians?.length === 3) {
        const [alpha, beta, gamma] = cell.anglesInRadians.map((r: number) => (r * 180) / Math.PI);
        const near90 = (x: number) => Math.abs(x - 90) < 1e-2;

        // Comment: In monoclinic, the axis opposite the non-90° angle gets the star (*).
        // alpha≠90 → b*, beta≠90 → c*, gamma≠90 → a*
        if (!near90(beta) && near90(alpha) && near90(gamma)) {
          // b-unique (most common): z // c*
          orthoCode = '(#1) A/X0, B/Y0, C*/Z0';
        } else if (!near90(alpha) && near90(beta) && near90(gamma)) {
          // a-unique: y // b*
          orthoCode = '(#1) A*/X0, B/Y0, C/Z0';
        } else if (!near90(gamma) && near90(alpha) && near90(beta)) {
          // c-unique: x // a*
          orthoCode = '(#1) A/X0, B*/Y0, C/Z0';
        } else if (near90(alpha) && near90(beta) && near90(gamma)) {
          // orthorhombic/tetragonal/cubic
          orthoCode = '(#1) A/X0, B/Y0, C/Z0';
        } else {
          // triclinic fallback: present a neutral code
          orthoCode = '(#1) A/X0, B/Y0, C/Z0';
        }
      }
    }
    return orthoCode;
  });

  public analysisOld = computed(() => {
    const structures = this.structures();
    const chains = new Set<string>();
    const ligands = new Set<string>();
    for (const s of structures) {
      const model = s.cell?.obj?.data?.state?.models?.[0] || s.cell?.obj?.data?.models?.[0] || s.cell?.obj?.data;
      if (!model) continue;

      const entities = model.entities ?? model.sourceData?.data?.entities ?? model.data?.entities ?? null;

      if (!entities) continue;

      if (entities.data?._columns && (entities.type?.__array || entities.subtype?.__array)) {
        const typeArray = entities.type?._array ?? entities.subtype?.__array ?? entities.subtype?.valueKind?.__array ?? [];
        const idArray = entities.data?.id?._array ?? [];
        const rowCount = entities.data?._rowCount ?? typeArray.length;
        for (let i = 0; i < rowCount; i++) {
          const t = typeArray[i]?.toLowerCase?.() ?? '';
          const id = idArray[i] ?? `${i + 1}`;
          if (t.includes('polymer') || t.includes('polypeptide')) chains.add(id);
          else if (t && !t.includes('water')) ligands.add(id);
        }
      } else if (Array.isArray(entities)) {
        for (const e of entities) {
          const type = e?.type ?? e?.data?.type?.value ?? e?.subtype?.value ?? '';
          const id = e?.id ?? e?.entryId ?? e?.entry ?? 'unknown';
          if (typeof type === 'string') {
            if (type.includes('polymer')) chains.add(id);
            if (type.includes('non-polymer') || type.includes('ligand')) ligands.add(id);
          }
        }
      } else if (typeof entities === 'object') {
        for (const [key, raw] of Object.entries(entities as Record<string, any>)) {
          if (typeof raw !== 'object' || raw === null) continue;
          const type = raw?.type ?? raw?.data?.type?.value ?? raw?.subtype?.value ?? '';
          const id = raw?.id ?? raw?.entryId ?? key;
          if (typeof type === 'string') {
            if (type.includes('polymer')) chains.add(id);
            if (type.includes('non-polymer') || type.includes('ligand')) ligands.add(id);
          }
        }
      }
    }
    return `${chains.size} amino acid chains and ${ligands.size} ligands in ASU`;
  });
  public analysis = computed(() => {
    const model: any = this.model();
    if (!model) return '0 amino acid chains and 0 ligands in ASU';

    /* ------------------------------------------------------------------
     1) COUNT CHAINS — PISA uses entity subtypes for this
  ------------------------------------------------------------------ */
    let chainCount = 0;

    const entities = model.entities;
    if (entities?.subtype) {
      const subtypeArr = this.colToArray(entities.subtype).map((v) => String(v).toLowerCase());

      chainCount = subtypeArr.filter((t) => t.includes('polypeptide')).length;
    }

    /* ------------------------------------------------------------------
     2) COUNT LIGANDS — PISA counts residue-level ligands, not entities
  ------------------------------------------------------------------ */
    const atoms = model.atomicHierarchy?.atoms;
    if (!atoms) return `${chainCount} amino acid chains and 0 ligands in ASU`;

    const compIds = this.colToArray(atoms.label_comp_id ?? atoms.comp_id).map((v) => String(v).toUpperCase());

    if (!compIds.length) {
      return `${chainCount} amino acid chains and 0 ligands in ASU`;
    }

    const unique = Array.from(new Set(compIds));

    const aminoAcids = new Set([
      'ALA',
      'ARG',
      'ASN',
      'ASP',
      'CYS',
      'GLN',
      'GLU',
      'GLY',
      'HIS',
      'ILE',
      'LEU',
      'LYS',
      'MET',
      'PHE',
      'PRO',
      'SER',
      'THR',
      'TRP',
      'TYR',
      'VAL',
    ]);

    const nucleotides = new Set(['A', 'C', 'G', 'U', 'DA', 'DC', 'DG', 'DT']);

    const ignore = new Set([
      'HOH',
      'WAT',
      'DOD', // water
      'NA',
      'K',
      'CL',
      'CA',
      'MG',
      'ZN',
      'MN',
      'FE',
      'CU',
      'CO',
      'NI',
      'SO4',
      'PO4',
      'IO3',
      'NO3', // ions & salts
    ]);

    const ligands = unique.filter((id) => !aminoAcids.has(id) && !nucleotides.has(id) && !ignore.has(id));

    /* ------------------------------------------------------------------
     Final PISA-matching summary
  ------------------------------------------------------------------ */
    return `${chainCount} amino acid chains and ${ligands.length} ligands in ASU`;
  });

  public processLigands = computed<any[]>(() => {
    const model: any = this.model();
    const atoms = model?.atomicHierarchy?.atoms;
    if (!atoms) return [];

    // All component IDs per atom (ALA, GLU, ACE, HF2, GDP, …)
    const atomCompIds = this.colToArray(atoms.label_comp_id ?? atoms.comp_id).map((v) => String(v).toUpperCase());
    if (!atomCompIds.length) return [];

    // Unique comp IDs present in the structure
    const unique = Array.from(new Set(atomCompIds));

    // --- Polymer building blocks we do NOT want as ligands -------------
    const aminoAcids = new Set([
      'ALA',
      'ARG',
      'ASN',
      'ASP',
      'CYS',
      'GLN',
      'GLU',
      'GLY',
      'HIS',
      'ILE',
      'LEU',
      'LYS',
      'MET',
      'PHE',
      'PRO',
      'SER',
      'THR',
      'TRP',
      'TYR',
      'VAL',
    ]);

    // Standard DNA/RNA bases (polymeric) – IMPORTANT: we purposely
    // do NOT include GDP/ADP/ATP etc. so those remain ligands.
    const nucleotides = new Set([
      'A',
      'C',
      'G',
      'U', // RNA bases
      'DA',
      'DC',
      'DG',
      'DT', // DNA bases
    ]);

    const polymerBlocks = new Set<string>([
      ...aminoAcids,
      ...nucleotides,
      'UNK', // unknown residue, treat as polymer-ish
    ]);

    // --- Solvent / ions / misc you may want to ignore -------------------
    const ignore = new Set([
      'HOH',
      'WAT',
      'DOD', // water
      'NA',
      'K',
      'CL',
      'CA',
      'MG',
      'ZN',
      'MN',
      'FE',
      'CU',
      'SO4',
      'PO4', // tweak this to match PISA if needed
    ]);

    // --- Final ligand list ----------------------------------------------
    const ligands = unique.filter((id) => !polymerBlocks.has(id) && !ignore.has(id));

    console.log('atomCompIds', atomCompIds);
    console.log('ligands', ligands);

    const mappedLigands = ligands.sort().map((ligand) => {
      return { title: ligand, selected: true };
    });

    return mappedLigands; // e.g. ["ACE", "GDP", "HF2"]
  });

  public colToArray(col: any): any[] {
    if (!col) return [];
    if (typeof col.toArray === 'function') return col.toArray();
    if (Array.isArray(col._array)) return col._array;
    if (Array.isArray(col.__array)) return col.__array;
    if (Array.isArray(col)) return col;
    if (typeof col.value === 'function' && typeof col.rowCount === 'number') {
      const out: any[] = [];
      for (let i = 0; i < col.rowCount; i++) out.push(col.value(i));
      return out;
    }
    return [];
  }

  public label = computed(() => {
    const model = this.model();
    return model?.label ?? model?.entryId ?? 'Upload your file';
  });

  public showLoading(): void {
    this.isLoading.set(true);
  }
  public hideLoading(): void {
    this.isLoading.set(false);
  }

  public showError(message: string): void {
    this.errorMsg.set(message);
    this.successMsg.set('');
  }

  public hideError(): void {
    this.errorMsg.set('');
  }

  public showSuccess(message: string): void {
    this.successMsg.set(message);
    this.errorMsg.set('');
  }

  public readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
  public readFileAsBytes(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }
}
