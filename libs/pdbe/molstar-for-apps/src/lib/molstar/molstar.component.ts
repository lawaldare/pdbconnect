import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'lib-pdbe-molstar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './molstar.component.html',
  styleUrl: './molstar.component.scss',
})
export class MolstarComponent implements AfterViewInit {
  @Input() molstarConfig: any;
  @Input() height!: string;
  @Input() width!: string;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  ngAfterViewInit(): void {
    const viewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    viewInstance.render(container, this.molstarConfig);
  }
}
