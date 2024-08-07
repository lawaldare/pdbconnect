import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrucExplorerEcm2024Component } from '../../components/struc-explorer-ecm-2024/struc-explorer-ecm-2024.component';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entry-ecm-2024',
  standalone: true,
  imports: [CommonModule, StrucExplorerEcm2024Component, PdbeLinkButtonComponent],
  templateUrl: './entry-ecm-2024.component.html',
  styleUrl: './entry-ecm-2024.component.scss',
})
export class EntryEcm2024Component {
  private readonly playgroundService = inject(PlaygroundService);

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'
  
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('entryId');
      if (id) {
        this.entryId.set(id); // Update the signal with the route parameter
        this.pageData$ = this.setPageData();
      }
    });
  }

  public pageData$ = this.setPageData();

  setPageData() {
    return combineLatest([
      this.playgroundService.getEntryEcmSummary(this.entryId()),
      this.playgroundService.getEntryEcmMolecules(this.entryId()),
      this.playgroundService.getEntryEcmExperiment(this.entryId()),
      this.playgroundService.getEntryEcmPublication(this.entryId())
    ]).pipe(
      map(([summary, molecules, experiment, publication]) => ({
        summary,
        molecules,
        experiment,
        publication
      }))
    );
  }

}
