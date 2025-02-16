import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '@pdbc/core';
import { StrucQualityGradientsComponent } from '../struc-quality-gradients/struc-quality-gradients.component';
import { modelQualitySummaryTooltip } from '../../entry-constant';
import { MaterialModule } from '@pdbc/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';

@Component({
  selector: 'pdbc-main-information-area',
  standalone: true,
  imports: [CommonModule, StrucQualityGradientsComponent, MaterialModule],
  templateUrl: './main-information-area.component.html',
  styleUrl: './main-information-area.component.scss',
})
export class MainInformationAreaComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly organismScientificNames = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly qualityScores = toSignal(this.globalStore.select(EntrySelectors.summaryQualityScores));

  public modelQualitySummaryTooltip = modelQualitySummaryTooltip;

  public mappedInformation: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public generateAuthorSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'all_authors');
  }

  public splitStringByCommas(str: string): string[] {
    return str.split(',').map((e) => e.trim());
  }
}
