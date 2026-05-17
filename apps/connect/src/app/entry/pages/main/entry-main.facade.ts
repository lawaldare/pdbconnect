import { inject, Injectable, signal } from '@angular/core';
import { retry, catchError, of } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { SpeedTestServiceCustom } from '../../services/speed-test/speed-test-service.service';
import { environment } from '../../../../environments/environment';
import { SurveyConfig, SurveyService } from '@pdbc/core';

@Injectable({
  providedIn: 'root',
})
export class EntryMainFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly speedTest = inject(SpeedTestServiceCustom);
  public showNotificationBanner = signal<boolean>(false);
  public isDesktop = signal(false);
  public surveyService = inject(SurveyService);

  public readonly apiSearchConfig = {
    additionalParams: 'rows=20000&json.nl=map&wt=json',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    redirectOnClick: true,
    resultBoxAlign: 'left',
    searchUrl: 'https://www.ebi.ac.uk/pdbe/search/pdb-autocomplete/select',
    sort: 'category+asc,num_pdb_entries+desc',
    view: 'entries',
    env: environment.production ? '' : 'dev',
  };

  public showNotification(): void {
    const href = document.location.href;
    if (href.includes('dev.') || href.includes('wwwdev.')) {
      this.showNotificationBanner.set(true);
    } else {
      this.showNotificationBanner.set(false);
    }
  }

  public checkWindowWidth(): void {
    this.isDesktop.set(window.innerWidth > 768);
  }

  public testProcessingPower(): void {
    const t0 = performance.now();
    for (let i = 0; i < 1e7; i++) Math.sqrt(i);
    const t1 = performance.now();
    const isCPUSlow = t1 - t0 > 40;
    this.compCommunication.checkedCPUspeed.set(true); // fallback to slow mode
    this.compCommunication.isCPUSlow.set(isCPUSlow);
  }

  public testNetworkSpeed(): void {
    const customSettings = {
      iterations: 5, // Run 5 test for better accuracy
      retryDelay: 500, // Wait 0.5 seconds between retries
      file: {
        // path: 'https://www.ebi.ac.uk/pdbe/entry-files/download/10mh.bcif.gz',
        // size: 103402,        // 106KB in bytes
        // path: 'https://raw.githubusercontent.com/jrquick17/ng-speed-test/02c59e4afde67c35a5ba74014b91d44b33c0b3fe/demo/src/assets/500kb.jpg',
        // size: 500000,        // 106KB in bytes
        // path: 'https://www.ebi.ac.uk/pdbe/entry-files/download/3d12.bcif',
        // size: 401069,
        path: 'https://www.ebi.ac.uk/pdbe/entry-files/download/7aym_validation.xml',
        size: 85838, // 86KB in bytes
        shouldBustCache: true, // Prevent browser caching
      },
    };

    this.speedTest.isOnline().subscribe((isOnline) => {
      if (!isOnline) {
        console.log('No internet connection');
      }
    });

    this.speedTest
      .getMbps(customSettings)
      .pipe(
        retry(5), // retry up to 5 times on error
        catchError((err) => {
          console.error('Speed test failed after retries', err);
          this.compCommunication.slowNetwork$.next(true); // fallback to slow mode
          return of(null); // emit a safe value
        })
      )
      .subscribe({
        next: (speed) => {
          // speed is in Mbps
          console.log('Detected speed (Mbps): ', speed);
          if (speed && speed < 7.5) this.compCommunication.slowNetwork$.next(true);
          else this.compCommunication.slowNetwork$.next(false);
        },
        error: (err) => {
          console.error('Speed test failed', err);
          // console.log('Setting default as slow network mode');
          this.compCommunication.slowNetwork$.next(true);
        },
      });
  }

  public checkWebglEnabled(): boolean {
    const isWebGlEnabled = this.detectWebglSupport() ? true : false;
    this.compCommunication.checkedWebGlSupport.set(true); // fallback to slow mode
    this.compCommunication.isWebGlEnabled.set(isWebGlEnabled);
    return isWebGlEnabled;
  }

  private detectWebglSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      // Try WebGL2 first, fallback to WebGL1
      return (
        !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) ||
        !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      );
    } catch {
      return false;
    }
  }

  public launchSurveyForEntryPage(entryId: string, isDesktop: boolean) {
    const surveyConfig: SurveyConfig = {
      identifier: 'entrypage_ai-annotations_v1',
      title: 'Help us improve the PDBe Entry Pages',
      expiresAt: '01/06/2026',
      webhookUrl: environment.epSurveyWebhookUrl1,

      questions: [
        {
          id: 'q1',
          type: 'multiple',
          title: 'Have you used Text annotations (AI)?',
          choices: ['Frequently', 'A few times', 'Once', 'Not yet', 'I’m not sure what this is'],
          skip: false,
        },
        {
          id: 'q2',
          type: 'multiple-check',
          title: 'Which best describes your experience with Text annotations (AI)?',
          choices: [
            'Very helpful',
            'Sometimes helpful',
            'Difficult to understand',
            'I don’t trust the AI-generated data',
            'Not relevant to my work',
            'Not available for the viewed entries',
            'I stopped using it',
            "I've never used it",
          ],
          skip: false,
        },
        {
          id: 'q3',
          type: 'text',
          title: 'If you would like to participate in a 30-minute call to talk about your experience with PDBe, please leave your email.',
          subtitle:
            'We will not pass your data to anyone outside PDBe and will delete your data within six month. See our <a href="https://www.ebi.ac.uk/pdbe/entry/assets/data-privacy/entry-pages-data-privacy.pdf" target="_blank">Privacy notice</a> and <a href="https://www.ebi.ac.uk/about/terms-of-use/" target="_blank">Terms of Use</a>',
          skip: true,
        },
      ],

      extraParams: {
        entry: `pdb id: ${entryId}`,
        mode: isDesktop ? 'desktop' : 'mobile',
      },

      feedbackUrl: 'https://www.ebi.ac.uk/about/contact/support/pdbe',
    };

    this.surveyService.init(surveyConfig);
  }
}
