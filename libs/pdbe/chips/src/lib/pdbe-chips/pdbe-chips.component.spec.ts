import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeChipsComponent } from './pdbe-chips.component';

describe('PdbeChipsComponent', () => {
  let component: PdbeChipsComponent;
  let fixture: ComponentFixture<PdbeChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
