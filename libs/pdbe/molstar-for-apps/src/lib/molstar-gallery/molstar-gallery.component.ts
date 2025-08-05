import { AfterViewInit, Component, ElementRef, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MolstarPluginService } from '../extension-for-pages/molstart-plugin.service';
// import { MolstarPluginService } from '../';

@Component({
  selector: 'lib-molstar-gallery',
  templateUrl: './molstar-gallery.component.html',
  styleUrl: './molstar-gallery.component.scss',
})
export class MolstarGalleryComponent implements AfterViewInit {
  public entryId = input.required<string>();

  constructor(
    private store: Store,
    private el: ElementRef,
    private molstarPluginService: MolstarPluginService
  ) {}
  public readonly views = ['front', 'right', 'top'];
  public currentIndex = 0;
  public pdbeMolstar: any;
  // public originalCamera: any;
  // public accession = toSignal(this.store.select(EntrySelectors.accession));
  // public entryData = signal<EntryData>({} as EntryData);
  public setView(index: number): void {
    this.currentIndex = index;
    const direction = this.views[index];
    this.pdbeMolstar.visual.setViewDirection(direction, { durationMs: 500 });
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
    const options = {
      moleculeId: this.entryId(),
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle', 'controlInfo', 'selection', 'trajectory'],
      landscape: true,
    };
    const ele = this.el.nativeElement.querySelector('#my-viewer');
    if (ele) {
      await this.molstarPluginService.loadPlugin();
      const pluginInstance = this.molstarPluginService.createInstance();
      this.pdbeMolstar = pluginInstance;
      this.pdbeMolstar.render(ele, options);
    }
  }
}
