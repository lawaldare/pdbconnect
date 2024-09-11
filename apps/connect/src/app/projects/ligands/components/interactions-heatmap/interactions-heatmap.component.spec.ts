import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionsHeatmapComponent } from './interactions-heatmap.component';
import { HttpClientModule } from '@angular/common/http';
import { InteractionsApiService } from './interactons-heatmap.service';
import { AggregatedApiService } from '../../services/aggregated-api.service';

describe('InteractionsHeatmapComponent', () => {
  let component: InteractionsHeatmapComponent;
  let fixture: ComponentFixture<InteractionsHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, InteractionsHeatmapComponent],
      providers: [InteractionsApiService, AggregatedApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionsHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
