import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';

type PageID = 'dataProtectionAgreedForComplexPages' | 'dataProtectionAgreedForEntryPages' | 'dataProtectionAgreedForLigandPages' | 'dataProtectionAgreedForPISAPages';
@Component({
  selector: 'lib-data-privacy-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showBanner()) {
      <div class="data-privacy-banner">
        <div class="row">
          <div class="columns medium-8 large-9 white-color">
            This website requires cookies, and the limited processing of your personal data in order to function. By using the site you are agreeing to this as
            outlined in our
            <a target="_blank" [href]="privacyNoticeUrl()">Privacy Notice</a> and
            <a target="_blank" href="https://www.ebi.ac.uk/about/terms-of-use/">Terms of Use</a>.
          </div>
          <div class="columns medium-4 large-3 text-right white-color">
            <a id="data-protection-agree" (click)="closeDataProtectionBanner()">I agree, dismiss this banner</a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .data-privacy-banner {
        position: fixed;
        background: rgb(112, 115, 114);
        width: 100%;
        padding: 0.75rem 1%;
        left: 0px;
        bottom: 0px;
        border-top: 1px solid rgb(55, 58, 54);
        color: rgb(238, 238, 238);
        z-index: 10;

        a {
          border-bottom-width: 1px;
          border-bottom-style: dotted;
          border-bottom-color: inherit;
        }
      }
    `,
  ],
})
export class DataPrivacyBannerComponent implements OnInit {
  public pageId = input.required<PageID>();
  public privacyNoticeUrl = input.required<string>();

  public showBanner = signal<boolean>(false);

  ngOnInit(): void {
    const agreed = this.getCookie(this.pageId());
    this.showBanner.set(!agreed);
  }

  public closeDataProtectionBanner(): void {
    this.setCookie(this.pageId(), 'true', 365);
    this.showBanner.set(false);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}
