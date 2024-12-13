import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantDirective } from '../../../directives/participants.directive';
import { ComplexSymmetryPipe } from '../../../pipes/symmetry.pipe';
import { Assembly } from '../../../models/complex-structure.model';
import { OEMCDirective } from '../../../directives/oemc.directive';
import { MaterialModule } from '@pdbc/core';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule, MaterialModule, ParticipantDirective, ComplexSymmetryPipe, OEMCDirective],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
  public summaryData = toSignal(
    this.globalStore.select(ComplexSelectors.complexData).pipe(
      map((data) => {
        return {
          ...data,
          unique_observed_experimental_methods_with_counts: this.countPdbIdExperimentalMethod(data.assemblies),
        };
      })
    )
  );
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  private countPdbIdExperimentalMethod(data: Assembly[]) {
    const methodCounts = {} as any;

    data.forEach((entry) => {
      const { pdb_id, experimental_method } = entry;

      // Initialize the method in the counts object if not already done
      if (!methodCounts[experimental_method]) {
        methodCounts[experimental_method] = new Set();
      }

      // Add the pdb_id to the set for the method
      methodCounts[experimental_method].add(pdb_id);
    });

    // Convert sets to counts
    const result = {} as any;
    for (const method in methodCounts) {
      result[method] = methodCounts[method].size;
    }

    return result;
  }
}
