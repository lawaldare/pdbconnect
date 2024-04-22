import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LigandsMainPageComponent } from './main.component';
import { HttpClientModule } from '@angular/common/http';

describe('LigandsMainPage', () => {
  let component: LigandsMainPageComponent;
  let fixture: ComponentFixture<LigandsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigandsMainPageComponent, RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LigandsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
