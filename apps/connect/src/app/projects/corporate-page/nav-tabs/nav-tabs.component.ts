import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, HostListener, input, signal, computed } from '@angular/core';

@Component({
  selector: 'pdbc-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
  imports: [CommonModule],
})
export class NavTabsComponent implements OnInit {
  // @Input() activePage: string = "";

  public activePageInput = input<string>();

  // public activePage = signal<string>(this.activePageInput() ?? 'home');

  public activePage = computed(() => this.activePageInput() ?? 'home');

  public showExtra = signal<boolean>(false);

  ngOnInit(): void {
    // if (!this.activePage()) this.activePage.set('home');
    this.calcExtra(null);
  }

  @HostListener('window:resize', ['$event'])
  calcExtra(event: any) {
    this.showExtra.set(false);
    if (window.innerWidth <= 425) {
      this.showExtra.set(true);
    }
  }
}
