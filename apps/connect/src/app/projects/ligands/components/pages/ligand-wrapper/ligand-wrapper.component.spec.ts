import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigandWrapperComponent } from './ligand-wrapper.component';

describe('LigandWrapperComponent', () => {
  let component: LigandWrapperComponent;
  let fixture: ComponentFixture<LigandWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigandWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigandWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
