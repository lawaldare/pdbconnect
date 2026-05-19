import { assertInInjectionContext, computed, effect, signal, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { Molecule } from '../data-models/molecule.model';
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
