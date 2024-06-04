import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StructuresComponent } from './structures.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StructuresComponent', () => {
  let component: StructuresComponent;
  let fixture: ComponentFixture<StructuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuresComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
