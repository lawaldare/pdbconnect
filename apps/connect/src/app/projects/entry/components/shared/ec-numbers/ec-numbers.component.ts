import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { UniProtMappingObj } from '../../../data-models/uniprot-mapping.model';

@Component({
  selector: 'pdbc-ec-numbers',
  imports: [CommonModule],
  templateUrl: './ec-numbers.component.html',
  styleUrl: './ec-numbers.component.scss',
})
export class EcNumbersComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dialogRef = inject(MatDialogRef<EcNumbersComponent>);
  public readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));

  public ecMappingdata = computed(() => {
    const mappedData = Object.entries(this.ecMapping() ?? {}).reduce((acc: any[], [id, item]) => {
      // Filter mappings by entity_id
      const filteredMappings = (item.mappings ?? []).filter((m: UniProtMappingObj) => m.entity_id === this.dialogData.entityId);

      // Only include EC that have at least one relevant mapping
      if (filteredMappings.length > 0) {
        acc.push({
          ...item,
          id,
          reaction: [...new Set(item.reaction)],
          synonyms: [...new Set(item.synonyms)],
        });
      }
      return acc;
    }, []);
    return mappedData;
  });
}
