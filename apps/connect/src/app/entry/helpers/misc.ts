import { assertInInjectionContext, computed, effect, signal, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { AssemblyData } from '../data-models/assembly.model';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { ProcessedMacromolecule } from '../store/data-processing/models/processed-entities.model';
import { max, unique } from './mvs-views/helpers';

export function makeEntityColors(macromolecules: ProcessedMacromolecule[] | undefined, ligands: ProcessedLigandOrMod[] | undefined) {
  const DEFAULT_ENTITY_COLOR = 'gray';
  const colors: { [entityId: string]: string } = {};
  for (const macromolecule of macromolecules ?? []) {
    colors[macromolecule.additionalData.molecule.entity_id] = macromolecule.molstarColorHex ?? DEFAULT_ENTITY_COLOR;
  }
  for (const ligand of ligands ?? []) {
    if (ligand.type === 'ligand') {
      colors[ligand.additionalData.source.entity_id] = ligand.molstarColorHex ?? DEFAULT_ENTITY_COLOR;
    }
  }
  return colors;
}

/** Return observable which emits when the value of `signal` becomes truthy for the first time, and then completes.
 * Can only be called in injection context (such as a constructor, a factory function, a field initializer). */
export function whenSignalFirstTrue<T>(signal: Signal<T>): Observable<T> {
  return toObservable(signal).pipe(
    filter((value) => !!value),
    take(1)
  );
}

/** Convert Signal to BehaviorSubject (emits one additional `undefined` in the beginning). */
export function toBehaviorSubject<T>(signal: Signal<T>): BehaviorSubject<T | undefined> {
  const subject = new BehaviorSubject<T | undefined>(undefined);
  effect(() => subject.next(signal()));
  return subject;
}

/** Divide items into groups defined by result of `key` function on each item.
 * E.g.:
 * ```
 * >>> groupBy(['hello', 'world', 'with', 'humble', 'whales'], str => str[0])
 * { 'h': ['hello', 'humble'], 'w': ['world', 'with', 'whales'] }
 * ```
 */
export function groupBy<T>(items: T[], key: (item: T) => string | number): { [key: string]: T[] } {
  const out: { [key: string]: T[] } = {};
  for (const item of items) {
    (out[key(item)] ??= []).push(item);
  }
  return out;
}

/** Sort items by value of `key` function on each item (like `sort` in Python). Mutates the array and returns a reference to the same array. */
export function sortBy<T, K>(items: T[], key: (item: T) => K): T[] {
  return items.sort((a, b) => {
    const keyA = key(a);
    const keyB = key(b);
    if (keyA > keyB) return 1;
    if (keyA < keyB) return -1;
    return 0;
  });
}

export interface DropdownOptionWithData<TCustomData> extends DownloadOption {
  data: TCustomData;
}

export class Dropdown<TData> {
  private _options: DropdownOptionWithData<TData>[] = [];
  private _optionMap: { [name: string]: DropdownOptionWithData<TData> } = {};
  private _selectedOption = signal<DropdownOptionWithData<TData> | undefined>(undefined);

  constructor(
    private readonly settings?: {
      /** Function which returns set of available options. If this function reads Angular signal, options will automatically update when signal value change. `autoOptions` can only be used within injection context. */
      autoOptions?: () => DropdownOptionWithData<TData>[];
      /** Function which returns default option given a set of available options (if not provided, default option is the first one) */
      defaultOption?: (options: DropdownOptionWithData<TData>[]) => DropdownOptionWithData<TData> | undefined;
    }
  ) {
    if (settings?.autoOptions) {
      try {
        assertInInjectionContext(this.constructor);
      } catch (e) {
        throw new Error(`new Dropdown with autoOptions can only be used within an injection context (${e})`);
      }
      effect(() => {
        const newOptions = settings.autoOptions!();
        this._updateOptions(newOptions);
      });
    }
  }

  public get options() {
    return this._options;
  }

  /** Update options and reset `selected` to the first listed option (or to `undefined` if there are no options) */
  public updateOptions(options: DropdownOptionWithData<TData>[]) {
    if (this.settings?.autoOptions) throw new Error('Calling `updateOptions` is invalid if `autoOptions` is set');
    this._updateOptions(options);
  }
  private _updateOptions(options: DropdownOptionWithData<TData>[]) {
    this._options = options;
    this._optionMap = Object.fromEntries(options.map((opt) => [opt.name, opt]));
    const defaultOption = this.settings?.defaultOption ? this.settings.defaultOption(options) : options[0];
    this.select(defaultOption?.name);
  }

  /** Set current selected value */
  public select(optionName: string | undefined) {
    if (optionName !== undefined && !(optionName in this._optionMap))
      throw new Error(`Trying to select invalid option "${optionName}" (available options: ${this.options})`);
    const option = optionName !== undefined ? this._optionMap[optionName] : undefined;
    this._selectedOption.set(option);
  }

  public selectedOption = computed<DropdownOptionWithData<TData> | undefined>(() => {
    return this._selectedOption();
  });

  public selectedName = computed(() => this._selectedOption()?.name);
}

function reconstructInstances(ass: AssemblyData) {
  const allChains = ass.entities.flatMap((ent) => ent.in_chains);
  const uniqueSuffixes = unique(allChains.map((chain) => chain.match(/-(.*)$/)?.[1])); // Cannot use .split() because there can be multiple separators (e.g. A-1-62)
  const allAsmOperatorCombos = uniqueSuffixes.map((suffix) => (suffix !== undefined ? suffix.split('-') : [])); // TODO: fix these not being really unique

  // console.log(`allAsmOperatorCombos ${allAsmOperatorCombos.length}:`, ...allAsmOperatorCombos.map(ops => ['ASM', ...ops].join('-')))
  const order = max(allAsmOperatorCombos.map((ops) => ops.length));

  const DEFAULT_OPERATOR = '1'; // This is far from ideal, but it's not possible to guess the default operator, as the operator expression can be wild (1smv assembly 5: 'P', 1m4x assembly 2: '(61-88)', 1e94 assembly 2: '1,7,8,9,10,11')

  if (order === 0) {
    // single instance; assume its operator is '1'; no chain renaming (real order is 1)
    return [[DEFAULT_OPERATOR]];
  }

  if (order === 1) {
    // instance ~ operator; assume first instance's operator is '1'
    const operators = allAsmOperatorCombos.map((ops) => ops[0] ?? DEFAULT_OPERATOR);
    return sortNumeric(operators).map((op) => [op]);
  }

  // instance ~ operator combination; get first instance's name by which is missing
  const operatorsOnPositions: string[][] = [];
  for (let i = 0; i < order; i++) {
    const operatorsI = sortNumeric(unique(allAsmOperatorCombos.map((ops) => ops[i]).filter((op) => op !== undefined)));
    operatorsOnPositions.push(operatorsI);
    // console.log(`Position ${i} operators (${operatorsI.length}):`, ...operatorsI)
  }
  // TODO: solve case '(X0)(1-20)'
  return cartesianProduct(operatorsOnPositions);
  // if (reconstructedInstances.length !== allAsmOperatorCombos.length) throw new Error('Failed to reconstruct instance_id correspondence');
}

/**
 * Return cartesian product of given sets. E.g.:
 * ```
 * cartesianProduct([[1, 2], ['a', 'b']]);
 * // => [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * ```
 * */
function cartesianProduct<T>(sets: T[][]): T[][] {
  if (sets.length === 0) return [[]];
  const heads = sets[sets.length - 1]; // head is the last element of list
  const tails = cartesianProduct(sets.slice(0, sets.length - 1)); // tail is all elements but the last
  const out: T[][] = [];
  for (const tail of tails) {
    for (const head of heads) {
      out.push([...tail, head]);
    }
  }
  return out;
}

const INTEGER_REGEX = /^[+-]?\d+$/;

/** Compare strings numerically, if they represent integers. (Any non-integer string is > any integer string. Order of non-interger strings is the default string sort order.) */
function compareNumeric(a: string, b: string): number {
  if (a.match(INTEGER_REGEX)) {
    if (b.match(INTEGER_REGEX)) {
      // Both are integers -> compare numerically
      return parseInt(a) - parseInt(b);
    } else {
      // Only a is integer -> a<b
      return -1;
    }
  } else {
    if (b.match(INTEGER_REGEX)) {
      // Only b is integer -> b<a
      return 1;
    } else {
      // Neither is integer -> default string comparison
      if (a < b) return -1;
      if (a === b) return 0;
      return 1;
    }
  }
}

/** Compare two lists using lexical ordering. */
function compareLists<T>(a: T[], b: T[], compareElements: (ai: T, bi: T) => number = (ai, bi) => (ai < bi ? -1 : ai > bi ? 1 : 0)): number {
  const aLength = a.length;
  const bLength = b.length;
  for (let i = 0; ; i++) {
    if (i >= aLength && i >= bLength) return 0; // Both lists finished
    if (i >= aLength) return -1; // Only list a finished
    if (i >= bLength) return 1; // Only list b finished
    const cmp = compareElements(a[i], b[i]);
    if (cmp !== 0) return cmp;
  }
}

/** Compare two lists using lexical ordering with numeric ordering of elements. */
function compareListsNumeric(a: string[], b: string[]): number {
  return compareLists(a, b, compareNumeric);
}

/** Sort strings numerically, if they represent integers. Put non-integer string at the end, in the default string sort order. */
function sortNumeric(items: string[]): string[] {
  return items.sort(compareNumeric);
}

/** Sort symmetry instance IDs in the same order as when assembly CIFs are created, so that sequential suffixes ('', '_2', '_3') will match.
 * This is guesswork, it is not possible to determine this order just from operator names. But should work for nice cases.
 */
export function sortSymmetryInstanceIds(instanceIds: string[]): string[] {
  return instanceIds
    .map((id) => id.split('-'))
    .sort(compareListsNumeric)
    .map((parts) => parts.join('-'));
}

export interface SymmetryOperatorMapping {
  /** Maps symmetry operator (e.g. 'ASM-1', 'ASM-3', 'ASM-2-62') to sequential suffix for renaming chains (e.g. '', '_2', '_3') */
  symOperatorToSuffix: { [symOp: string]: string };
  /** Maps sequential suffix for renaming chains (e.g. '', '_2', '_3') to symmetry operator (e.g. 'ASM-1', 'ASM-3', 'ASM-2-62') */
  suffixToSymOperator: { [suffix: string]: string };
}

export const SymmetryOperatorMapping = {
  getSymmetryOperatorMapping(symOperators: string[]): SymmetryOperatorMapping {
    const ALL_VALUE = 'All';
    const sortedSymOperators = sortSymmetryInstanceIds(symOperators.filter((op) => op !== ALL_VALUE));
    const symOperatorToSuffix: { [symOp: string]: string } = {};
    const suffixToSymOperator: { [suffix: string]: string } = {};
    for (let i = 0; i < sortedSymOperators.length; i++) {
      const op = sortedSymOperators[i];
      const suffix = i === 0 ? '' : `_${i + 1}`;
      symOperatorToSuffix[op] = suffix;
      suffixToSymOperator[suffix] = op;
    }
    return {
      /** Maps symmetry operator (e.g. 'ASM-1', 'ASM-3', 'ASM-2-62') to sequential suffix for renaming chains (e.g. '', '_2', '_3') */
      symOperatorToSuffix,
      /** Maps sequential suffix for renaming chains (e.g. '', '_2', '_3') to symmetry operator (e.g. 'ASM-1', 'ASM-3', 'ASM-2-62') */
      suffixToSymOperator,
    };
  },

  getRenamedChain(authAsymId: string, instanceId: string | undefined, symmetryOperatorMapping: SymmetryOperatorMapping | undefined) {
    if (instanceId === undefined || symmetryOperatorMapping === undefined) return authAsymId;
    const suffix = symmetryOperatorMapping.symOperatorToSuffix[instanceId] ?? '';
    return authAsymId + suffix;
  },

  /** Reconstruct chain ID and symmetry instance ID from renamed chain.
   * If symmetryOperatorMapping is undefined, assume this is not an assembly and always return symmetry instance ID `undefined`. */
  getChainIdAndInstanceIdFromRenamedChain(
    renamedChain: string,
    symmetryOperatorMapping: SymmetryOperatorMapping | undefined
  ): [chainId: string, instanceId: string | undefined] {
    const [_, chainId, suffix] = renamedChain.match(/^([^_]*)(.*)$/)!;
    if (symmetryOperatorMapping) {
      const instanceId = symmetryOperatorMapping.suffixToSymOperator[suffix];
      return [chainId, instanceId];
    } else {
      return [chainId, undefined];
    }
  },
} as const;
