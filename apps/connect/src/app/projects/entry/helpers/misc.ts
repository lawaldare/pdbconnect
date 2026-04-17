import { Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Observable, take } from 'rxjs';
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
