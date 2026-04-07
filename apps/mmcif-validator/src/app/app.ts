import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { ClarityConsentService, DataPrivacyBannerComponent } from '@pdbc/core';
import { environment } from '../environments/environment';
import Clarity from '@microsoft/clarity';

@Component({
  imports: [RouterModule, HeaderComponent, VfEbiHeaderComponent, VfEbiFooterComponent, DataPrivacyBannerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  public readonly clarityConsentService = inject(ClarityConsentService);

  ngOnInit(): void {
    Clarity.init(environment.clarityProjectId);
    this.clarityConsentService.init(environment.clarityProjectId);
  }
}
