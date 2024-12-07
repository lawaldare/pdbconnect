import { AfterViewInit, Component, computed, ElementRef, input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'lib-pdbe-molstar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './molstar.component.html',
  styleUrl: './molstar.component.scss',
})
export class MolstarComponent implements AfterViewInit, OnChanges {
  public readonly molstarConfig = input.required<any>();
  public readonly height = input<string>();
  public readonly width = input<string>();

  private molstarViewInstance: any;

  public isExpanded = false;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    this.molstarViewInstance.render(container, this.molstarConfig());
    this.molstarViewInstance.events.loadComplete.subscribe((loaded: boolean) => {
      if (loaded) {
        // this.molstarViewInstance.plugin.managers.camera.orientAxes();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['molstarConfig'].firstChange) {
      this.molstarViewInstance.visual.update(this.molstarConfig());
    }
  }
}
