import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var gtag

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.css'],
    standalone: false
})
export class ErrorPageComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    gtag('event', 'missing_page', {'event_category': 'missing_page', 'event_label': 'missing_page', 'value': undefined})
  }

}
