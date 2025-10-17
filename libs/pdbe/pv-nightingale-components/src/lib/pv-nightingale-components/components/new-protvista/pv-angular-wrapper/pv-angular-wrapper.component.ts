import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, input, OnDestroy, ViewChild } from '@angular/core';
import { NewProtvistaTrackData } from '../pv-new-protvista/track-data.model';
import { NewProtvistaVisualisation } from '../pv-new-protvista/new-protvista';
import { ScriptLoaderService } from '@pdbc/core';

@Component({
  selector: 'lib-pv-angular-wrapper',
  imports: [CommonModule],
  templateUrl: './pv-angular-wrapper.component.html',
  styleUrl: './pv-angular-wrapper.component.scss',
})
export class ProtvistaWrapperComponent implements AfterViewInit, OnDestroy {
  private scriptLoader = inject(ScriptLoaderService);
  @ViewChild('containerElement', { read: ElementRef }) public containerElement!: ElementRef;

  // External inputs (read-only)
  public readonly containerId = input<string>('new-protvista-id');
  public readonly data = input<NewProtvistaTrackData[]>([]);

  // Instance reference to cleanup
  private afterViewInit = false;
  private visInstance?: NewProtvistaVisualisation;

  // Loaded components state
  private hasLoadedNightingale = false;

  constructor() {
    effect(async () => {
      // Re-run whenever ANY input used here changes
      if (this.afterViewInit) await this.initVisualisation();
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.afterViewInit = true;
    await this.initVisualisation();
  }

  private async loadComponents() {
    await this.scriptLoader.loadScript('https://cdn.jsdelivr.net/npm/@nightingale-elements/nightingale-manager@5.6.0/dist/index.min.js', true);
    await this.scriptLoader.loadScript('https://cdn.jsdelivr.net/npm/@nightingale-elements/nightingale-navigation@5.6.0/dist/index.min.js', true);
    await this.scriptLoader.loadScript('https://cdn.jsdelivr.net/npm/@nightingale-elements/nightingale-track@5.6.0/dist/index.min.js', true);
    await customElements.whenDefined('nightingale-manager');
    await customElements.whenDefined('nightingale-navigation');
    await customElements.whenDefined('nightingale-track');
    console.log('LOADED');
    this.hasLoadedNightingale = true;
  }

  private async initVisualisation() {
    if (!this.hasLoadedNightingale) {
      await this.loadComponents();
    }
    if (this.visInstance) {
      this.visInstance.destroy();
      this.visInstance = undefined;
    }
    this.visInstance = new NewProtvistaVisualisation(this.containerId(), this.data());
  }

  ngOnDestroy(): void {
    this.visInstance?.destroy();
    this.visInstance = undefined;
  }
}
