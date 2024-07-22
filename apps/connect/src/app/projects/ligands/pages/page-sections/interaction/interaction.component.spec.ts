import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractionComponent } from './interaction.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

describe('InteractionComponent', () => {
  let component: InteractionComponent;
  let fixture: ComponentFixture<InteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionComponent, HttpClientModule, RouterModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
