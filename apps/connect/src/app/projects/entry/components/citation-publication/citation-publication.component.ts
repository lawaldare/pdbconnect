import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationArticleComponent } from '../citation-article/citation-article.component';
import { Article } from '../../data-models/article.model';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-citation-publication',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, MaterialModule],
  templateUrl: './citation-publication.component.html',
  styleUrl: './citation-publication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitationPublicationComponent implements OnInit {
  public publicationInfo = input.required<Article[]>();
  public entryId = input.required<string>();
  public headerText = input.required<string>();
  public showFirstFive = signal(true);
  public pagedPublicationInfo!: Article[];
  public pageLength = signal(0);
  public pageSize = signal(10);
  public readonly pageSizeOptions = [5, 10, 15, 20];
  public pageIndex = 0;

  ngOnInit(): void {
    this.pageLength.set(this.publicationInfo().length);
    this.pagedPublicationInfo = this.publicationInfo().slice(0, this.pageSize());
  }

  public showAllArticles(): void {
    this.showFirstFive.update((value) => !value);
  }

  public handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize.set(event.pageSize);
    const startIndex = this.pageIndex * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.pagedPublicationInfo = this.publicationInfo().slice(startIndex, endIndex);
  }
}
