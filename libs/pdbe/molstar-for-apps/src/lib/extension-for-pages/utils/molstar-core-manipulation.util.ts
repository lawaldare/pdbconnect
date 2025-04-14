/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Column } from 'molstar/lib/mol-data/db';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { Expression } from 'molstar/lib/mol-script/language/expression';
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder';
import { StructureQuery } from 'molstar/lib/mol-model/structure/query/query';
import { Queries } from 'molstar/lib/mol-model/structure';
import { StructureSelection, StructureProperties, Structure } from 'molstar/lib/mol-model/structure';
import { StructureRepresentationBuiltInProps } from 'molstar/lib/mol-plugin-state/helpers/structure-representation-params';
import { setSubtreeVisibility } from 'molstar/lib/mol-plugin/behavior/static/state';
import { StateSelection, StateTransform, StateTransformer } from 'molstar/lib/mol-state';
import { StateTransforms } from 'molstar/lib/mol-plugin-state/transforms';
import { StructureElement } from 'molstar/lib/mol-model/structure';
import { arraySetAdd } from 'molstar/lib/mol-util/array';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { LociLabelTextParams } from 'molstar/lib//mol-repr/shape/loci/common';
import { LineParams } from 'molstar/lib//mol-repr/structure/representation/line';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { EmptyLoci, Loci } from 'molstar/lib/mol-model/loci';

/**
 * This file contains various helper functions for manipulating Molstar
 * Some are not being currently used but can still serve as reference for future
 * developers.
 *
 * Ideally it would be nice if those who are being used are eventually migrated into Molstar
 */

const CompTypes = ['lig', 'env', 'wide', 'link'] as const;

type CompType = (typeof CompTypes)[number];

export interface MolstarResidueInfo {
  label_entity_id: string | null;
  label_asym_id: string | null;
  auth_asym_id: string | null;
  label_seq_id: number | null;
  auth_seq_id: number | null;
  pdbx_PDB_ins_code: string | null;
  label_comp_id: string | null;
  auth_comp_id: string | null;
}

export type MolstarSelectionObj = {
  entityId?: string;
  authChainId?: string;
  residues: {
    entityId?: string;
    authChainId?: string;
    authBegin: string;
    authBeginIns: string;
    authEnd: string;
    authEndIns: string;
  }[];
};

export function getResidues(viewer: any): MolstarResidueInfo[] {
  const assemblyRef = viewer.plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
  const structure = (viewer.plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
  if (structure === undefined) return [];
  const result: MolstarResidueInfo[] = [];
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
export function chainEntitySelection(entityId: string, asymId: string) {
  return MS.struct.generator.atomGroups({
    'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), entityId]),
    'chain-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_asym_id(), asymId]),
  });
}

export function chainEntityResidSelection(molstarSelection: MolstarSelectionObj) {
  const groups: Expression[] = [];

  const atmGroupsQueries: any[] = [];
  const selection: any = {};

  if (molstarSelection.entityId) {
    selection['entityTest'] = (l: any) => StructureProperties.entity.id(l.element) === molstarSelection.entityId;
  }

  if (molstarSelection.authChainId) {
    selection['chainTest'] = (l: any) => StructureProperties.chain.auth_asym_id(l.element) === molstarSelection.authChainId;
  }

  if (molstarSelection.residues.length === 0) {
    if (!molstarSelection.authChainId) {
      groups.push(
        MS.struct.generator.atomGroups({
          'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), molstarSelection.entityId]),
        })
      );
    } else {
      groups.push(
        MS.struct.generator.atomGroups({
          'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), molstarSelection.entityId]),
          'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), molstarSelection.authChainId!]),
        })
      );
    }
    atmGroupsQueries.push(Queries.generators.atoms(selection));
  } else {
    for (const x of molstarSelection.residues) {
      const entityId = molstarSelection.entityId ? molstarSelection.entityId : x.entityId;
      const chainId = molstarSelection.authChainId ? molstarSelection.authChainId : x.authChainId;
      groups.push(
        MS.struct.generator.atomGroups({
          'entity-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.label_entity_id(), entityId]),
          'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), chainId]),
          'residue-test': MS.core.rel.inRange([MS.ammp('auth_seq_id'), parseInt(x.authBegin), parseInt(x.authEnd)]),
        })
      );
      if (x.entityId) {
        selection['entityTest'] = (l: any) => StructureProperties.entity.id(l.element) === entityId;
      }
      if (x.authChainId) {
        selection['chainTest'] = (l: any) => StructureProperties.chain.auth_asym_id(l.element) === chainId;
      }
      selection['residueTest'] = (l: any) => {
        const authSeqId = StructureProperties.residue.auth_seq_id(l.element);
        return authSeqId >= parseInt(x.authBegin)! && authSeqId <= parseInt(x.authEnd)!;
      };
      atmGroupsQueries.push(Queries.generators.atoms(selection));
    }
  }
  const query = MS.struct.combinator.merge(groups);
  const queryLoci = Queries.combinators.merge(atmGroupsQueries);
  return {
    query: query,
    queryLoci: queryLoci,
  };
}

// /** Return list of unique element symbols (C, N, O, FE...) in the given chains */
// export function getElementsInChains(structure: Structure, chains: ChainIndex[]): string[] {
//   const symbols = new Set<string>();
//   for (const ci of chains) {
//       const fromAtom = structure.model.atomicHierarchy.chainAtomSegments.offsets[ci];
//       const toAtom = structure.model.atomicHierarchy.chainAtomSegments.offsets[ci + 1];
//       for (let ai = fromAtom; ai < toAtom; ai++) {
//           const symbol = structure.model.atomicHierarchy.atoms.type_symbol.value(ai);
//           symbols.add(symbol);
//       }
//   }
//   return Array.from(symbols).sort();
// }

// export function getLociFromParams(params: any, contextData: any){
//     let assemblyRef = this.plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
//     if(assemblyRef === '') return EmptyLoci;
//     const data = (this.plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
//     if(!data) return EmptyLoci;
//     const sel = StructureQuery.run(QueryHelper.getQueryObject(params, data) as any, data);
//     return StructureSelection.toLociWithSourceUnits(sel);
// }

export async function getViewerLoci(viewer: any, molstarSelection: MolstarSelectionObj) {
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

export async function focusLoci(viewer: any, molstarSelection: MolstarSelectionObj) {
  const queryLoci = await getViewerLoci(viewer, molstarSelection);
  await viewer.plugin!.managers.camera.focusLoci(queryLoci, { durationMs: 300 });
}

export async function unfocusLoci(viewer: any) {
  await viewer.visual.reset({ camera: true });
}

export async function highlightLoci(viewer: any, molstarSelection: MolstarSelectionObj) {
  const queryLoci = await getViewerLoci(viewer, molstarSelection);
  if (Loci.isEmpty(queryLoci)) return;
  viewer.plugin.managers.interactivity.lociHighlights.highlightOnly({ loci: queryLoci });
}

export async function clearHighlightLoci(viewer: any) {
  await viewer.visual.clearHighlight();
}

export async function getComponentList(viewer: any) {
  let structureData = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      const parsedKey = comp.key!.replace('structure-component-', '');
      console.log('comp.key!');
      console.log(comp.key!);
      console.log(comp);
      console.log('');
      // "!1cbs/model-0/props/struct-assembly-1/entities/entity-1"
      // if (comp.key!.includes('/entities/')) {
      //   const entityNumber = comp.key!.split('/entity-')[1];
      //   console.log("comp.key!")
      //   console.log("entityNumber: ", entityNumber)
      //   const entityColor = comp.representations[0].cell.params.values.colorTheme.params.value;
      //   const entityColorHex = '#' + ('000000' + entityColor.toString(16)).slice(-6);
      //   console.log("entityColor: ", entityColor)
      //   console.log("entityColorHex: ", entityColorHex)
      // }
    }
  }
}

export async function changeComponentVisibility(viewer: any, query: string, toHide: boolean) {
  let structureData = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        setSubtreeVisibility(viewer.state, comp.cell.transform.ref, toHide);
      }
    }
  }
}

export async function changeRepresentationVisibility(viewer: any, query: string, toHide: boolean, hideIdx: number) {
  let structureData = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        for (let i = 0; i < comp.representations.length; i++) {
          const repr = comp.representations[i];
          if (i === hideIdx) {
            setSubtreeVisibility(viewer.state, repr.cell.transform.ref, toHide);
          }
        }
      }
    }
  }
}

export async function createComponent(viewer: any, lbl: string, molstarSelection: MolstarSelectionObj, representation: any) {
  // let structure = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  const structure = viewer.state.select(viewer.assemblyRef)[0];
  const residueData = chainEntityResidSelection(molstarSelection);

  const residueQuery = residueData.query;
  // const residueQuery = chainEntitySelection(molstarSelection.entityId, molstarSelection.authChainId!)
  const residueQueryLoci = residueData.queryLoci;

  // create selection from expression that condenses this (entity+chain)
  const vis = await viewer.plugin!.builders.structure.tryCreateComponentFromExpression(structure, residueQuery, lbl, { label: lbl });
  if (vis) {
    // create representation and add to molstar
    const reprObj = await viewer.plugin!.builders.structure.representation.addRepresentation(vis, representation as StructureRepresentationBuiltInProps);
    return {
      status: true,
      residueData: residueData,
      residueQuery: residueQuery,
      residueQueryLoci: residueQueryLoci,
      reprObj: reprObj,
    };
  }
  return false;
}

export async function removeComponent(viewer: any, query: string) {
  let structureData = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        const builder = viewer.plugin!.state.data.build();
        await builder.delete(comp.cell.transform.ref);
        await builder.commit({ canUndo: false });
      }
    }
  }
}

export async function addRepresentationToComponent(viewer: any, query: string, representation: any, hideOthers: boolean) {
  let structureData = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        if (hideOthers) {
          for (const repr of comp.representations) {
            // delete not working
            // const builder = viewer.plugin!.state.data.build()
            // await builder.delete(repr.cell.transform.ref);
            setSubtreeVisibility(viewer.state, repr.cell.transform.ref, true);
          }
        }
        await viewer.plugin!.builders.structure.representation.addRepresentation(comp.cell, representation as StructureRepresentationBuiltInProps);
      }
    }
  }

  // await this.plugin.builders.structure.representation.addRepresentation(component.cell,
  // builder.to(structureRef).delete(representationRef);

  // let structure = [viewer.plugin!.managers.structure.hierarchy.current.structures[0]];
  // const reprObj = await viewer.plugin!.builders.structure.representation.addRepresentation(vis, (representation as StructureRepresentationBuiltInProps));
}

// https://github.com/molstar/molstar/issues/1139
// https://github.com/molstar/pdbe-molstar/blob/4c11af0c0b79f8946ae78bd53ca331574be38672/src/app/superposition-focus-representation.ts#L72
export function getGroup(viewer: any) {
  const state = viewer.plugin.state.data;
  const groupRef = StateSelection.findTagInSubtree(state.tree, StateTransform.RootRef, 'measurement-group');
  const builder = viewer.plugin.state.data.build();

  if (groupRef) return builder.to(groupRef);
  return builder.toRoot().group(StateTransforms.Misc.CreateGroup, { label: `Measurements` }, { tags: 'measurement-group' });
}

export function getAtomLoci(viewer: any, item: { atomId: string; chainId: string; resId: string }) {
  const { atomId, chainId, resId } = item;

  const assemblyRef = viewer.plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
  const data = (viewer.plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;

  const selection: any = {};
  selection['chainTest'] = (l: any) => StructureProperties.chain.auth_asym_id(l.element) === chainId;
  selection['residueTest'] = (l: any) => {
    const authSeqId = StructureProperties.residue.auth_seq_id(l.element);
    return authSeqId === parseInt(resId);
  };
  selection['atomTest'] = (l: any) => {
    const lblAtomId = StructureProperties.atom.label_atom_id(l.element);
    return lblAtomId === atomId;
  };
  const queryLoci = Queries.generators.atoms(selection);

  const sel = StructureQuery.run(queryLoci, data);
  const loci = StructureSelection.toLociWithSourceUnits(sel);
  return loci;
}

type StructureMeasurementManagerAddOptions = {
  customText?: string;
  color?: PD.Color;
  selectionTags?: string | string[];
  reprTags?: string | string[];
  lineParams?: Partial<PD.Values<LineParams>>;
  labelParams?: Partial<PD.Values<LociLabelTextParams>>;
};

async function addCustomInteraction(
  viewer: any,
  a: StructureElement.Loci,
  b: StructureElement.Loci,
  options: StructureMeasurementManagerAddOptions & {
    visualParams?: Partial<StateTransformer.Params<typeof StateTransforms.Representation.StructureSelectionsDistance3D>>;
  }
) {
  const cellA = viewer.helpers.substructureParent.get(a.structure);
  const cellB = viewer.helpers.substructureParent.get(b.structure);
  const dependsOn = [cellA.transform.ref];
  arraySetAdd(dependsOn, cellB.transform.ref);
  const update = getGroup(viewer);
  update
    .apply(
      StateTransforms.Model.MultiStructureSelectionFromExpression,
      {
        selections: [
          { key: 'a', groupId: 'a', ref: cellA.transform.ref, expression: StructureElement.Loci.toExpression(a) },
          { key: 'b', groupId: 'b', ref: cellB.transform.ref, expression: StructureElement.Loci.toExpression(b) },
        ],
        isTransitive: true,
        label: 'Distance',
      },
      { dependsOn, tags: options?.selectionTags }
    )
    .apply(
      StateTransforms.Representation.StructureSelectionsDistance3D,
      {
        customText: options.customText || '',
        unitLabel: 'Å',
        linesColor: options.color,
        ...(options?.lineParams as any),
        ...options?.labelParams,
        ...options?.visualParams,
      },
      { tags: options?.reprTags }
    );
  const state = viewer.state.data;
  await PluginCommands.State.Update(viewer.plugin, { state, tree: update, options: { doNotLogTiming: true } });
}

export function addContact(viewer: any, contactPair: any) {
  const { pair, interactionType, color } = contactPair ?? {};
  if (pair.length !== 2) return;
  const loci1 = getAtomLoci(viewer, pair[0]);
  const loci2 = getAtomLoci(viewer, pair[1]);
  console.log(loci1, loci2, 'ssss');
  if (loci1 && loci2) {
    addCustomInteraction(viewer, loci1, loci2, { color: color });
  }
}

// addContact({
//   pair: [{
//     structure: objdata,
//     chainId: 'A',
//     resId: 115,
//     atomName: ['CE2', 'CZ', 'CE1', 'CD1', 'CG', 'CD2']
//   }, {
//     structure: objdata,
//     chainId: 'A',
//     resId: 110,
//     atomName: 'CB'
//   }],
//   interactionType: 'Interaction test',
//   color: color
// });
