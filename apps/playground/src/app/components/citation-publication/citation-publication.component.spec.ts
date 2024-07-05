import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitationPublicationComponent } from './citation-publication.component';

describe('CitationPublicationComponent', () => {
  let component: CitationPublicationComponent;
  let fixture: ComponentFixture<CitationPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationPublicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
