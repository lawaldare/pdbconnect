import { Injectable } from '@angular/core';

declare const gtag: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  public logClickEvents(event: string, category: string, action: string, label: string, value = ''): void {
    gtag('event', event, {
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
    });

    // console.log('gtag event captured...');
  }

  public logEntryPageEvents(event: string, params: Record<string, string>): void {
    gtag('event', event, params);
  }
}
