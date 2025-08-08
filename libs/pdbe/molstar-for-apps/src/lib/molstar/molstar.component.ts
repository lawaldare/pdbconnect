import { AfterViewInit, Component, ElementRef, inject, Input, input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';
import { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';

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

  public firstLoadFinished = signal(false);
  private molstarViewInstance!: PDBeMolstarPlugin;
  private readonly molstarPluginService = inject(MolstarPluginService);

  public isExpanded = false;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  async ngAfterViewInit() {
    await this.molstarPluginService.loadPlugin();
    const pluginInstance = this.molstarPluginService.createInstance();
    this.molstarViewInstance = pluginInstance;

    const container = this.viewContainer.nativeElement;

    this.molstarViewInstance.render(container, this.molstarConfig);
    this.molstarViewInstance.events.loadComplete.subscribe((loaded: boolean) => {
      if (loaded && !this.firstLoadFinished()) this.firstLoadFinished.set(true);
      if (loaded) {
        // this.molstarViewInstance.plugin.managers.camera.orientAxes();
        const eventName = `LibMolstarComponent-${this.id}`;
        window.dispatchEvent(new CustomEvent(eventName, { detail: { id: this.id, loaded } }));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['molstarConfig']?.firstChange) {
      this.molstarViewInstance?.visual?.update(this.molstarConfig);
    }
  }

  public getInstance() {
    return this.molstarViewInstance;
  }

  public getContainer() {
    return this.viewContainer.nativeElement;
  }
}
