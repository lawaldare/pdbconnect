import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  url: string;
}

@Component({
  selector: 'pdbc-vf-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vf-nav.component.html',
  styleUrls: ['./vf-nav.component.scss'],
})
export class VfNavComponent {
  @Input() menuItems?: MenuItem[];
  @Input() selectedIndex = 0;
}
