/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { filter } from 'rxjs';

declare const gtag: any;

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly gaTag = computed(() => environment.gaTag ?? 'G-6EJJZ57S1H');
  private readonly router = inject(Router);
  constructor() {
    const navEndEvent$ = this.router.events.pipe(filter((e) => e instanceof NavigationEnd));
    navEndEvent$.subscribe((e: NavigationEnd) => {
      gtag(
        'config',
        this.gaTag(),
        // {page_path: e.urlAfterRedirects, debug_mode: true});
        { page_path: e.urlAfterRedirects }
      );
    });
    const headerScript = document.createElement('script');
    headerScript.async = true;
    headerScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.gaTag();
    document.head.appendChild(headerScript);
  }

  onActivate(event: any) {
    // window.scroll(0,0);
    // window.scroll({
    //         top: 0,
    //         left: 0,
    //         behavior: 'smooth'
    //  });
    document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
