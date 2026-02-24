/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadPageFacade } from './uploade-page.facade';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { PisaFileStoreService } from '../../services/pisa-file-store.service';
import { Router } from '@angular/router';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { pisaUploadpageTooltips } from '../../pisa-app-constant';

const FILE_KEY = 'pisa-upload-file';
@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, HelpIconWithTooltipComponent],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPageComponent implements AfterViewInit {
  public facade = inject(UploadPageFacade);
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);
  public fileStore = inject(PisaFileStoreService);
  private router = inject(Router);

  private selectedFile: File | null = null;

  private molstarViewer: any = null;

  public selectedLigandPosition = new FormControl('auto', { nonNullable: true });
  public analysisIncluded = false;
  public uploadFile = signal<boolean>(true);

  public modelSym = this.facade.modelSym;
  public modelSymParam = this.facade.modelSymParam;
  public simplifiedSpacegroup = this.facade.simplifiedSpacegroup;
  public orthoCode = this.facade.orthoCode;
  public analysis = this.facade.analysis;
  public label = this.facade.label;
  public allOnes = this.facade.allOnes;
  public processLigands = this.facade.processLigands;
  public readonly pisaUploadpageTooltips = pisaUploadpageTooltips;

  private selectedLigands = signal<string[]>([]);

  @ViewChild('viewer') container!: ElementRef<HTMLElement>;

  @ViewChild('dropArea') dropArea!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public pdbEntryId = '';
  public hasError = signal(false);
  public errorInputMessage = signal('');

  ngAfterViewInit(): void {
    this.initMolstar();
  }

  public async onSubmit(): Promise<void> {
    sessionStorage.setItem('uploadFile', 'false');

    if (this.pdbEntryId && /^[0-9a-zA-Z]{4}$/.test(this.pdbEntryId)) {
      try {
        const file = await this.fetchCifAsFile(this.pdbEntryId);

        // store it so analyse() also works later
        this.selectedFile = file;
        this.fileStore.put(FILE_KEY, file).catch(() => {});
        this.pisaUtilService.saveDataInSessionStorage({ fileName: file.name }, 'pisa-upload-meta');

        // reuse your existing viewer loader
        await this.loadFileToViewer(file);
      } catch (e) {
        console.error(e);
        this.facade.showError('Unable to fetch CIF for this entry ID. Please check the ID.');
        this.pisaUtilService.setLoadingView('ERROR_LOADING');
      }
    } else {
      this.hasError.set(true);
      this.errorInputMessage.set('Please enter a valid PDB entry ID.');

      // setTimeout(() => {
      //   this.hasError.set(false);
      //   this.errorInputMessage.set('');
      // }, 2000);
    }
  }

  public onTyping(event: any): void {
    this.pdbEntryId = event.target.value;
    if (event.target.value === '') {
      this.hasError.set(false);
      this.errorInputMessage.set('');
    }
  }

  private async fetchCifAsFile(entryId: string): Promise<File> {
    const id = (entryId ?? '').trim().toLowerCase();

    // Optional validation (safe)
    if (!/^[0-9a-z]{4}$/.test(id)) {
      throw new Error('Invalid PDB entry id');
    }

    const url = `https://www.ebi.ac.uk/pdbe/entry-files/download/${id.toLowerCase()}.cif`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch CIF: HTTP ${res.status}`);
    }

    // get the raw bytes
    const blob = await res.blob();

    // convert to File so your existing flow works unchanged
    return new File([blob], `${id}.cif`, { type: 'chemical/x-mmcif' });
  }

  /** Molstar initialization */
  private async initMolstar() {
    try {
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
          this.selectedFile = null;
          this.pisaUtilService.setLoadingView('ERROR_LOADING');
        }
      });

      // if (localStorage['jobState'] === 'running') {
      //   this.pisaUtilService.setPageView('PROCESS');
      // }

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
    sessionStorage.setItem('uploadFile', 'true');
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
    this.dropArea.nativeElement.style.borderColor = '#454545';
    this.dropArea.nativeElement.style.backgroundColor = 'transparent';
  }

  /** File processing */
  private processFile(file: File): void {
    const lowerName = file.name.toLowerCase();
    const isCif = lowerName.endsWith('.cif') || lowerName.endsWith('.bcif');
    const isEnt = lowerName.endsWith('.ent') || lowerName.endsWith('.pdb');
    if (!isCif && !isEnt) {
      this.facade.showError('File format is not supported. Please try again with a .cif, .bcif, .pdb or .ent file.');
      return;
    }

    this.selectedFile = file;
    this.fileStore.put(FILE_KEY, file).catch(() => {});
    this.pisaUtilService.saveDataInSessionStorage({ fileName: file.name }, 'pisa-upload-meta');

    this.facade.hideError();
    this.facade.showSuccess('File selected successfully. Loading structure...');
    this.loadFileToViewer(file);
  }

  private checkUploadStatus(): void {
    const status = sessionStorage.getItem('uploadFile');
    if (status === 'true') {
      this.uploadFile.set(true);
    } else {
      this.uploadFile.set(false);
    }
  }

  /** Load CIF file to Molstar */
  private async loadFileToViewer(file: File): Promise<void> {
    if (!this.molstarViewer) {
      this.facade.showError('Viewer not initialized');
      return;
    }

    this.checkUploadStatus();

    try {
      this.pisaUtilService.setLoadingView('LOADING');

      const fileContent = await this.facade.readFileAsText(file);

      this.molstarViewer.plugin.clear();

      const isEnt = file.name.toLowerCase().endsWith('.ent') || file.name.toLowerCase().endsWith('.pdb');
      const format = isEnt ? 'pdb' : 'mmcif';
      await this.molstarViewer.loadStructureFromData(fileContent, format);

      const data = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures[0];
      if (!data) return;

      const model = data.cell?.obj?.data.models?.[0] || data.cell?.obj?.data;
      this.facade.model.set(model);

      const detailForAssemblyTabs = {
        label: this.label(),
        spacegroup: this.simplifiedSpacegroup(),
      };
      this.pisaUtilService.saveDataInSessionStorage(detailForAssemblyTabs, 'pisa-assembly-details');

      if (!model) return;

      const structures = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures;
      this.facade.structures.update(() => structures);
      this.pisaUtilService.setLoadingView('LOADED');
    } catch (error) {
      console.error('Error loading CIF file:', error);
      this.facade.showError('Failed to load the CIF file. Please try another file.');
      this.pisaUtilService.setLoadingView('ERROR_LOADING');
    }
  }

  public selectProcessLigands(selected: boolean, index: number): void {
    const ligands = this.facade.processLigands();
    ligands[index].selected = selected;
    const unSelectedLigands = ligands.filter((ligand) => !ligand.selected).map((ligand) => ligand.title);
    this.selectedLigands.update(() => [...unSelectedLigands]);
  }

  public async analyse(): Promise<void> {
    // this.pisaUtilService.setPageView('PROCESS');

    this.router.navigate(['/processing'], { queryParamsHandling: 'preserve' });
    // localStorage.setItem('job', 'called');

    const file = this.selectedFile ?? (await this.fileStore.get(FILE_KEY));
    if (!file) {
      this.facade.showError('No file found. Please re-upload.');
      return;
    }

    const meta = this.pisaUtilService.getDataInSessionStorage('pisa-upload-meta');

    const payload: any = {};
    payload.exclude_ligands = this.selectedLigands();
    payload.ligand_position = this.selectedLigandPosition.value;
    payload.asis = this.analysisIncluded;
    payload.fileKey = FILE_KEY;
    payload.fileName = meta.fileName;
    this.pisaUtilService.saveDataInSessionStorage(payload, 'pisa-assembly-payload');
    this.pisaStore.dispatch(PisaActions.submitPISAJob({ payload }));
  }
}
