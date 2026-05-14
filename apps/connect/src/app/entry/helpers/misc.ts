import { computed, effect, signal, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { Molecule } from '../data-models/molecule.model';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { ProcessedMacromolecule } from '../store/data-processing/models/processed-entities.model';
import { DownloadOptionWithData } from '@pdbe-lib/dropdown-menu';
import { QueryParamForHelpers } from './molstar-helpers';

export function makeEntityColors(macromolecules: ProcessedMacromolecule[] | undefined, ligands: ProcessedLigandOrMod[] | undefined) {
  const DEFAULT_ENTITY_COLOR = 'gray';
  const colors: { [entityId: string]: string } = {};
  for (const macromolecule of macromolecules ?? []) {
    colors[macromolecule.additionalData.molecule.entity_id] = macromolecule.molstarColorHex ?? DEFAULT_ENTITY_COLOR;
  }
  for (const ligand of ligands ?? []) {
    if (ligand.type === 'ligand') {
      colors[(ligand.additionalData.source as Molecule).entity_id] = ligand.molstarColorHex ?? DEFAULT_ENTITY_COLOR;
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

export class Dropdown<TData> {
  private _options: DownloadOptionWithData<TData>[] = [];
  private _optionMap: { [name: string]: DownloadOptionWithData<TData> } = {};
  private _selected = signal<string | undefined>(undefined);

  constructor(
    private readonly settings?: {
      /** Function which returns default option given a set of available options (if not provided, default option is the first one) */
      defaultOption?: (options: DownloadOptionWithData<TData>[]) => DownloadOptionWithData<TData> | undefined;
    }
  ) {}

  public get options() {
    return this._options;
  }
  /** Update options and reset `selected` to the first listed option (or to `undefined` if there are no options) */
  public updateOptions(options: DownloadOptionWithData<TData>[]) {
    this._options = options;
    this._optionMap = Object.fromEntries(options.map((opt) => [opt.name, opt]));
    const defaultOption = this.settings?.defaultOption ? this.settings.defaultOption(options) : options[0];
    this._selected.set(defaultOption?.name);
  }

  /** Set current selected value */
  public select(optionName: string | undefined) {
    if (optionName !== undefined && !(optionName in this._optionMap))
      throw new Error(`Trying to select invalid option "${optionName}" (available options: ${this.options})`);
    this._selected.set(optionName);
  }

  public selectedOption = computed<DownloadOptionWithData<TData> | undefined>(() => {
    const selected = this._selected();
    if (selected === undefined) return undefined;
    return this._optionMap[selected];
  });

  public selectedName = computed(() => this._selected());

  // public optionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {}; // TODO: @adam get rid of this
}

export function updateSymmetryDropdownOptions(
  symmetryDropdown: Dropdown<{ instanceId: string | undefined }>,
  symmOperators: string[] | undefined,
  urlPrefix: string
) {
  type SymmetryDropdownOption = (typeof symmetryDropdown)['options'][number];
  const options = (symmOperators ?? []).map(
    (op, idx): SymmetryDropdownOption => ({
      name: op,
      url: `${urlPrefix}${idx + 1}`, // not sure if this is really necessary
      downloadable: false,
      data: { instanceId: op !== 'All' ? op : undefined },
    })
  );
  symmetryDropdown.updateOptions(options);
}
