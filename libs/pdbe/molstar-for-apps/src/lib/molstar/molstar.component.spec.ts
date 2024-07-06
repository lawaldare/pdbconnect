import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MolstarComponent } from './molstar.component';

describe('MolstarComponent', () => {
  let component: MolstarComponent;
  let fixture: ComponentFixture<MolstarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MolstarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MolstarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
