import { Injectable, signal } from '@angular/core';
import Clarity from '@microsoft/clarity';

@Injectable({ providedIn: 'root' })
export class ClarityConsentService {
  private readonly cookieKey = this.getCookieKey;
  private clarityProjectId = signal('');

  public init(clarityProjectId: string): void {
    this.clarityProjectId.set(clarityProjectId);
    const consentGranted = this.getCookie(this.cookieKey) === 'true';

    this.sendClarityConsentSignal(consentGranted);
    if (consentGranted) {
      this.initializeClarity();
    }

    this.watchForBannerClick();
  }

  private handleConsentGranted(): void {
    this.sendClarityConsentSignal(true);
    this.initializeClarity();
    try {
      Clarity.event('clarity-consent-accepted');
      // eslint-disable-next-line no-empty
    } catch {}
  }

  private initializeClarity(): void {
    if (typeof Clarity.init === 'function' && !(window as any).clarityInitialized) {
      (window as any).clarityInitialized = true;
      Clarity.init(this.clarityProjectId());
    }
  }

  private sendClarityConsentSignal(granted: boolean): void {
    const adStorage = granted ? 'granted' : 'denied';
    const analyticsStorage = granted ? 'granted' : 'denied';
    const w = window as any;

    if (typeof w.clarity === 'function') {
      w.clarity('consentv2', { ad_Storage: adStorage, analytics_Storage: analyticsStorage });
    } else {
      w.clarity = function (...args: any[]) {
        (w.clarity.q = w.clarity.q || []).push(args);
      };
      w.clarity('consentv2', { ad_Storage: adStorage, analytics_Storage: analyticsStorage });
    }
  }

  private watchForBannerClick(): void {
    const listener = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.id === 'data-protection-agree') {
        this.handleConsentGranted();
        window.removeEventListener('click', listener);
      }
    };
    window.addEventListener('click', listener);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private get getCookieKey(): string {
    const pathname = window.location.pathname;
    if (pathname.includes('complexes')) return 'dataProtectionAgreedForComplexPages';
    if (pathname.includes('chemicalCompound/show')) return 'dataProtectionAgreedForLigandPages';
    if (pathname.includes('pisa')) return 'dataProtectionAgreedForPISAPages';
    return 'dataProtectionAgreedForEntryPages';
  }
}
