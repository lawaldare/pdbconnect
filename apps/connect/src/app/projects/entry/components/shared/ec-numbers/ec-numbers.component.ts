import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';

@Component({
  selector: 'pdbc-ec-numbers',
  imports: [CommonModule],
  templateUrl: './ec-numbers.component.html',
  styleUrl: './ec-numbers.component.scss',
})
export class EcNumbersComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dialogRef = inject(MatDialogRef<EcNumbersComponent>);

  private readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));

  public ecMappingdata = computed(() => {
    const mappedData = Object.entries(this.ecMapping() ?? {}).reduce((acc: any[], [id, item]) => {
      acc.push({
        ...item,
        reaction: [...new Set(item.reaction)],
        synonyms: [...new Set(item.synonyms)],
        id,
      });
      return acc;
    }, []);
    return mappedData;
  });
}
