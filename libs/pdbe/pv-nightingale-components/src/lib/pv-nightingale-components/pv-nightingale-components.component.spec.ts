import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PvNightingaleComponentsComponent } from './pv-nightingale-components.component';

describe('PvNightingaleComponentsComponent', () => {
  let component: PvNightingaleComponentsComponent;
  let fixture: ComponentFixture<PvNightingaleComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PvNightingaleComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PvNightingaleComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
