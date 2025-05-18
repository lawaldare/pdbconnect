import { AfterViewInit, Component, ElementRef, inject, Input, input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';

@Component({
  selector: 'lib-pdbe-molstar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './molstar.component.html',
  styleUrl: './molstar.component.scss',
})
export class MolstarComponent implements AfterViewInit, OnChanges {
  @Input() height = '400px';
  @Input() width = '100%';
  @Input({ required: true }) molstarConfig!: any;

  private molstarViewInstance: any;
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
      if (loaded) {
        // this.molstarViewInstance.plugin.managers.camera.orientAxes();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['molstarConfig']?.firstChange) {
      this.molstarViewInstance?.visual?.update(this.molstarConfig);
    }
  }
}
