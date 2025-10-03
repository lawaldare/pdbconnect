import { AfterViewInit, Component, ElementRef, inject, Input, input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';
import type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';
import { HelpIconForMolstarService } from '../help-icon-for-molstar.service';

@Component({
  selector: 'lib-pdbe-molstar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './molstar.component.html',
  styleUrl: './molstar.component.scss',
})
export class MolstarComponent implements AfterViewInit, OnChanges {
  @Input() id = '1';
  @Input() height = '400px';
  @Input() width = '100%';
  @Input({ required: true }) molstarConfig!: any;
  private previousMolstarConfig: any = null;

  public firstLoadFinished = signal(false);
  private molstarViewInstance!: PDBeMolstarPlugin;
  private readonly molstarPluginService = inject(MolstarPluginService);
  private readonly helpIconForMolstarService = inject(HelpIconForMolstarService);

  public isExpanded = false;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  public molstarActionsMutex: Promise<boolean | void> = Promise.resolve();

  private deepCopy(a: any) {
    return JSON.parse(JSON.stringify(a));
  }

  private deepEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  async ngAfterViewInit() {
    await this.molstarPluginService.loadPlugin();
    const pluginInstance = this.molstarPluginService.createInstance();
    this.molstarViewInstance = pluginInstance;

    const container = this.viewContainer.nativeElement;
    this.molstarActionsMutex = this.molstarActionsMutex.then(() => this.molstarViewInstance.render(container, this.molstarConfig));

    this.molstarViewInstance.events.loadComplete.subscribe((loaded: boolean) => {
      const eventName = `LibMolstarComponent-${this.id}`;
      if (loaded && !this.firstLoadFinished()) this.firstLoadFinished.set(true);
      if (loaded) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: { id: this.id, loaded } }));
      }

      this.molstarViewInstance.plugin.layout.events.updated.subscribe(() => {
        const expanded = this.molstarViewInstance.plugin.layout.state.isExpanded;
        this.helpIconForMolstarService.toggleHelpIcon(expanded);
      });
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const newConfig = changes['molstarConfig']?.currentValue;
    if (!changes['molstarConfig']?.firstChange) {
      if (!newConfig) return;
      const configChanged = !this.deepEqual(this.previousMolstarConfig, newConfig);
      if (!configChanged) return;
      // await this.molstarViewInstance?.visual?.update(this.molstarConfig);
      this.molstarActionsMutex = this.molstarActionsMutex.then(() => this.molstarViewInstance?.visual?.update(newConfig));
      this.previousMolstarConfig = this.deepCopy(newConfig);
    }
  }

  public getInstance() {
    return this.molstarViewInstance;
  }

  public getContainer() {
    return this.viewContainer.nativeElement;
  }
}
