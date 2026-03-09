import { ComponentFixture, TestBed } from '@angular/core/testing';

// mock BEFORE loading the component/module graph
jest.mock('@microsoft/clarity', () => ({
  __esModule: true,
  default: {
    start: jest.fn(),
    stop: jest.fn(),
    consent: jest.fn(),
  },
}));

import { ToolTipComponent } from './tool-tip.component';

describe('ToolTipComponent', () => {
  let component: ToolTipComponent;
  let fixture: ComponentFixture<ToolTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolTipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
