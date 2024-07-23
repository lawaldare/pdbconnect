import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LigandGridComponent } from './ligand-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('LigandGridComponent', () => {
  let component: LigandGridComponent;
  let fixture: ComponentFixture<LigandGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigandGridComponent, HttpClientModule, RouterModule],
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

    fixture = TestBed.createComponent(LigandGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
