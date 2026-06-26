import { AfterViewInit, Component, ElementRef, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitParams, MolstarPluginService, PDBeMolstarPlugin } from '../extension-for-pages/molstart-plugin.service';

@Component({
  selector: 'lib-molstar-gallery',
  templateUrl: './molstar-gallery.component.html',
  styleUrl: './molstar-gallery.component.scss',
})
export class MolstarGalleryComponent implements AfterViewInit {
  public entryId = input.required<string>();
  public pdbeUrl = input<string>();

  constructor(
    private store: Store,
    private el: ElementRef,
    private molstarPluginService: MolstarPluginService
  ) {}
  public readonly views = ['front', 'right', 'top'] as const;
  public currentIndex = 0;
  public pdbeMolstar?: PDBeMolstarPlugin;

  public setView(index: number): void {
    this.currentIndex = index;
    const direction = this.views[index];
    this.pdbeMolstar?.visual.setViewDirection(direction, { durationMs: 500 });
  }

  public next(): void {
    this.setView((this.currentIndex + 1) % this.views.length);
  }

  public previous(): void {
    this.setView((this.currentIndex - 1 + this.views.length) % this.views.length);
  }

  ngAfterViewInit() {
    this.initMolstar();
  }

  async initMolstar() {
    const options: Partial<InitParams> = {
      moleculeId: this.entryId(),
      bgColor: 'white',
      hideControls: true,
      hideCanvasControls: ['all'],
      loadingOverlay: true,
      pdbeLink: false,
      pdbeUrl: this.pdbeUrl(),
      landscape: true,
    };

    const ele = this.el.nativeElement.querySelector('#my-viewer');
    if (ele) {
      await this.molstarPluginService.loadPlugin();
      const pluginInstance = this.molstarPluginService.createInstance();
      this.pdbeMolstar = pluginInstance;
      await this.pdbeMolstar.render(ele, options);
    }
  }
}
