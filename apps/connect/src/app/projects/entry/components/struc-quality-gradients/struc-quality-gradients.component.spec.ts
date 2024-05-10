import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrucQualityGradientsComponent } from './struc-quality-gradients.component';

describe('StrucQualityGradientsComponent', () => {
  let component: StrucQualityGradientsComponent;
  let fixture: ComponentFixture<StrucQualityGradientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrucQualityGradientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrucQualityGradientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
