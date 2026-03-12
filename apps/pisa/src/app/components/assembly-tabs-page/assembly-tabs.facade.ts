import { computed, inject, Injectable, signal } from '@angular/core';
import { UploadPageFacade } from '../upload-page/uploade-page.facade';
import { PisaUtilService } from '../../services/pisa-util.service';

@Injectable({
  providedIn: 'root',
})
export class AssemblyTabsFacade {
  public facade = inject(UploadPageFacade);
  private pisaUtilService = inject(PisaUtilService);

  private molstarViewer: any = null;
  private model = signal<any>(null);
  private jobId = signal('');

  public label = computed(() => {
    const model = this.model();
    return model?.label ?? model?.entryId ?? this.jobId();
  });

  public simplifiedSpacegroup = computed(() => {
    const model = this.model();
    return model?._staticPropertyData?.model_symmetry?.spacegroup?.name?.trim() ?? '';
  });

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
      // this.fileStore.put(FILE_KEY, file).catch(() => {});
      // this.pisaUtilService.saveDataInSessionStorage({ fileName }, 'pisa-upload-meta');
    } catch (e) {
      console.error(e);
      // this.facade.showError('Could not download/load model file.');
      // this.pisaUtilService.setLoadingView('ERROR_LOADING');
    }
  }

  /** Load CIF file to Molstar */
  private async loadFileToViewer(file: File): Promise<void> {
    if (!this.molstarViewer) {
      return;
    }

    try {
      const fileContent = await this.facade.readFileAsText(file);

      this.molstarViewer.plugin.clear();

      const isEnt = file.name.toLowerCase().endsWith('.ent') || file.name.toLowerCase().endsWith('.pdb');
      const format = isEnt ? 'pdb' : 'mmcif';
      await this.molstarViewer.loadStructureFromData(fileContent, format);

      const data = this.molstarViewer.plugin.managers.structure.hierarchy.current.structures[0];
      if (!data) return;

      const model = data.cell?.obj?.data.models?.[0] || data.cell?.obj?.data;
      this.model.set(model);

      const detailForAssemblyTabs = {
        label: this.label(),
        spacegroup: this.simplifiedSpacegroup(),
      };
      this.pisaUtilService.saveDataInSessionStorage(detailForAssemblyTabs, 'pisa-assembly-details');
    } catch (error) {
      console.error('Error loading CIF file:', error);
    }
  }

  /** Molstar initialization */
  public async initMolstar(container: any, jobId: string) {
    console.warn(`Loading molstar from jobId::`, jobId);
    this.jobId.set(jobId);
    try {
      // Assumes Molstar is loaded globally
      this.molstarViewer = await (window as any).molstar.Viewer.create(container, {
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
      // this.molstarViewer.plugin.events.log.subscribe((e: any) => {
      //   if (e.type === 'error') {
      //     // this.facade.showError(`Mol* error: ${e.message}`);
      //     this.molstarViewer.plugin.clear();
      //     // this.pisaUtilService.setLoadingView('ERROR_LOADING');
      //   }
      // });

      // this.pisaUtilService.setLoadingView('INITIAL');
    } catch (error) {
      console.error('Error initializing Molstar:', error);
    }

    await this.loadDownloadedModelIntoMolstar(jobId);
  }
}
