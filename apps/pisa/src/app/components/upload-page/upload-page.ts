import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadPageFacade } from './uploade-page.facade';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPageComponent implements AfterViewInit {
  public facade = inject(UploadPageFacade);
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);
  private router = inject(Router);

  private molstarViewer: any = null;
  public currentFile: string | null = null;

  public selectedLigandPosition = new FormControl('auto', { nonNullable: true });
  public analysisIncluded = false;

  public modelSym = this.facade.modelSym;
  public modelSymParam = this.facade.modelSymParam;
  public simplifiedSpacegroup = this.facade.simplifiedSpacegroup;
  public orthoCode = this.facade.orthoCode;
  public analysis = this.facade.analysis;
  public label = this.facade.label;
  public processLigands = this.facade.processLigands;

  // public selectedLigands = linkedSignal({
  //   source: this.processLigands,
  //   computation: () => this.processLigands().map((ligand) => ligand.title),
  // });

  private selectedLigands = signal<string[]>([]);

  @ViewChild('viewer') container!: ElementRef<HTMLElement>;

  @ViewChild('dropArea') dropArea!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public pdbEntryId = '';
  public hasError = signal(false);
  public errorInputMessage = signal('');

  ngAfterViewInit(): void {
    this.initMolstar();
    // console.log(this.pisaUtilService.loadingView());
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
      // this.facade.showLoading();
      // this.pisaUtilService.setLoadingView('LOADING');

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
          this.currentFile = null;
          // this.facade.hideLoading();
          this.pisaUtilService.setLoadingView('ERROR_LOADING');
        }
      });

      // this.facade.hideLoading();
      this.pisaUtilService.setLoadingView('INITIAL');
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

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log(base64); // this is the base64 string
      this.currentFile = base64;
    };

    reader.readAsDataURL(file);

    // this.currentFile = file;
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
      // this.facade.showLoading();
      this.pisaUtilService.setLoadingView('LOADING');

      const fileContent = await this.facade.readFileAsText(file);

      this.molstarViewer.plugin.clear();

      const isEnt = file.name.toLowerCase().endsWith('.ent') || file.name.toLowerCase().endsWith('.pdb');
      const format = isEnt ? 'pdb' : 'mmcif';
      await this.molstarViewer.loadStructureFromData(fileContent, format);

      const data = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures[0];
      if (!data) return;

      const model = data.cell?.obj?.data.models?.[0] || data.cell?.obj?.data;
      // console.log('Loaded model:', model);
      this.facade.model.set(model);
      if (!model) return;

      const structures = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures;
      this.facade.structures.update(() => structures);
      // this.facade.hideLoading();
      this.pisaUtilService.setLoadingView('LOADED');
    } catch (error) {
      console.error('Error loading CIF file:', error);
      this.facade.showError('Failed to load the CIF file. Please try another file.');
      // this.facade.hideLoading();
      this.pisaUtilService.setLoadingView('ERROR_LOADING');
    }
  }

  public selectProcessLigands(selected: boolean, index: number): void {
    const ligands = this.facade.processLigands();
    ligands[index].selected = selected;
    const unSelectedLigands = ligands.filter((ligand) => !ligand.selected).map((ligand) => ligand.title);
    this.selectedLigands.update(() => [...unSelectedLigands]);
    // console.log('Selected ligands:', this.selectedLigands());
  }

  public analyse(): void {
    this.pisaUtilService.setPageView('PROCESS');
    const payload: any = {};
    payload.exclude_ligands = this.selectedLigands();
    payload.ligand_position = this.selectedLigandPosition.value;
    payload.asis = this.analysisIncluded;
    payload.file = this.currentFile;
    console.log('Analyse payload:', payload);
    this.pisaUtilService.saveAssemblyPayload(payload);
    this.pisaStore.dispatch(PisaActions.submitPISAJob({ payload }));
  }
}
