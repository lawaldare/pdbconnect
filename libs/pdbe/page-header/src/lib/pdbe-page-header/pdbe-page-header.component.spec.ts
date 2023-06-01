import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbePageHeaderComponent } from './pdbe-page-header.component';

describe('PdbePageHeaderComponent', () => {
  let component: PdbePageHeaderComponent;
  let fixture: ComponentFixture<PdbePageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbePageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbePageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
