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

  public logClickEvents(eventName: string, eventCategory: string, eventLabel: any, eventValue = ''): void {
    const hit = {
      eventName,
      eventCategory,
      eventAction: 'click',
      eventLabel,
      eventValue,
    };
    this.pingHome(hit);
  }
}
