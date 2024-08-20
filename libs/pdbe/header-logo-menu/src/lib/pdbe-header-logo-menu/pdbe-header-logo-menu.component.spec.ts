import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeHeaderLogoMenuComponent } from './pdbe-header-logo-menu.component';

xdescribe('PdbeHeaderLogoMenuComponent', () => {
  let component: PdbeHeaderLogoMenuComponent;
  let fixture: ComponentFixture<PdbeHeaderLogoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeHeaderLogoMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeHeaderLogoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
