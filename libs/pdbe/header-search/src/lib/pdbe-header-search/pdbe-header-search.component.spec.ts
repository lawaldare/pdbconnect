import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PdbeHeaderSearchComponent } from './pdbe-header-search.component';

describe('PdbeHeaderSearchComponent', () => {
  let component: PdbeHeaderSearchComponent;
  let fixture: ComponentFixture<PdbeHeaderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeHeaderSearchComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeHeaderSearchComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
