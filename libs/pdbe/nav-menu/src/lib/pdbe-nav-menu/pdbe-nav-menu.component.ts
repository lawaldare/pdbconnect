import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-pdbe-nav-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-nav-menu.component.html',
  styleUrls: ['./pdbe-nav-menu.component.scss'],
})
export class PdbeNavMenuComponent {
  @Input() highlightColor = '';
  @Input() navSections: { sectionName: string; subsections: { sectionName: string }[] }[] = [];
  @Input() isFirstActivated?: boolean;

  sectionNameToId(sectionName: string) {
    return sectionName.replace(/ /g, '_');
  }
}
