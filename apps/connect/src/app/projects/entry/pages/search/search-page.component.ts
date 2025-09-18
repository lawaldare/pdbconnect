import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'pdbc-app-search-page',
  template: ` <iframe [src]="iframeUrl" style="width:100%; height:100vh; border:none;"></iframe> `,
})
export class SearchPageComponent implements OnInit {
  iframeUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(() => {
      // raw query string from the parent URL (e.g. ?searchParams=...)
      const queryString = window.location.search;

      // use __app_public_path__ that is set in index.html
      const publicPath = (window as any).__app_public_path__ || '/';

      // build the full iframe URL
      const fullUrl = `${publicPath}assets/adv-search/${queryString}`;

      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    });
  }
}
