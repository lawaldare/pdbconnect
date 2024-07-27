import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitationXmlImagesComponent } from './citation-xml-images.component';

describe('CitationXmlImagesComponent', () => {
  let component: CitationXmlImagesComponent;
  let fixture: ComponentFixture<CitationXmlImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationXmlImagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationXmlImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
