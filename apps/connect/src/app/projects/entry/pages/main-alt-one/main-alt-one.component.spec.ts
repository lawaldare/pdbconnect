import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryMainAltOnePageComponent } from './main-alt-one.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EntryMainAltOnePageComponent', () => {
  let component: EntryMainAltOnePageComponent;
  let fixture: ComponentFixture<EntryMainAltOnePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryMainAltOnePageComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryMainAltOnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
