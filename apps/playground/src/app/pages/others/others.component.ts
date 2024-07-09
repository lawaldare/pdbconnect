import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pdbe-others',
  standalone: true,
  imports: [CommonModule, MolstarComponent],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
})
export class OthersComponent {
  public config = {
    moleculeId: '3d12',
    bgColor: { r: 255, g: 255, b: 255 },
    hideControls: true,
    hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
    landscape: true,
    subscribeEvents: false,
  };

  public height = '265px';
  public width = '100%';
}
