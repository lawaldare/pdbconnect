import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeDropdownComponent } from './pdbe-dropdown.component';

describe('PdbeDropdownComponent', () => {
  let component: PdbeDropdownComponent;
  let fixture: ComponentFixture<PdbeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
