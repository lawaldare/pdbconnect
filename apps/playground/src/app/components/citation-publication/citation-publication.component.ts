import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationArticleComponent } from '../citation-article/citation-article.component';
import { Article } from '../../models/article.model';

@Component({
  selector: 'pdbe-citation-publication',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent],
  templateUrl: './citation-publication.component.html',
  styleUrl: './citation-publication.component.scss',
})
export class CitationPublicationComponent {
  @Input() publicationInfo!: Article[];
  @Input() entryId!: string;
  @Input() headerText!: string;

  public showFirstThree = true;

  public showAllArticles() {
    this.showFirstThree = false;
  }
}
