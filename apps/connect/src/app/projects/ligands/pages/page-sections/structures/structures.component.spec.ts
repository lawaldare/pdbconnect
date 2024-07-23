import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StructuresComponent } from './structures.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('StructuresComponent', () => {
  let component: StructuresComponent;
  let fixture: ComponentFixture<StructuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuresComponent, HttpClientModule, NoopAnimationsModule, RouterModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              ligandId: 'HEM',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
