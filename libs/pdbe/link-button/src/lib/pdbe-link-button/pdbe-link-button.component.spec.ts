import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeLinkButtonComponent } from './pdbe-link-button.component';

describe('PdbeLinkButtonComponent', () => {
  let component: PdbeLinkButtonComponent;
  let fixture: ComponentFixture<PdbeLinkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeLinkButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
