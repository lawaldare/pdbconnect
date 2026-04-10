import type { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { InteractionsApiData, ValidationApiData } from './data-provider';

export type SnapshotSpecParams = {
  /** PDBconnect Summary tab > Preferred complex (default view), Complexes tab */
  pdbconnect_complex: {
    /** PDB ID */
    entry: string;
    /** Assembly ID*/
    assemblyId: string | undefined;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** Colors for entities */
    entityColors: { [entityId: string]: string } | undefined;
  };
  /** PDBconnect Summary tab > Macromolecules (macromolecule selected), Macromolecules tab */
  pdbconnect_macromolecule: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Entity ID of the macromolecule (polymer or branched) entity */
    entityId: string;
    /** Optional chain identifier (label_asym_id) (if `undefined`, all chains will be highlighted) */
    labelAsymId?: string;
    /** Optional chain identifier (auth_asym_id) (if `undefined`, all chains will be highlighted) */
    authAsymId?: string;
    /** Symmetry instance identifier (e.g. 'ASM-1'), `undefined` for showing all instances */
    instanceId: string | undefined;
    /** Apply camera focus on selected macromolecule */
    focus: boolean;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** Color for the macromolecule */
    color: string | undefined;
  };
  /** PDBconnect Summary tab > Ligands (nothing selected) */
  pdbconnect_all_ligands: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** List of entity IDs of ligand entities */
    ligandEntityIds: string[];
    /** Colors for entities */
    entityColors: { [entityId: string]: string } | undefined;
  };
  /** PDBconnect Summary tab > Ligands (ligand selected) */
  pdbconnect_ligand: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Entity ID of the ligand entity */
    entityId: string;
    /** Chain identifier (label_asym_id) */
    labelAsymId: string;
    /** Symmetry instance identifier (e.g. 'ASM-1'), `undefined` for showing all instances */
    instanceId: string | undefined;
    /** Apply camera focus on selected ligand */
    focus: boolean;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** Colors for entities */
    entityColors: { [entityId: string]: string } | undefined;
  };
  /** PDBconnect Summary tab > Domains (domain selected), Domains tab */
  pdbconnect_domains: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** List of domains to highlight, (`name` to show in tooltip) */
    domains: { selector: ComponentExpressionT[]; color: string; name: string | undefined }[];
    /** Apply camera focus on selected domains */
    focus: boolean;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
  };
  /** PDBconnect Summary tab > Modifications */
  pdbconnect_modifications: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** List of modifications to highlight, (`name` to show in tooltip) */
    modifications: { labelCompId: string; color: string; name: string | undefined }[];
    /** If provided, only show ball-and-stick and optionally focus this; if undefined, show spacefill for all. */
    selected: ComponentExpressionT[] | undefined;
    /** Apply camera focus on selected modification */
    focus: boolean;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** Colors for entities */
    entityColors: { [entityId: string]: string } | undefined;
  };
  /** PDBconnect Model Quality tab */
  pdbconnect_quality: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Model ID (numbered from 1) */
    modelId: number;
    /** Residue-wise structure validation data (same format as served by `validation/residuewise_outlier_summary/entry/${pdbId}` API) */
    validationData: ValidationApiData[string]['molecules'] | undefined;
    /** Validation view type (either 'issue_count' for number of outlier types on a residue, or 'specific_issue' with name of a specific outlier type (e.g. 'bond_angles')) */
    validationType: { kind: 'issue_count' } | { kind: 'specific_issue'; issue: string };
    /** Colors to use for showing validation data.
     * - If `validationType` is 'issue_count': first color = 0 issues, second color = 1 issue..., last color = n or more issues).
     * - If `validationType` is 'specific_issue': first color = issue not present, last color = issue present). */
    validationColors: string[];
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
  };
  /** PDBconnect Ligands and Environments tab */
  pdbconnect_environment: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Chain identifier (label_asym_id) */
    labelAsymId: string;
    /** Author chain identifier (auth_asym_id) */
    authAsymId: string;
    /** Author residue number (auth_seq_id) */
    authSeqId: number;
    /** Residue insertion code (pdbx_PDB_ins_code) */
    authInsCode: string;
    /** Symmetry instance identifier (e.g. 'ASM-1'), `undefined` for showing all instances */
    instanceId: string | undefined;
    /** Source of atom interactions to be shown */
    atomInteractions: { start: ComponentExpressionT[]; end: ComponentExpressionT[]; color?: string; tooltip?: string }[] | 'builtin' | 'none';
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
    /** Colors for entities */
    entityColors: { [entityId: string]: string } | undefined;
  };
  /** PDBconnect Text Annotations tab (residue selected) */
  pdbconnect_text_annotation: {
    /** PDB ID */
    entry: string;
    /** Assembly ID (or `undefined` for deposited model) */
    assemblyId: string | undefined;
    /** Entity identifier (label_entity_id) */
    entityId: string;
    /** Chain identifier (label_asym_id) */
    labelAsymId: string;
    /** Residue number (label_seq_id) for highlighted residue, `undefined` for showing the whole chain */
    labelSeqId: number | undefined;
    /** Symmetry instance identifier (e.g. 'ASM-1'), `undefined` for showing all instances */
    instanceId: string | undefined;
    /** Turn on Volume Streaming */
    volumeStreaming: boolean;
  };
};

export type SnapshotKind = keyof SnapshotSpecParams;
export const SnapshotKinds = [
  'pdbconnect_complex',
  'pdbconnect_macromolecule',
  'pdbconnect_all_ligands',
  'pdbconnect_ligand',
  'pdbconnect_domains',
  'pdbconnect_modifications',
  'pdbconnect_quality',
  'pdbconnect_environment',
  'pdbconnect_text_annotation',
] as const satisfies readonly SnapshotKind[];

export type SnapshotSpec<TKind extends SnapshotKind = SnapshotKind> = TKind extends SnapshotKind
  ? { kind: TKind; params: SnapshotSpecParams[TKind]; name: string }
  : never; // extends clause needed to create discriminated union type properly

/** Validation view type ('issue_count' for number of outlier types, or specific outlier type (this list might not be complete)) */
export const ValidationTypes = ['issue_count', 'bond_angles', 'clashes', 'sidechain_outliers', 'symm_clashes', 'planes', 'RSRZ'] as const;
export type ValidationType = (typeof ValidationTypes)[number];
