import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'pdbc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
})
export class HeaderComponent {
  public menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((state) => !state);
  }
}
