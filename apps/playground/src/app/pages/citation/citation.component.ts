import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, tap } from 'rxjs';
import { CitationArticleComponent } from '../../components/citation-article/citation-article.component';
import { CitationPublicationComponent } from '../../components/citation-publication/citation-publication.component';

@Component({
  selector: 'pdbe-citation',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, CitationPublicationComponent],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.scss',
})
export class CitationComponent {
  private playgroundService = inject(PlaygroundService);
  public entryId = '3d12'; //'7v08', '3d12'
  public relatedEntries!: string[];

  public pageData$ = combineLatest([
    this.playgroundService.getPrimaryPublicationAbstract(this.entryId),
    this.playgroundService.getArticleCitingPDBEntry(this.entryId),
  ]).pipe(
    map((data) => ({ sectionOne: data[0], sectionTwo: data[1] })),
    tap((data) => {
      this.setRelatedEntries(data.sectionOne.associated_entries);
    })
  );

  private setRelatedEntries(entries: string): void {
    this.relatedEntries = entries.split(',').map((entry) => entry.trim());
  }
}
