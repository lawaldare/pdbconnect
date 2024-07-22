import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCarouselComponent } from './image-carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

describe('ImageCarouselComponent', () => {
  let component: ImageCarouselComponent;
  let fixture: ComponentFixture<ImageCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCarouselComponent, HttpClientModule, RouterModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
