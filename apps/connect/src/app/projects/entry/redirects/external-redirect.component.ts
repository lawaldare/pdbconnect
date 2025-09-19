import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pdbc-external-redirect',
  template: '',
})
export class ExternalRedirectComponent implements OnInit {
  ngOnInit() {
    window.location.href = 'https://www.ebi.ac.uk/pdbe/';
  }
}
