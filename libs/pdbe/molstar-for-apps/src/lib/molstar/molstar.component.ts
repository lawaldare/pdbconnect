import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
// import { Mutex } from '@pdbc/core';
import { Mutex } from '@pdbc/core';
import type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';
import { BehaviorSubject } from 'rxjs';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';
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
  @Input() seqOnExpanded = false;
  @Input() isMobile = false;

  @Input({ required: true }) molstarConfig!: any;
  private previousMolstarConfig: any = null;

  public firstLoadFinished = signal(false);
  public configUpdated = new BehaviorSubject<any | null>(null);
  private molstarViewInstance!: PDBeMolstarPlugin;
  private readonly molstarPluginService = inject(MolstarPluginService);
  private readonly helpIconForMolstarService = inject(HelpIconForMolstarService);

  public isExpanded = false;
  @Output() toggledExpansion = new EventEmitter<boolean>();

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  /** Mutual exclusion for Molstar actions */
  public mutex = Mutex('molstarActionsMutex');

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
    // TODO: @adam check with Marcelo/Dare if it makes sense to set .molstarViewInstance before awaiting render

    const container = this.viewContainer.nativeElement;
    const renderLayout: Parameters<PDBeMolstarPlugin['render']>[0] = this.seqOnExpanded
      ? [{ target: container, component: this.getPDBeMolstarPluginClass()!.UIComponents.FullLayoutNoControlsUnlessExpanded }]
      : container;

    this.mutex.run(async () => {
      await this.molstarViewInstance.render(renderLayout, this.molstarConfig);
      console.log('render finished');

      if (!this.firstLoadFinished()) this.firstLoadFinished.set(true);
      window.dispatchEvent(new CustomEvent(`LibMolstarComponent-${this.id}`, { detail: { id: this.id, loaded: true } })); // TODO this is probably dead code, try to remove?

      this.molstarViewInstance.plugin.layout.events.updated.subscribe(() => {
        const expanded = this.molstarViewInstance.plugin.layout.state.isExpanded;
        if (expanded !== this.isExpanded) {
          this.isExpanded = expanded;
          this.toggledExpansion.emit(expanded);
        }
        this.helpIconForMolstarService.toggleHelpIcon(expanded);
      });
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const newConfig = changes['molstarConfig']?.currentValue;
    // if (!changes['molstarConfig']?.firstChange) {
    if (!newConfig) return;
    const configChanged = !this.deepEqual(this.previousMolstarConfig, newConfig);
    if (!configChanged && this.previousMolstarConfig !== null) return;
    // await this.molstarViewInstance?.visual?.update(this.molstarConfig);
    this.mutex.run(async () => {
      await this.molstarViewInstance?.visual?.update(newConfig);
      this.configUpdated.next(newConfig);
    });
    this.previousMolstarConfig = this.deepCopy(newConfig);
    // }
  }

  public getInstance() {
    return this.molstarViewInstance;
  }

  public getPDBeMolstarPluginClass(): typeof PDBeMolstarPlugin | undefined {
    return this.molstarPluginService.getClass();
  }

  public getContainer() {
    return this.viewContainer.nativeElement;
  }
}
