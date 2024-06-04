import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryAltOneComponent } from './summary-alt-one.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SummaryAltOneComponent', () => {
  let component: SummaryAltOneComponent;
  let fixture: ComponentFixture<SummaryAltOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAltOneComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryAltOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
