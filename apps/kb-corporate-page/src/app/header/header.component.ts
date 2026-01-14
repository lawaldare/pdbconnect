import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'pdbc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
})
export class HeaderComponent {
  public menuOpen = signal(false);

  public toggleMenu(): void {
    this.menuOpen.update((state) => !state);
  }
}
