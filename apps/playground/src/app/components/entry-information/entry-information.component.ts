import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '@pdbc/core';

@Component({
  selector: 'pdbe-entry-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-information.component.html',
  styleUrl: './entry-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryInformationComponent {
  public readonly information = input.required<any>();
  public mappedInformation: any[] = [];
  private readonly util = inject(UtilService);

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }
}
