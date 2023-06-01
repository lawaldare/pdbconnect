import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VfEbiFooterComponent } from './vf-ebi-footer.component';

describe('VfEbiFooterComponent', () => {
  let component: VfEbiFooterComponent;
  let fixture: ComponentFixture<VfEbiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfEbiFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VfEbiFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
