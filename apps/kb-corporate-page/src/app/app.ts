/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject, OnInit } from '@angular/core';
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
export class App implements OnInit {
  public readonly gaTag = computed(() => environment.gaTag ?? 'G-6EJJZ57S1H');
  private readonly router = inject(Router);
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo(0, 0);
      gtag('js', new Date());
      gtag('config', environment.gaTag, { debug_mode: true });
    });
  }

  ngOnInit(): void {
    this.init();
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

  private init(): void {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaTag}`;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    const gtagEl = document.createElement('script');
    const gtagBody = document.createTextNode(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${environment.gaTag}');
    `);
    gtagEl.appendChild(gtagBody);
    document.body.appendChild(gtagEl);
  }
}
