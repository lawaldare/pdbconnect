import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProteinsMainPageComponent } from './main.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProteinsMainPage', () => {
  let component: ProteinsMainPageComponent;
  let fixture: ComponentFixture<ProteinsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProteinsMainPageComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProteinsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
