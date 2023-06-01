import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeHeroBannerComponent } from './pdbe-hero-banner.component';

describe('PdbeHeroBannerComponent', () => {
  let component: PdbeHeroBannerComponent;
  let fixture: ComponentFixture<PdbeHeroBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeHeroBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeHeroBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
