import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'pdbe-citation-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citation-article.component.html',
  styleUrl: './citation-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationArticleComponent {
  @Input() article!: Article;
}
