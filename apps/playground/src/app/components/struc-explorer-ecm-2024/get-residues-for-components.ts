import { Column } from 'molstar/lib/mol-data/db';
import { Bundle } from 'molstar/lib/mol-model/structure/structure/element/bundle';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { StructureComponent } from 'molstar/lib/mol-plugin-state/transforms/model';
import { Expression } from 'molstar/lib/mol-script/language/expression';
import { Script } from 'molstar/lib/mol-script/script';
import { StateTransformer } from 'molstar/lib/mol-state';
import { ParamDefinition } from 'molstar/lib/mol-util/param-definition';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder';
import { StructureRepresentationBuiltInProps } from 'molstar/lib/mol-plugin-state/helpers/structure-representation-params';
import { StructureQuery } from 'molstar/lib/mol-model/structure/query/query';
import { Queries } from 'molstar/lib/mol-model/structure';
import { StructureSelection, StructureProperties, Structure } from 'molstar/lib/mol-model/structure';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';

import { EmptyLoci, Loci } from 'molstar/lib/mol-model/loci';

const CompTypes = ['lig', 'env', 'wide', 'link'] as const;

type CompType = (typeof CompTypes)[number];

interface ResidueInfo {
  label_entity_id: string | null;
  label_asym_id: string | null;
  auth_asym_id: string | null;
  label_seq_id: number | null;
  auth_seq_id: number | null;
  pdbx_PDB_ins_code: string | null;
  label_comp_id: string | null;
  auth_comp_id: string | null;
}

type molstarSelectionObj = {
  entityId: string;
  authChainId: string;
  residues: {
    authBegin: string;
    authBeginIns: string;
    authEnd: string;
    authEndIns: string;
  }[];
};
// export function getResiduesForComponents(viewer: any): Record<CompType, ResidueInfo[]> {
//     const components = Array.from(viewer.plugin.state.data.selectQ((q: { ofTransformer: (arg0: StateTransformer<PluginStateObject.Molecule.Structure, PluginStateObject.Molecule.Structure, ParamDefinition.Normalize<{ type: ParamDefinition.NamedParams<"all" | "polymer" | "water" | "branched" | "ligand" | "ion" | "lipid" | "protein" | "nucleic" | "coarse" | "non-standard", "static"> | ParamDefinition.NamedParams<Script, "script"> | ParamDefinition.NamedParams<Expression, "expression"> | ParamDefinition.NamedParams<Bundle, "bundle">; nullIfEmpty: boolean | undefined; label: string; }>>) => any; }) => q.ofTransformer(StructureComponent)));
//     const result = {} as Record<CompType, ResidueInfo[]>;
//     for (const type of CompTypes) {
//         const component = components.find((s: any) => s.transform.ref.match(new RegExp(`/${type}-\\w+$`)));
//         const residues = getResidues((component as any).obj.data);
//         result[type] = residues;
//     }
//     return result;
// }

export function getResidues(structure: Structure | undefined): ResidueInfo[] {
  if (structure === undefined) return [];
  const result: ResidueInfo[] = [];
  for (const unit of structure.units) {
    const h = unit.model.atomicHierarchy;
    let lastIRes = -1;
    for (let i = 0; i < unit.elements.length; i++) {
      const iAtom = unit.elements[i];
      const iChain = h.chainAtomSegments.index[iAtom];
      const iRes = h.residueAtomSegments.index[iAtom];
      if (iRes === lastIRes) continue;
      lastIRes = iRes;
      result.push({
        label_entity_id: getValue(h.chains.label_entity_id, iChain),
        label_asym_id: getValue(h.chains.label_asym_id, iChain),
        auth_asym_id: getValue(h.chains.auth_asym_id, iChain),
        label_seq_id: getValue(h.residues.label_seq_id, iRes),
        auth_seq_id: getValue(h.residues.auth_seq_id, iRes),
        pdbx_PDB_ins_code: getValue(h.residues.pdbx_PDB_ins_code, iRes),
        label_comp_id: getValue(h.atoms.label_comp_id, iAtom),
        auth_comp_id: getValue(h.atoms.auth_comp_id, iAtom),
      });
    }
  }
  return result;
}

function getValue<T>(column: Column<T>, iRow: number): T | null {
  if (column.valueKind(iRow) === Column.ValueKind.Present) {
    return column.value(iRow);
  } else {
    return null;
  }
}

// type ResidueListSelectionEntry =
//     | { kind: 'single', asym_id: string; seq_id: number; ins_code?: string }
//     | { kind: 'range', asym_id: string; seq_id_beg: number; seq_id_end: number; }

export function chainEntityResidSelection(molstarSelection: molstarSelectionObj) {
  // const groups: Expression[] = [];

  // const asym_id_key = kind === 'auth' ? 'auth_asym_id' as const : 'label_asym_id' as const;
  // const seq_id_key = kind === 'auth' ? 'auth_seq_id' as const : 'label_seq_id' as const;

  // for (const x of xs) {
  //     if (x.kind === 'range') {
  //         groups.push(MS.struct.generator.atomGroups({
  //             'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), entityId]),
  //             'chain-test': MS.core.rel.eq([MS.ammp(asym_id_key), x.asym_id]),
  //             'residue-test': MS.core.rel.inRange([MS.ammp(seq_id_key), x.seq_id_beg, x.seq_id_end])
  //         }));
  //     } else {
  //         const ins_code = (x.ins_code ?? '').trim();

  //         groups.push(MS.struct.generator.atomGroups({
  //             'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), entityId]),
  //             'chain-test': MS.core.rel.eq([MS.ammp(asym_id_key), x.asym_id]),
  //             'residue-test': MS.core.logic.and([
  //                 MS.core.rel.eq([MS.ammp(seq_id_key), x.seq_id]),
  //                 MS.core.rel.eq([MS.ammp('pdbx_PDB_ins_code'), ins_code])
  //             ])
  //         }));
  //     }
  // }

  // const query = MS.struct.combinator.merge(groups);

  // // return compile(query) as StructureQuery;
  // return query;

  const groups: Expression[] = [];

  const atmGroupsQueries: any[] = [];
  const selection: any = {};
  selection['entityTest'] = (l: any) => StructureProperties.entity.id(l.element) === molstarSelection.entityId;
  selection['chainTest'] = (l: any) => StructureProperties.chain.auth_asym_id(l.element) === molstarSelection.authChainId;

  for (const x of molstarSelection.residues) {
    groups.push(
      MS.struct.generator.atomGroups({
        'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), molstarSelection.entityId]),
        'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), molstarSelection.authChainId]),
        'residue-test': MS.core.rel.inRange([MS.ammp('auth_seq_id'), x.authBegin, x.authEnd]),
      })
    );
    selection['residueTest'] = (l: any) => {
      const authSeqId = StructureProperties.residue.auth_seq_id(l.element);
      return authSeqId >= parseInt(x.authBegin)! && authSeqId <= parseInt(x.authEnd)!;
    };
    atmGroupsQueries.push(Queries.generators.atoms(selection));
  }

  const query = MS.struct.combinator.merge(groups);
  const queryLoci = Queries.combinators.merge(atmGroupsQueries);
  return {
    query: query,
    queryLoci: queryLoci,
  };
}

// export function getLociFromParams(params: any, contextData: any){
//     let assemblyRef = this.plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
//     if(assemblyRef === '') return EmptyLoci;
//     const data = (this.plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
//     if(!data) return EmptyLoci;
//     const sel = StructureQuery.run(QueryHelper.getQueryObject(params, data) as any, data);
//     return StructureSelection.toLociWithSourceUnits(sel);
// }
export async function getViewerLoci(viewer: any, molstarSelection: molstarSelectionObj) {
  const residueData = chainEntityResidSelection(molstarSelection);
  // const residueQuery = residueData.query;
  const residueQueryLoci = residueData.queryLoci;
  // const vis = await viewer.plugin!.builders.structure.tryCreateComponentFromExpression(structure, residueQuery, lbl, {label: lbl});
  // const reprObj = await viewer.plugin!.builders.structure.representation.addRepresentation(vis, (repr as StructureRepresentationBuiltInProps));

  let queryLoci: Loci = EmptyLoci;
  const assemblyRef = viewer.plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
  // if(assemblyRef === '') return EmptyLoci;
  if (assemblyRef !== '') {
    const data = (viewer.plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
    if (data) {
      const sel = StructureQuery.run(residueQueryLoci, data);
      queryLoci = StructureSelection.toLociWithSourceUnits(sel);
    }
  }
  return queryLoci;
}

export async function focusLoci(viewer: any, molstarSelection: molstarSelectionObj) {
  const queryLoci = await getViewerLoci(viewer, molstarSelection);
  await viewer.plugin!.managers.camera.focusLoci(queryLoci, { durationMs: 300 });
}

export async function unfocusLoci(viewer: any) {
  await viewer.visual.reset({ camera: true });
}

export async function highlightLoci(viewer: any, molstarSelection: molstarSelectionObj) {
  const queryLoci = await getViewerLoci(viewer, molstarSelection);
  if (Loci.isEmpty(queryLoci)) return;
  viewer.plugin.managers.interactivity.lociHighlights.highlightOnly({ loci: queryLoci });
}

export async function clearHighlightLoci(viewer: any) {
  await viewer.visual.clearHighlight();
}
