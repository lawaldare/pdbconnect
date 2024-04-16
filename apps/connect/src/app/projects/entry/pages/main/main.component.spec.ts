import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryMainPageComponent } from './main.component';
import { HttpClientModule } from '@angular/common/http';

describe('EntryMainPage', () => {
  let component: EntryMainPageComponent;
  let fixture: ComponentFixture<EntryMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryMainPageComponent, RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
