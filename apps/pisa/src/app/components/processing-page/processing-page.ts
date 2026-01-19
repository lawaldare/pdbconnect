/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { PisaFileStoreService } from '../../services/pisa-file-store.service';
import { UploadPageFacade } from '../upload-page/uploade-page.facade';

const FILE_KEY = 'pisa-upload-file';
@Component({
  selector: 'app-processing',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './processing-page.html',
  styleUrl: './processing-page.scss',
})
export class ProcessingPageComponent implements AfterViewInit {
  public facade = inject(UploadPageFacade);
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);
  public fileStore = inject(PisaFileStoreService);

  private molstarViewer: any = null;

  public modelSym = this.facade.modelSym;
  public label = this.facade.label;

  @ViewChild('viewer') container!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.initMolstar();
    if (localStorage['job']) {
      localStorage.removeItem('job');
    } else {
      this.reAnalyse();
    }
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
          this.pisaUtilService.setLoadingView('ERROR_LOADING');
        }
      });

      this.pisaUtilService.setLoadingView('INITIAL');
    } catch (error) {
      console.error('Error initializing Molstar:', error);
      this.facade.showError('Error initializing Molstar');
    }

    const file = await this.fileStore.get(FILE_KEY);
    if (file) {
      this.processFile(file);
    }
  }

  /** File processing */
  private processFile(file: any): void {
    const lowerName = file.name.toLowerCase();
    const isCif = lowerName.endsWith('.cif');
    const isEnt = lowerName.endsWith('.ent') || lowerName.endsWith('.pdb');
    if (!isCif && !isEnt) {
      this.facade.showError('Please select a valid .cif or .ent file');
      return;
    }

    this.fileStore.put(FILE_KEY, file).catch(() => {});
    this.pisaUtilService.saveDataInSessionStorage({ fileName: file.name }, 'pisa-upload-meta');

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

      if (!model) return;

      // const structures = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures;
      // this.facade.structures.update(() => structures);
      this.pisaUtilService.setLoadingView('LOADED');
    } catch (error) {
      console.error('Error loading CIF file:', error);
      this.facade.showError('Failed to load the CIF file. Please try another file.');
      this.pisaUtilService.setLoadingView('ERROR_LOADING');
    }
  }

  public async reAnalyse(): Promise<void> {
    const payloadSaved = this.pisaUtilService.getDataInSessionStorage('pisa-assembly-payload');

    const payload: any = {};
    payload.exclude_ligands = payloadSaved.exclude_ligands;
    payload.ligand_position = payloadSaved.ligand_position;
    payload.asis = payloadSaved.asis;
    payload.fileKey = payloadSaved.fileKey;
    payload.fileName = payloadSaved.fileName;
    this.pisaStore.dispatch(PisaActions.submitPISAJob({ payload }));
  }
}
