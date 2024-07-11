import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsPlaygroundComponent } from './buttons-playground.component';

describe('ButtonsPlaygroundComponent', () => {
  let component: ButtonsPlaygroundComponent;
  let fixture: ComponentFixture<ButtonsPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsPlaygroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonsPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
