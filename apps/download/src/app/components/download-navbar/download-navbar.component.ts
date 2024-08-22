import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-download-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-navbar.component.html',
  styleUrl: './download-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadNavbarComponent {}
