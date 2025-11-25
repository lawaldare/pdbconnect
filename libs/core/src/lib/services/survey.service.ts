import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SurveyConfig } from '../models/survey-config';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly http = inject(HttpClient);

  public showSurvey = signal(false);
  public config = signal<SurveyConfig | null>(null);
  public answers = signal<Record<string, any>>({});
  private country: string | null = null;

  // number of dismissals before snoozing
  private readonly CLOSE_LIMIT = 3;
  private surveyPending = false;
  private consentGranted = false;

  constructor() {
    this.checkInitialConsent();
    this.watchForBannerClick();
  }

  private getConsentCookieKey(): string {
    const path = window.location.pathname;

    if (path.includes('complexes')) return 'dataProtectionAgreedForComplexPages';
    if (path.includes('chemicalCompound/show')) return 'dataProtectionAgreedForLigandPages';
    return 'dataProtectionAgreedForEntryPages'; // default for entry pages
  }

  private checkInitialConsent() {
    const key = this.getConsentCookieKey();
    if (this.getCookie(key) === 'true') {
      this.consentGranted = true;
    }
  }

  private watchForBannerClick(): void {
    const listener = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.id === 'data-protection-agree') {
        this.consentGranted = true;

        // If a survey was waiting for consent, launch now
        if (this.surveyPending) {
          const cfg = this.config();
          if (cfg) this.initAfterConsent(cfg);
          this.surveyPending = false;
        }

        window.removeEventListener('click', listener);
      }
    };
    window.addEventListener('click', listener);
  }

  init(config: SurveyConfig) {
    this.config.set(config);

    if (!this.consentGranted) {
      // Delay running init until user clicks Accept
      this.surveyPending = true;
      return;
    }

    this.initAfterConsent(config);
  }

  initAfterConsent(config: SurveyConfig) {
    // check survey expiry date
    if (config.expiresAt) {
      const [d, m, y] = config.expiresAt.split('/').map(Number);
      const expirationDate = new Date(y, m - 1, d);

      if (new Date() > expirationDate) {
        console.warn(`Survey "${config.identifier}" expired on ${config.expiresAt}`);
        return;
      }
    }

    // has submitted this survey before cookie -> not shown for a year
    const alreadyDone = this.getCookie(config.identifier) === 'true';
    if (alreadyDone) return;

    // weekly snooze cookie when user closes survey 3 times
    const snoozeCookie = this.getCookie(config.identifier + '_snooze');
    if (snoozeCookie === 'true') return;

    this.getCountry().then((country) => {
      this.country = country;
      this.showSurvey.set(true); // Show popup
    });
  }

  async getCountry(): Promise<string | null> {
    try {
      const data: any = await firstValueFrom(this.http.get('https://ipinfo.io/json'));
      return data?.country ?? null;
    } catch {
      return null;
    }
  }

  saveAnswer(questionId: string, value: any) {
    this.answers.update((a) => ({ ...a, [questionId]: value }));
  }

  async submit() {
    const cfg = this.config();
    if (!cfg) return;

    let params = new HttpParams().set('survey', cfg.identifier).set('country', this.country ?? 'Unknown');

    // Only include answers for questions that are:
    // 1. not skipped, or
    // 2. skipped but user answered anyway
    const questions = cfg?.questions ?? [];
    for (const q of questions) {
      const value = this.answers()[q.id];

      // If skip = true and user didn’t answer, omit
      if (q.skip && (value === undefined || value === null || value === '')) {
        continue;
      }

      if (value !== undefined && value !== null) {
        params = params.set(q.id, String(value));
      }
    }

    // Add optional extra params
    if (cfg.extraParams) {
      for (const [key, value] of Object.entries(cfg.extraParams)) {
        params = params.set(key, value);
      }
    }

    // Add timestamp
    params = params.set('timestamp', new Date().toISOString());

    // Send GET request to webhook URL
    try {
      await firstValueFrom(this.http.get(cfg.webhookUrl, { params, responseType: 'text' }));
    } catch (e) {
      console.warn('Survey webhook failed:', e);
    }

    // Lock survey
    this.setCookie(cfg.identifier, 'true', 365);
    this.showSurvey.set(false);
  }

  public handleCloseClick() {
    const cfg = this.config();
    if (!cfg) return;

    const key = cfg.identifier + '_closeCount';
    const current = Number(this.getCookie(key) ?? '0') + 1;

    // store updated count
    this.setCookie(key, String(current), 30); // keep counter ~1 month

    // If closed 3+ times → snooze for 1 week
    if (current >= this.CLOSE_LIMIT) {
      const snoozeKey = cfg.identifier + '_snooze';
      this.setCookie(snoozeKey, 'true', 7);
      this.setCookie(key, '0', -1); // reset _closeCount by expiring it
    }

    this.showSurvey.set(false);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private setCookie(name: string, value: string, days: number) {
    const expiry = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expiry}; path=/`;
  }
}
