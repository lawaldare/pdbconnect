import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pdbc-external-redirect',
  template: '',
})
export class ExternalRedirectComponent implements OnInit {
  ngOnInit() {
    const hostname = window.location.hostname;

    let target = 'https://www.ebi.ac.uk/pdbe/'; // default to prod
    if (hostname.includes('localhost') || hostname.includes('wwwdev')) {
      target = 'https://wwwdev.ebi.ac.uk/pdbe/';
    }

    window.location.href = target;
  }
}
