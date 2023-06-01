import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VfLinkComponent } from './vf-link.component';

describe('VfLinkComponent', () => {
  let component: VfLinkComponent;
  let fixture: ComponentFixture<VfLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VfLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
