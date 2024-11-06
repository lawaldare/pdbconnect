import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Splide from '@splidejs/splide';
import { slides } from '../../../ligand.constant';

@Component({
  selector: 'pdbc-key-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-features.component.html',
  styleUrl: './key-features.component.scss',
})
export class KeyFeaturesComponent implements AfterViewInit {
  public readonly slides = slides;
  ngAfterViewInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      const splide = new Splide('#key-features-slider', {
        perPage: 3,
        rewind: true,
        gap: 20,
        breakpoints: {
          991: {
            perPage: 2,
          },
          768: {
            perPage: 1,
          },
        },
      });

      splide.mount();
    });
  }
}
