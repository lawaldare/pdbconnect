import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationArticleComponent } from '../citation-article/citation-article.component';
import { Article } from '../../models/article.model';

@Component({
  selector: 'pdbe-citation-publication',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent],
  templateUrl: './citation-publication.component.html',
  styleUrl: './citation-publication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationPublicationComponent {
  public publicationInfo = input.required<Article[]>();
  public entryId = input.required<string>();
  public headerText = input.required<string>();
}
