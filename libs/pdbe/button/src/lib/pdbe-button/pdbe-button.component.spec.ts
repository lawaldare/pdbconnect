import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeButtonComponent } from './pdbe-button.component';

describe('PdbeButtonComponent', () => {
  let component: PdbeButtonComponent;
  let fixture: ComponentFixture<PdbeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
