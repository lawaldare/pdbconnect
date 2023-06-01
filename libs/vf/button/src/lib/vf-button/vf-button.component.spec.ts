import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VfButtonComponent } from './vf-button.component';

describe('VfButtonComponent', () => {
  let component: VfButtonComponent;
  let fixture: ComponentFixture<VfButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VfButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
