import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pdbc-home-bookmarks',
  templateUrl: './home-bookmarks.component.html',
  styleUrls: ['./home-bookmarks.component.scss'],
  imports: [CommonModule],
})
export class HomeBookmarksComponent {
  @Input() showquicklinks = true; // decorate the property with @Input()
  scroll(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
