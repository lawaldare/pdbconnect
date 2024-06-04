import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeHelpIconComponent } from './pdbe-help-icon.component';

describe('PdbeHelpIconComponent', () => {
  let component: PdbeHelpIconComponent;
  let fixture: ComponentFixture<PdbeHelpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeHelpIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeHelpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
