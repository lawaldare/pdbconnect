import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrucExplorerEcm2024Component } from './struc-explorer-ecm-2024.component';

describe('StrucExplorerEcm2024Component', () => {
  let component: StrucExplorerEcm2024Component;
  let fixture: ComponentFixture<StrucExplorerEcm2024Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrucExplorerEcm2024Component],
    }).compileComponents();

    fixture = TestBed.createComponent(StrucExplorerEcm2024Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
