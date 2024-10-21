import { Injectable } from '@angular/core';
import { WindowReferenceService } from './window-reference.service';

@Injectable({
  providedIn: 'root',
})
export class DataLayerService {
  private window;

  constructor(private windowRef: WindowReferenceService) {
    this.window = windowRef.nativeWindow;
  }

  private pingHome(obj: Record<string, string>): void {
    if (obj) {
      this.window.dataLayer.push(obj);
    }
  }

  public logPageView(url: string): void {
    const hit = {
      eventName: 'page_visit',
      pageUrl: url,
      eventAction: 'view',
    };
    this.pingHome(hit);
  }

  public logClickEvents(event_name: string, event_category: string, event_action: string, event_label: any, event_value = ''): void {
    const hit = {
      event_name,
      event_category,
      event_action,
      event_label,
      event_value,
    };
    this.pingHome(hit);
  }
}
