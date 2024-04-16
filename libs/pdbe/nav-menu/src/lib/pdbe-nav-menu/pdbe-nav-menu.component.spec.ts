import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeNavMenuComponent } from './pdbe-nav-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PdbeNavMenuComponent', () => {
  let component: PdbeNavMenuComponent;
  let fixture: ComponentFixture<PdbeNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeNavMenuComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
