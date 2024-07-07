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

  private molstarViewInstance: any;

  public isExpanded = false;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    this.molstarViewInstance.render(container, this.molstarConfig);

    this.molstarViewInstance.events.loadComplete.subscribe(() => {
      const expandedLayout: HTMLDivElement | null = document.querySelector('.msp-plugin-content');

      const observer = new MutationObserver((mutationsList) => {
        const mutationRecord = mutationsList[0];
        this.isExpanded = (mutationRecord.target as HTMLElement).classList.contains('msp-layout-expanded');
        if (expandedLayout) {
          this.updateMolstarView(this.isExpanded, expandedLayout);
        }
      });
      if (expandedLayout) {
        observer.observe(expandedLayout as Node, { attributes: true, attributeFilter: ['style', 'class'] });
      }
    });
  }

  private updateMolstarView(expanded: boolean, expandedLayout: HTMLDivElement | null) {
    if (expandedLayout) {
      if (expanded) {
        expandedLayout.style.width = '95%';
        expandedLayout.style.display = 'flex';
        expandedLayout.style.justifyContent = 'center';
        expandedLayout.style.height = '90%';
        expandedLayout.style.margin = 'auto';
      } else {
        expandedLayout.style.width = '';
        expandedLayout.style.display = '';
        expandedLayout.style.justifyContent = '';
        expandedLayout.style.height = '';
        expandedLayout.style.top = '';
      }
    }
  }

  public triggerCollapse() {
    this.molstarViewInstance.canvas.toggleExpanded(false);
  }
}
