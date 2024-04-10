import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeNavMenuComponent } from './pdbe-nav-menu.component';

describe('PdbeNavMenuComponent', () => {
  let component: PdbeNavMenuComponent;
  let fixture: ComponentFixture<PdbeNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeNavMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
