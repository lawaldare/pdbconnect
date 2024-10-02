import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  public eventEmitter(eventName: string, eventCategory: string, eventAction: string, eventLabel = null, eventValue = null): void {
    gtag('event', eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue,
    });
  }
}
