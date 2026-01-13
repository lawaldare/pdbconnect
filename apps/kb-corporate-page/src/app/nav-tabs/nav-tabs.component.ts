import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, input, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pdbc-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavTabsComponent implements OnInit {
  public activePageInput = input<string>();

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
