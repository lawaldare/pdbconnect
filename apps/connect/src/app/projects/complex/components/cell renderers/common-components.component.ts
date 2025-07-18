import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { ComplexInteraction } from '../../models/complex-structure.model';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `

	@if(showLess()){ @for(participant of participants().slice(0,4); track participant.accession){
      <div style="margin-bottom: 0">
        @if(participant.accession_type === 'UniProt' || participant.accession_type === 'Rfam'){ @let proteinLink = 'https://www.uniprot.org/uniprotkb/' +
        participant.accession; @let rfLink = 'https://rfam.org/family/' + participant.accession; @let link = participant.accession.startsWith('RF') ? rfLink :
        proteinLink;
        <span>
          <a [href]="link" target="_blank" class="pfam-link">{{ participant.accession }}</a> ({{ participant.name }}, {{ participant.stoichiometry }} {{
          participant.stoichiometry > 1 ? 'copies' : 'copy' }})
        </span>
        }@else {
        <span>{{ participant.accession }} ({{ participant.name }}, {{ participant.stoichiometry }} {{ participant.stoichiometry > 1 ? 'copies' : 'copy' }})</span>
        }
      </div>
      } @if(participants().length > 5){
      <p role="button" class="view-more" (click)="viewMore()" style="color:#3b6fb6; cursor: pointer">Show all ({{participants().length}})</p>
      } }@else { @for(participant of participants(); track participant.accession){
      <div style="margin-bottom: 0">
        <span>{{ participant.accession }} ({{ participant.name }}, {{ participant.stoichiometry }} {{ participant.stoichiometry > 1 ? 'copies' : 'copy' }})</span>
      </div>
      }
      <p role="button" class="view-more" (click)="viewMore()" style="color:#3b6fb6; cursor: pointer">Show less</p>
      }
	`,
})
export class CommonComponentsRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public data!: ComplexInteraction;

  public participants = computed(() => {
    return this.data.relationship_type === 'sub-complex' ? this.data.common_participants : this.data.additional_participants;
  });
  public subTitle = computed(() => {
    return this.data.relationship_type === 'sub-complex' ? 'Common' : 'Additional';
  });
  public showLess = signal<boolean>(true);
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  public viewMore(): void {
    this.showLess.update((value) => !value);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.data = params.data;
    return true;
  }
}
