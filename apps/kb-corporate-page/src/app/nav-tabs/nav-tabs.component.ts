/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, input, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
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
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // if (!this.activePage()) this.activePage.set('home');
    this.calcExtra(null);
  }

  @HostListener('window:resize', ['$event'])
  calcExtra(event: any) {
    this.showExtra.set(false);
    if (this.isBrowser && window.innerWidth <= 425) {
      this.showExtra.set(true);
    }
  }
}
