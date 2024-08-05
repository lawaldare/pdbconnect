import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryEcm2024Component } from './entry-ecm-2024.component';

describe('EntryEcm2024Component', () => {
  let component: EntryEcm2024Component;
  let fixture: ComponentFixture<EntryEcm2024Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryEcm2024Component],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryEcm2024Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
