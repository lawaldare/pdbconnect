import { assertInInjectionContext, computed, effect, signal, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { ProcessedMacromolecule } from '../store/data-processing/models/processed-entities.model';

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

/** Return maximum of `array`.
 * If `key` is provided, return the element which gives the greatest `key(element)`. */
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

/**
 * Small state container for dropdown options and the currently selected option.
 *
 * Example 1:
 *
 *   public dropdown = new Dropdown<CommonDropdownOptionData>({
 *     autoOptions: () =>
 *       makeMacromoleculeChainDropdownOptions(this.currentMacromoleculeDatum()),
 *   });
 *
 *   public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
 *     autoOptions: () =>
 *       makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
 *   });
 *
 * In the example above:
 *
 *   - the chain dropdown options are derived from the current macromolecule;
 *   - the symmetry dropdown options are derived from the selected chain option;
 *   - when the macromolecule changes, the chain dropdown is rebuilt;
 *   - when the selected chain changes, the symmetry dropdown is rebuilt.
 *
 * Example 2:
 *
 *   public downloadDropdown = new Dropdown<DownloadData>();
 *
 *   async updateDownloadOptions(entry: Entry) {
 *     const options = await makeDownloadOptions(entry);
 *
 *     this.downloadDropdown.updateOptions(options);
 *   }
 *
 *   onDownloadSelect(optionName: string) {
 *     this.downloadDropdown.select(optionName);
 *
 *     const selected = this.downloadDropdown.selectedOption();
 *     const url = selected?.data.url;
 *
 *     if (url) {
 *       this.downloadFile(url);
 *     }
 *   }
 *
 * Important side effect:
 *
 * Whenever the list of options is updated, the selected option is reset to the
 * default option. If no custom `defaultOption` function is provided, the first
 * option is selected. If the options array is empty, the selected option becomes
 * `undefined`.
 *
 * This behavior is intentional because most dropdowns in the application should
 * always point to a valid option after their source data changes.
 *
 * However, it also means that updating options can trigger downstream reactive
 * updates. For example, if another dropdown uses this dropdown's selected option
 * inside its own `autoOptions`, that dropdown may also update automatically.
 */
export class Dropdown<TData> {
  private _options: DropdownOptionWithData<TData>[] = [];
  private _optionMap: { [name: string]: DropdownOptionWithData<TData> } = {};

  /**
   * Internal writable signal containing the selected option.
   *
   * Consumers should not set this directly. Use `select()` instead so that option
   * names are validated against the current option map.
   */
  private _selectedOption = signal<DropdownOptionWithData<TData> | undefined>(undefined);

  constructor(
    private readonly settings?: {
      /**
       * Function which returns set of available options.
       * If this function reads Angular signal, the dropdown options will be recomputed automatically whenever those signals change.
       * `autoOptions` can only be used within injection context because it is wrapped in an Angular `effect`
       * Do not call `updateOptions()` manually when `autoOptions` is provided.
       * The dropdown owns its updates through the effect.
       */
      autoOptions?: () => DropdownOptionWithData<TData>[];

      /**
       * Chooses which option should be selected from a set of available options after the options list is changed.
       *
       * (if not provided, default option is the first one)
       *
       * This function is called every time options are updated, including every
       * time `autoOptions` recomputes.
       *
       */
      defaultOption?: (options: DropdownOptionWithData<TData>[]) => DropdownOptionWithData<TData> | undefined;
    }
  ) {
    if (settings?.autoOptions) {
      try {
        assertInInjectionContext(this.constructor);
      } catch (e) {
        throw new Error(`new Dropdown with autoOptions can only be used within an injection context (${e})`);
      }
      /**
       * Keep set of options in sync with the reactive data used by `autoOptions` or by `_updateOptions` calls
       */
      effect(() => {
        const newOptions = settings.autoOptions!();
        this._updateOptions(newOptions);
      });
    }
  }

  /**
   * Current list of available dropdown options.
   *
   * This is updated either manually through `updateOptions()` or automatically
   * through `autoOptions`.
   */
  public get options() {
    return this._options;
  }

  /**
   * Manually replace the dropdown options.
   *
   * This method also resets the selected option to the default option.
   *
   * Use this only for non-reactive dropdowns.
   *
   * If the dropdown was created with `autoOptions`, calling this method is invalid
   * because the options are owned by the Angular effect created in the constructor.
   */
  public updateOptions(options: DropdownOptionWithData<TData>[]) {
    if (this.settings?.autoOptions) throw new Error('Calling `updateOptions` is invalid if `autoOptions` is set');
    this._updateOptions(options);
  }

  /**
   * Internal option update implementation.
   *
   * Replaces the option list, rebuilds the lookup map, and resets the selected
   * option to the default option.
   */
  private _updateOptions(options: DropdownOptionWithData<TData>[]) {
    this._options = options;
    this._optionMap = Object.fromEntries(options.map((opt) => [opt.name, opt]));
    const defaultOption = this.settings?.defaultOption ? this.settings.defaultOption(options) : options[0];
    this.select(defaultOption?.name);
  }

  /**
   * Selects an option by name.
   *
   * Passing `undefined` clears the selection.
   */
  public select(optionName: string | undefined) {
    if (optionName !== undefined && !(optionName in this._optionMap))
      throw new Error(`Trying to select invalid option "${optionName}" (available options: ${this.options})`);
    const option = optionName !== undefined ? this._optionMap[optionName] : undefined;
    this._selectedOption.set(option);
  }

  /**
   * Currently selected dropdown option.
   *
   * This is a computed signal.
   */
  public selectedOption = computed<DropdownOptionWithData<TData> | undefined>(() => {
    return this._selectedOption();
  });

  /**
   * Name of the currently selected option.
   *
   * This is a convenience computed signal.
   */
  public selectedName = computed(() => this._selectedOption()?.name);
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

/** Sort symmetry instance IDs in the same order as when assembly CIFs are created, so that sequential suffixes ('', '_2', '_3') will match.
 * This is guesswork, it is not possible to determine this order just from operator names. But should work for nice cases.
 */
export function sortSymmetryInstanceIds(instanceIds: string[]): string[] {
  return instanceIds
    .map((id) => id.split('-'))
    .sort((a, b) => compareLists(a, b, compareNumeric))
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

/** Try to guess symmetry instance ID of the implicitely named symmetry instance from all other symmetry instances.
 * ```
 * > guessMissingSymmetryInstanceId(['ASM-2', 'ASM-3', 'ASM-4']) // most cases
 * 'ASM-1'
 *
 * > guessMissingSymmetryInstanceId(['ASM-1-62', 'ASM-2-61', 'ASM-2-62', 'ASM-3-61', 'ASM-3-62', 'ASM-4-61', 'ASM-4-62'])) // case of 1m4x
 * 'ASM-1-61'
 * ```
 */
export function guessMissingSymmetryInstanceId(presentSymmetryInstanceIds: string[]) {
  const DEFAULT_OPERATOR = '1'; // This is far from ideal, but it's not possible to guess the default operator, as the operator expression can be wild (1smv assembly 5: 'P', 1m4x assembly 2: '(61-88)', 1e94 assembly 2: '1,7,8,9,10,11')

  if (presentSymmetryInstanceIds.length === 0) {
    return 'ASM-' + DEFAULT_OPERATOR;
  }

  const presentCombos = presentSymmetryInstanceIds.map((instanceId) => instanceId.split('-').slice(1, undefined));
  const order = presentCombos[0].length;
  if (!presentCombos.every((combo) => combo.length === order))
    throw new Error('Could not guess missing symmetry instance ID because not all instance IDs have the same number of operators.');

  if (order === 1) {
    // Instance ID ~ Symmetry operator
    return 'ASM-' + DEFAULT_OPERATOR;
  }

  // Instance ID ~ Combination of symmetry operators
  const operatorCountsOnPositions: { [op: string]: number }[] = [];
  for (let position = 0; position < order; position++) {
    const countsHere: { [op: string]: number } = {};
    for (const combo of presentCombos) {
      const operator = combo[position];
      countsHere[operator] = (countsHere[operator] ?? 0) + 1;
    }
    operatorCountsOnPositions.push(countsHere);
  }

  const nCombosTheor = operatorCountsOnPositions.reduce((product, counts) => product * Object.keys(counts).length, 1);
  if (nCombosTheor === presentSymmetryInstanceIds.length + 1) {
    // Case '(1-60)(61-88)'
    const missingOps: string[] = [];
    for (let position = 0; position < order; position++) {
      const operatorsHere = Object.keys(operatorCountsOnPositions[position]);
      const countTheor = nCombosTheor / operatorsHere.length;
      const missingOpHere = operatorsHere.find((op) => operatorCountsOnPositions[position][op] < countTheor);
      if (missingOpHere === undefined) throw new Error('Could not guess missing symmetry assembly ID (counts do not match).');
      missingOps.push(missingOpHere);
    }
    return 'ASM-' + missingOps.join('-');
  }

  if (nCombosTheor === presentSymmetryInstanceIds.length) {
    // Case '(X0)(1-20)'
    let positionToComplete = 0;
    for (let position = 0; position < order; position++) {
      if (Object.keys(operatorCountsOnPositions[position]).length > 1) {
        positionToComplete = position;
        break;
      }
    }
    const missingOps = operatorCountsOnPositions.map((counts, position) => (position === positionToComplete ? DEFAULT_OPERATOR : Object.keys(counts)[0]));
    return 'ASM-' + missingOps.join('-');
  }

  throw new Error('Could not guess missing symmetry assembly ID (unknown case).');
}

/** Retrieve list of symmetry instance IDs from renamed chains. All renamed chains must be unique and must have the same original chain ID.
 * ```
 * > getSymmetryInstancesFromRenamedChains(['A', 'A-2', 'A-3', 'A-4'])
 * ['ASM-1', 'ASM-2', 'ASM-3', 'ASM-4']
 * ```
 * */
export function getSymmetryInstancesFromRenamedChains(renamedChains: string[]) {
  const explicitCases = renamedChains
    .filter((renamedChain) => renamedChain.includes('-'))
    .map((renamedChain) => 'ASM-' + renamedChain.split('-').slice(1, undefined).join('-')); // Has to work also for instance IDs with multiple operators, e.g. ASM-2-61

  if (explicitCases.length === renamedChains.length) {
    // All instances explicitely named (e.g. A-1, A-2, A-3, A-4)
    return sortSymmetryInstanceIds(explicitCases);
  } else {
    // One of the instances is not explicitely named (e.g. A, A-2, A-3, A-4)
    const implicitInstanceId = guessMissingSymmetryInstanceId(explicitCases);
    explicitCases.push(implicitInstanceId);
    return sortSymmetryInstanceIds(explicitCases);
  }
}
