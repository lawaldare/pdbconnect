import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../../../data-models/article.model';

@Component({
  selector: 'pdbc-citation-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citation-article.component.html',
  styleUrl: './citation-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationArticleComponent {
  public article = input.required<Article>();
}
