import type * as Builder from 'molstar/lib/extensions/mvs/tree/mvs/mvs-builder';
import type { ColorT, ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';

export type StandardComponentType = 'polymer' | 'branched' | 'branchedLinkage' | 'ligand' | 'ion' | 'nonstandard' | 'water';

export type StandardRepresentationType =
  | 'polymerCartoon'
  | 'branchedCarbohydrate'
  | 'branchedSticks'
  | 'branchedLinkageSticks'
  | 'ligandSticks'
  | 'ionSticks'
  | 'nonstandardSticks'
  | 'waterSticks';

export type StandardComponentCollection = { [type in StandardComponentType]?: Builder.Component };

export const StardardComponents: {
  [type in StandardComponentType]?: (struct: Builder.Structure) => Builder.Component | undefined;
} = {
  polymer(structure: Builder.Structure) {
    return structure.component({ selector: 'polymer', ref: 'component_polymer' });
  },
  branched(structure: Builder.Structure) {
    return structure.component({ selector: 'branched', ref: 'component_branched' });
  },
  branchedLinkage: undefined,
  ligand(structure: Builder.Structure) {
    return structure.component({ selector: 'ligand', ref: 'component_ligand' });
  },
  ion(structure: Builder.Structure) {
    return structure.component({ selector: 'ion', ref: 'component_ion' });
  },
  nonstandard(structure: Builder.Structure) {
    return structure.componentFromSource({
      schema: 'all_atomic',
      category_name: 'chem_comp',
      field_name: 'mon_nstd_flag',
      field_values: ['n', 'no'],
      field_remapping: { label_comp_id: 'id' },
      ref: 'component_nonstandard',
    });
  },
  water(structure: Builder.Structure) {
    return structure.component({ selector: 'water', ref: 'component_water' });
  },
};

export interface StandardRepresentationsOptions {
  opacityFactor?: number;
  skipComponents?: StandardComponentType[];
  sizeFactor?: number;
  custom?: Record<string, unknown>;
  refPrefix?: string;
}

export type StandardRepresentationCollection = { [type in StandardRepresentationType]?: Builder.Representation };

export const StandardRepresentations: {
  [type in StandardComponentType]?: (
    comp: Builder.Component,
    options: StandardRepresentationsOptions
  ) => { [repr in StandardRepresentationType]?: Builder.Representation };
} = {
  polymer(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      polymerCartoon: applyOpacity(
        component.representation({ type: 'cartoon', size_factor: options.sizeFactor, custom: options.custom, ref: makeRef(options.refPrefix, 'polymerCartoon') }),
        options.opacityFactor
      ),
    };
  },
  branched(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      branchedCarbohydrate: applyOpacity(
        component.representation({
          type: 'carbohydrate',
          size_factor: options.sizeFactor,
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'branchedCarbohydrate'),
        }),
        options.opacityFactor
      ),
      branchedSticks: applyOpacity(
        component.representation({
          type: 'ball_and_stick',
          size_factor: options.sizeFactor,
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'branchedSticks'),
        }),
        0.3 * (options.opacityFactor ?? 1)
      ),
    };
  },
  branchedLinkage(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      branchedLinkageSticks: applyOpacity(
        component.representation({
          type: 'ball_and_stick',
          size_factor: options.sizeFactor,
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'branchedLinkageSticks'),
        }),
        options.opacityFactor
      ),
    };
  },
  ligand(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      ligandSticks: applyOpacity(
        component.representation({
          type: 'ball_and_stick',
          size_factor: options.sizeFactor,
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'ligandSticks'),
        }),
        options.opacityFactor
      ),
    };
  },
  ion(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      ionSticks: applyOpacity(
        component.representation({ type: 'ball_and_stick', size_factor: options.sizeFactor, custom: options.custom, ref: makeRef(options.refPrefix, 'ionSticks') }),
        options.opacityFactor
      ),
    };
  },
  nonstandard(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      nonstandardSticks: applyOpacity(
        component.representation({
          type: 'ball_and_stick',
          size_factor: options.sizeFactor,
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'nonstandardSticks'),
        }),
        options.opacityFactor
      ),
    };
  },
  water(component: Builder.Component, options: StandardRepresentationsOptions) {
    return {
      waterSticks: applyOpacity(
        component.representation({
          type: 'ball_and_stick',
          size_factor: 0.5 * (options.sizeFactor ?? 1),
          custom: options.custom,
          ref: makeRef(options.refPrefix, 'waterSticks'),
        }),
        0.5 * (options.opacityFactor ?? 1)
      ),
    };
  },
};

function makeRef(prefix: string | undefined, suffix: string | undefined) {
  if (prefix === undefined || suffix === undefined) return undefined;
  return `${prefix}_${suffix}`;
}

export function applyStandardComponents(struct: Builder.Structure): StandardComponentCollection {
  const out: StandardComponentCollection = {};
  let compType: StandardComponentType;
  for (compType in StardardComponents) {
    const component = StardardComponents[compType]?.(struct);
    if (component) out[compType] = component;
  }
  return out;
}

export function applyStandardRepresentations(components: StandardComponentCollection, options: StandardRepresentationsOptions): StandardRepresentationCollection {
  const out: StandardRepresentationCollection = {};
  let compType: StandardComponentType;
  let reprType: StandardRepresentationType;
  for (compType in components) {
    if (options.skipComponents?.includes(compType)) continue;
    const component = components[compType];
    if (!component) continue;
    const representations = StandardRepresentations[compType]?.(component, options);
    if (!representations) continue;
    for (reprType in representations) {
      out[reprType] = representations[reprType];
    }
  }
  return out;
}

export function atomicRepresentations(reprs: StandardRepresentationCollection): Builder.Representation[] {
  return [reprs.ligandSticks, reprs.ionSticks, reprs.nonstandardSticks, reprs.branchedSticks, reprs.branchedLinkageSticks].filter(
    ((repr) => repr !== undefined) as (repr: any) => repr is Builder.Representation
  );
  // I think it's better not to color waters by default as they can be distracting
}

export function applyEntityColors(repr: Builder.Representation, colors: { [entityId: string]: ColorT }, missingColor: ColorT | undefined) {
  repr.colorFromSource({
    schema: 'all_atomic',
    category_name: 'entity',
    field_remapping: { label_entity_id: 'id' },
    field_name: 'id',
    palette: { kind: 'categorical', colors: colors, missing_color: missingColor },
  });
}

export function applyElementColors(repr: Builder.Representation, selector?: ComponentExpressionT | ComponentExpressionT[]) {
  repr.colorFromSource({
    schema: 'all_atomic',
    category_name: 'atom_site',
    field_name: 'type_symbol',
    palette: { kind: 'categorical', colors: 'ElementSymbol' },
    selector: selector,
  });
}

export function applyOpacity(repr: Builder.Representation, opacity: number | undefined) {
  if (opacity !== undefined && opacity !== 1) return repr.opacity({ opacity });
  else return repr;
}

/** Return list of unique/distinct values from `values` in the order of their first occurrence.
 * If `key` is provided, use it to judge equality. */
export function unique<T>(values: T[]): T[];
export function unique<T, K>(values: T[], key: (v: T) => K): T[];
export function unique<T, K>(values: T[], key: (v: T) => K = ((x: T) => x) as any) {
  const out: T[] = [];
  const seen = new Set<K>();
  for (const value of values) {
    const k = key(value);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(value);
    }
  }
  return out;
}

export function max<T>(array: T[]): T;
export function max<T, V>(array: T[], key: (elem: T) => V): T;
export function max<T, V>(array: T[], key: (elem: T) => V = ((x: T) => x) as any): T {
  let argMax = array[0];
  let max = key(argMax);
  for (const elem of array) {
    const value = key(elem);
    if (value > max) {
      argMax = elem;
      max = value;
    }
  }
  return argMax;
}

export function groupBy<T>(items: T[], key: (item: T) => string | number): { [key: string]: T[] } {
  const out: { [key: string]: T[] } = {};
  for (const item of items) {
    (out[key(item)] ??= []).push(item);
  }
  return out;
}

export function wholeResidues(selection: ComponentExpressionT[]): ComponentExpressionT[] {
  const selectionWithoutAtomConstraints: ComponentExpressionT[] = selection.map(
    (s) =>
      ({
        ...s,
        atom_id: undefined,
        atom_index: undefined,
        label_atom_id: undefined,
        auth_atom_id: undefined,
        type_symbol: undefined,
      }) satisfies ComponentExpressionT
  );
  return unique(selectionWithoutAtomConstraints, JSON.stringify);
}

export function customTooltipText(...lines: string[]) {
  return '<div class="mvs-custom-tooltip-box">' + lines.join('<br>') + '</div>';
}

export function assemblyText(entryId: string, assemblyId: string | undefined) {
  const ass = assemblyId === undefined ? 'the deposited model' : `complex (assembly) ${assemblyId}`;
  return `${ass} of PDB entry ${entryId}`;
}
