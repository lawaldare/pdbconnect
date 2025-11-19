import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UploadPageFacade } from './uploade-page.facade';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPageComponent implements AfterViewInit {
  public facade = inject(UploadPageFacade);

  private molstarViewer: any = null;
  public currentFile: File | null = null;

  public modelSym = this.facade.modelSym;
  public modelSymParam = this.facade.modelSymParam;
  public simplifiedSpacegroup = this.facade.simplifiedSpacegroup;
  public orthoCode = this.facade.orthoCode;
  public analysis = this.facade.analysis;
  public label = this.facade.label;

  @ViewChild('viewer') container!: ElementRef<HTMLElement>;

  @ViewChild('dropArea') dropArea!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public pdbEntryId = '';
  public hasError = signal(false);
  public errorInputMessage = signal('');

  ngAfterViewInit(): void {
    this.initMolstar();
  }

  public onSubmit(): void {
    if (this.pdbEntryId) {
      console.log('PDB Entry ID submitted:', this.pdbEntryId);
    } else {
      this.hasError.set(true);
      this.errorInputMessage.set('Please enter a valid PDB entry ID.');

      setTimeout(() => {
        this.hasError.set(false);
        this.errorInputMessage.set('');
      }, 2000);
    }
  }

  /** Molstar initialization */
  private async initMolstar() {
    try {
      this.facade.showLoading();

      // Assumes Molstar is loaded globally
      this.molstarViewer = await (window as any).molstar.Viewer.create(this.container.nativeElement, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,
        collapseLeftPanel: true,
        collapseRightPanel: true,
        viewportShowControls: false,
        canvas3d: { backgroundColor: { r: 0, g: 0, b: 0 } },
      });

      // 🔴 Catch Mol* internal errors here
      this.molstarViewer.plugin.events.log.subscribe((e: any) => {
        if (e.type === 'error') {
          this.facade.showError(`Mol* error: ${e.message}`);
          this.molstarViewer.plugin.clear();
          // this.currentFile = null;
          this.facade.hideLoading();
        }
      });

      this.facade.hideLoading();
    } catch (error) {
      console.error('Error initializing Molstar:', error);
      this.facade.showError('Error initializing Molstar');
    }
  }

  /** Browse file button */
  public onBrowseClick(): void {
    this.fileInput.nativeElement.click();
  }

  /** File input change */
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFile(input.files[0]);
    }
  }

  /** Drag & drop events */
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropArea.nativeElement.style.borderColor = '#2196f3';
    this.dropArea.nativeElement.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
  }

  public onDragLeave(): void {
    this.resetDropAreaStyle();
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }

    this.resetDropAreaStyle();
  }

  private resetDropAreaStyle(): void {
    this.dropArea.nativeElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    this.dropArea.nativeElement.style.backgroundColor = 'transparent';
  }

  /** File processing */
  private processFile(file: File): void {
    const lowerName = file.name.toLowerCase();
    const isCif = lowerName.endsWith('.cif');
    const isEnt = lowerName.endsWith('.ent') || lowerName.endsWith('.pdb');
    if (!isCif && !isEnt) {
      this.facade.showError('Please select a valid .cif or .ent file');
      return;
    }

    this.currentFile = file;
    this.facade.hideError();
    this.facade.showSuccess('File selected successfully. Loading structure...');
    this.loadFileToViewer(file);
  }

  /** Load CIF file to Molstar */
  private async loadFileToViewer(file: File): Promise<void> {
    if (!this.molstarViewer) {
      this.facade.showError('Viewer not initialized');
      return;
    }

    try {
      this.facade.showLoading();

      const fileContent = await this.facade.readFileAsText(file);

      this.molstarViewer.plugin.clear();

      const isEnt = file.name.toLowerCase().endsWith('.ent') || file.name.toLowerCase().endsWith('.pdb');
      const format = isEnt ? 'pdb' : 'mmcif';
      await this.molstarViewer.loadStructureFromData(fileContent, format);

      const data = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures[0];
      if (!data) return;

      const model = data.cell?.obj?.data.models?.[0] || data.cell?.obj?.data;
      console.log('Loaded model:', model);
      this.facade.model.set(model);
      if (!model) return;

      const structures = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures;
      this.facade.structures.update(() => structures);
      console.log(this.facade.ligandCompIds());
      this.facade.hideLoading();
    } catch (error) {
      console.error('Error loading CIF file:', error);
      this.facade.showError('Failed to load the CIF file. Please try another file.');
      this.facade.hideLoading();
    }
  }
}
