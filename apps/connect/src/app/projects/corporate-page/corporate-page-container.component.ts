import { Component, computed, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';

declare const gtag: any;

@Component({
  selector: 'pdbc-corporate-page-container',
  templateUrl: './corporate-page-container.component.html',
  styleUrls: ['./corporate-page-container.component.scss'],
  imports: [RouterModule],
})
export class CorporatePageContainerComponent {
  // public readonly gaTag = computed(() => environment.gaTag ?? 'G-6EJJZ57S1H');
  constructor(router: Router) {
    // const navEndEvent$ = router.events.pipe(
    //   filter((e) => e instanceof NavigationEnd)
    // );
    // navEndEvent$.subscribe((e: NavigationEnd) => {
    //   gtag(
    //     'config',
    //     this.gaTag(),
    //     // {page_path: e.urlAfterRedirects, debug_mode: true});
    //     { page_path: e.urlAfterRedirects }
    //   );
    // });
    // const headerScript = document.createElement('script');
    // headerScript.async = true;
    // headerScript.src =
    //   'https://www.googletagmanager.com/gtag/js?id=' + this.gaTag();
    // document.head.appendChild(headerScript);
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
