/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaApiService } from '../../services/pisa-api.service';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { PisaFileStoreService } from '../../services/pisa-file-store.service';
import { UploadPageFacade } from '../upload-page/uploade-page.facade';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, filter, switchMap } from 'rxjs';
import { PisaSelectors } from '../../store/pisa.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

const FILE_KEY = 'pisa-upload-file';
@Component({
  selector: 'app-processing',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './processing-page.html',
  styleUrl: './processing-page.scss',
})
export class ProcessingPageComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  public facade = inject(UploadPageFacade);
  public pisaUtilService = inject(PisaUtilService);
  public pisaAPIService = inject(PisaApiService);
  private pisaStore = inject(Store);
  public fileStore = inject(PisaFileStoreService);
  private jobId = toSignal(this.pisaStore.select(PisaSelectors.jobId).pipe(filter(Boolean)));

  public readonly loader = this.pisaUtilService.getPisaAssetUrl('assets/images/loader.gif');

  public savedLink = computed(() => {
    const jobId = this.jobId();
    if (!jobId) return '';
    return `${environment.baseUrl}pdbe/pisa/processing/${jobId}`;
  });

  private molstarViewer: any = null;

  public modelSym = this.facade.modelSym;
  public label = this.facade.label;

  @ViewChild('viewer') container!: ElementRef<HTMLElement>;

  private paramsAvailable = signal(false);

  constructor() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const jobId = params['jobId'];
          if (jobId) {
            this.paramsAvailable.set(true);
            this.loadDownloadedModelIntoMolstar(jobId);
            this.pisaStore.dispatch(PisaActions.getResultsFromJobId({ jobId }));
            return EMPTY;
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(() => {});
  }

  ngAfterViewInit(): void {
    this.initMolstar();
    if (!this.paramsAvailable()) {
      if (localStorage['job']) {
        localStorage.removeItem('job');
      } else {
        this.reAnalyse();
      }
    }
  }

  private getFilenameFromDisposition(disposition: string | null, fallback: string): string {
    if (!disposition) return fallback;

    // filename*=UTF-8''...
    const star = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (star?.[1]) return decodeURIComponent(star[1].replace(/"/g, ''));

    // filename="..."
    const normal = disposition.match(/filename\s*=\s*("?)([^";]+)\1/i);
    return normal?.[2] ?? fallback;
  }

  private async loadDownloadedModelIntoMolstar(jobId: string): Promise<void> {
    const url = `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${jobId}`;

    try {
      // this.pisaUtilService.setLoadingView('LOADING');

      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const disposition = res.headers.get('content-disposition');
      const contentType = res.headers.get('content-type') ?? '';
      const blob = await res.blob();
      if (!blob.size) throw new Error('Empty response');

      // Pick filename + infer format
      const fallbackName = contentType.includes('cif')
        ? `${jobId}.cif`
        : contentType.includes('pdb')
          ? `${jobId}.pdb`
          : contentType.includes('ent')
            ? `${jobId}.ent`
            : `${jobId}.cif`;

      const fileName = this.getFilenameFromDisposition(disposition, fallbackName);
      const file = new File([blob], fileName, { type: contentType || blob.type });

      // ✅ Reuse your existing viewer loader if you want:
      await this.loadFileToViewer(file);

      // If you also want analyse() to work later, store it like upload flow:
      // this.selectedFile = file;
      this.fileStore.put(FILE_KEY, file).catch(() => {});
      this.pisaUtilService.saveDataInSessionStorage({ fileName }, 'pisa-upload-meta');
    } catch (e) {
      console.error(e);
      this.facade.showError('Could not download/load model file.');
      this.pisaUtilService.setLoadingView('ERROR_LOADING');
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
