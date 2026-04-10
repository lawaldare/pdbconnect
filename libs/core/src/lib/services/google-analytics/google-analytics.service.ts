import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

declare const gtag: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);

  public logClickEvents(event: string, category: string, action: string, label: string, value = ''): void {
    gtag('event', event, {
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
    });

    // console.log('gtag event captured...');
  }

  public logPageEvents(event: string, params: Record<string, string>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    gtag('event', event, params);
  }
}
