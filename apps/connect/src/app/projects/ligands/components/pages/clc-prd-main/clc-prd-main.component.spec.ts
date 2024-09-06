import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClcPrdMainComponent } from './clc-prd-main.component';

describe('ClcPrdMainComponent', () => {
  let component: ClcPrdMainComponent;
  let fixture: ComponentFixture<ClcPrdMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClcPrdMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClcPrdMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
