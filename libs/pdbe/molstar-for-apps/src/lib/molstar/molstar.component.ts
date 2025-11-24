import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';
import type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';
import { HelpIconForMolstarService } from '../help-icon-for-molstar.service';
import { BehaviorSubject } from 'rxjs';

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
    if (this.seqOnExpanded === false) {
      this.molstarActionsMutex = this.molstarActionsMutex.then(() => this.molstarViewInstance.render(container, this.molstarConfig));
    } else {
      this.molstarActionsMutex = this.molstarActionsMutex.then(() => {
        const layout = [{ target: container, component: this.molstarPluginService.getClass().UIComponents.FullLayoutNoControlsUnlessExpanded }];
        this.molstarViewInstance.render(layout, this.molstarConfig).then(() => {
          this.adjustMainCanvasStyleForSeq(false);
        });
      });
    }

    this.molstarViewInstance.events.loadComplete.subscribe((loaded: boolean) => {
      const eventName = `LibMolstarComponent-${this.id}`;
      if (loaded && !this.firstLoadFinished()) this.firstLoadFinished.set(true);
      if (loaded) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: { id: this.id, loaded } }));
      }

      this.molstarViewInstance.plugin.layout.events.updated.subscribe(() => {
        const expanded = this.molstarViewInstance.plugin.layout.state.isExpanded;
        if (expanded !== this.isExpanded) {
          this.isExpanded = expanded;
          this.toggledExpansion.emit(expanded);
        }
        if (this.seqOnExpanded) this.adjustMainCanvasStyleForSeq(expanded);
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
    this.molstarActionsMutex = this.molstarActionsMutex.then(async () => {
      await this.molstarViewInstance?.visual?.update(newConfig);
      this.configUpdated.next(newConfig);
    });
    this.previousMolstarConfig = this.deepCopy(newConfig);
    // }
  }

  public getInstance() {
    return this.molstarViewInstance;
  }

  public getContainer() {
    return this.viewContainer.nativeElement;
  }

  private adjustMainCanvasStyleForSeq(expanded: boolean) {
    const mainCanvasContainer = (this.getContainer() as HTMLDivElement).querySelector<HTMLDivElement>('div.msp-layout-region.msp-layout-main');
    if (expanded && mainCanvasContainer) {
      mainCanvasContainer.style.width = '';
      mainCanvasContainer.style.marginLeft = '';
    } else if (!expanded && mainCanvasContainer) {
      mainCanvasContainer.style.width = '100%';
      mainCanvasContainer.style.marginLeft = this.isMobile ? '' : '-32px';
    }
  }
}
