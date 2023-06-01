import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VfEbiHeaderComponent } from './vf-ebi-header.component';

describe('VfEbiHeaderComponent', () => {
  let component: VfEbiHeaderComponent;
  let fixture: ComponentFixture<VfEbiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VfEbiHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VfEbiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
