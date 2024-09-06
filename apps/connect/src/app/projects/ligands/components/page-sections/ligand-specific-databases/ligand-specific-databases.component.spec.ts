import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LigandSpecificDatabasesComponent } from './ligand-specific-databases.component';

describe('LigandSpecificDatabasesComponent', () => {
  let component: LigandSpecificDatabasesComponent;
  let fixture: ComponentFixture<LigandSpecificDatabasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigandSpecificDatabasesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LigandSpecificDatabasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
