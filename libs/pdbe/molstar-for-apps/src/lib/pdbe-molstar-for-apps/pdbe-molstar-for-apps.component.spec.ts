import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdbeMolstarForAppsComponent } from './pdbe-molstar-for-apps.component';

describe('PdbeMolstarForAppsComponent', () => {
  let component: PdbeMolstarForAppsComponent;
  let fixture: ComponentFixture<PdbeMolstarForAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdbeMolstarForAppsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdbeMolstarForAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
