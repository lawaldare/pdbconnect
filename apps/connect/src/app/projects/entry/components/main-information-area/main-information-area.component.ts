import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '@pdbc/core';
import { StrucQualityGradientsComponent } from '../struc-quality-gradients/struc-quality-gradients.component';

@Component({
  selector: 'pdbc-main-information-area',
  standalone: true,
  imports: [CommonModule, StrucQualityGradientsComponent],
  templateUrl: './main-information-area.component.html',
  styleUrl: './main-information-area.component.scss',
})
export class MainInformationAreaComponent {
  public readonly information = input.required<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  public mappedInformation: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  private readonly util = inject(UtilService);

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public generateAuthorSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'all_authors');
  }
}
