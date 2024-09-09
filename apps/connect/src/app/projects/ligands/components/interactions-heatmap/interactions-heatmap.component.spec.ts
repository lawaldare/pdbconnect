import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionsHeatmapComponent } from './interactions-heatmap.component';

describe('InteractionsHeatmapComponent', () => {
  let component: InteractionsHeatmapComponent;
  let fixture: ComponentFixture<InteractionsHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionsHeatmapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionsHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
