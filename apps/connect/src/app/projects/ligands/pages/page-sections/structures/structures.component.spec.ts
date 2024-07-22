import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StructuresComponent } from './structures.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

describe('StructuresComponent', () => {
  let component: StructuresComponent;
  let fixture: ComponentFixture<StructuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuresComponent, HttpClientModule, NoopAnimationsModule, RouterModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
