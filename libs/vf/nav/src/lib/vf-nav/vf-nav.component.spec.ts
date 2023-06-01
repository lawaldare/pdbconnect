import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VfNavComponent } from './vf-nav.component';

describe('VfNavComponent', () => {
  let component: VfNavComponent;
  let fixture: ComponentFixture<VfNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VfNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
