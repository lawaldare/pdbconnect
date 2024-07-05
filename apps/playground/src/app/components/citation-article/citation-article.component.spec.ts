import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitationArticleComponent } from './citation-article.component';

describe('CitationArticleComponent', () => {
  let component: CitationArticleComponent;
  let fixture: ComponentFixture<CitationArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationArticleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
