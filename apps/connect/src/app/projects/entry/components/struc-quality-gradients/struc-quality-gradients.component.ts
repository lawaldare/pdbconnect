import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-str-quality-gradient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './struc-quality-gradients.component.html',
  styleUrl: './struc-quality-gradients.component.scss',
})
export class StrucQualityGradientsComponent {
  @Input() componentType?: 'GeometryFit_RdToBl' | 'GeometryFit_RdToGr' | 'Multipercentile';
  @Input() renderGradients?: {
    geometry: number | undefined;
    basepairs?: number | undefined;
    modelfit: number | undefined;
  };

  gradientWidth = 174;

  // TODO: Work on automatic image svg design for this
  // TODO: Wrap up responsive design for this component if needed at all
  calcTranslate(idx: number) {
    // take integer (0,1,2,3,4), multiply by 20% of total width, take out border width
    return idx * (this.gradientWidth / 5) - 2;
  }
}
