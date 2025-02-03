/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, input, Input, ViewChild, ElementRef, AfterViewInit, viewChild, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, first, firstValueFrom, timer } from 'rxjs';
import { Molecule } from '../../data-models/molecule.model';
import { OverviewMolstarFacade } from './data-processing.facade';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { CathMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { OverviewStateManagementService } from './state-management.service';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { MolstarConfigObject } from '../../helpers/molstar/molstar-base-class';
import { OverviewMolstarControBarComponent } from './sub-components/molstar-control-bar/molstar-control-bar.component';
import { OverviewMolstarTabNavComponent } from './sub-components/tab-nav-menu/tab-nav-menu.component';
import { OverviewMolstarTabListViewComponent } from './sub-components/tab-listview-content/tab-listview-content.component';
import { CitationDetail } from '../../data-models/publication.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, OverviewMolstarTabNavComponent, OverviewMolstarControBarComponent, OverviewMolstarTabListViewComponent],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  // javascript functions exposed to template for parsing domains nested data
  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  // data inputs from parent component
  // public readonly entryId = input.required<string>();
  // public readonly complexDetails = input.required<ComplexDetails[]>();
  // public readonly macromolecules = input.required<Molecule[]>();
  // public readonly ligands = input.required<Molecule[]>();
  // public readonly inputModifications = input.required<ModifiedResidue[]>();
  // public readonly cathMappings = input.required<CathMappings>();
  // public readonly scopMappings = input.required<ScopMappings>();
  // public readonly pfamMappings = input.required<PfamMappings>();
  // public readonly primaryPublication = input.required<CitationDetail | undefined>();

  public totalDomains = 0;

  // data processing facade and it's signals (processed data)
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly signals = inject(ComponentCommunicationService);

  public readonly stateManagement = inject(OverviewStateManagementService);

  public readonly molstarOverview = inject(MolstarOverviewForTopPage);

  // residue listing information retrieved using molstar
  private molstarResiduesForAssembly = this.molstarOverview.residues;
  public assemblyData = this.dataProcessing.assemblyData;

  // reference to template molstar container and list container
  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  // molstar image gallery list of image names
  public imageList: string[] = [];

  // name of image displayed on default state ('No selection') for all tabs
  public preferredAssemblyImgName?: string;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly inputModifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  private async initMolstarInstance() {
    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred + '' : '1';

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: this.entryId(),
      assemblyId: assemblyToUse,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: false,
    };

    await this.molstarOverview.initMolstar(molstarConfigObject, this.molstarContainer);

    // get list of residues loaded into molstar
    // ?TODO: Could be optimized by filtering non macromolecules and non ligands data
    this.molstarOverview.parseInstanceResidues();
    await firstValueFrom(timer(50));

    this.molstarOverview.buttonsShowHide();
  }

  private async initMolstarImageGallery() {
    await this.molstarOverview.initImageGallery(this.entryId() ?? '');

    for (const imageObj of this.molstarOverview.galleryManager().images) {
      if (imageObj.clean_description.includes('this domain is out of the observed residue ranges!')) {
        continue;
      }
      this.imageList.push(imageObj.filename);
    }

    const assemblyToUse = this.assemblyData().preferred ? this.assemblyData().preferred : '1';
    this.preferredAssemblyImgName = `${this.entryId()?.toLowerCase()}_assembly_${assemblyToUse}_chemically_distinct_molecules_front`;
    // this.preferredAssemblyImgName = `${this.entryId().toLowerCase()}_deposited_chemically_distinct_molecules_front`;
    for (const tabName of ['Assembly', 'Macromolecules', 'Ligands', 'Domains', 'Modifications']) {
      this.stateManagement.updateStatePropertyOfTab(tabName, 'initialStateImgName', this.preferredAssemblyImgName);
      this.stateManagement.updateStatePropertyOfTab(tabName, 'imgName', this.preferredAssemblyImgName);
    }

    await this.molstarOverview.loadImage(this.preferredAssemblyImgName);
    this.stateManagement.updateStatePropertyOfTab('current', 'imgName', this.preferredAssemblyImgName);
  }

  async ngAfterViewInit() {
    // set info controls to state management for scroll control
    this.stateManagement.infoControls.set(this.infoControls);

    // generate related entries data
    this.dataProcessing.parseRelatedEntries(this.primaryPublication());

    // generate assembly related data
    // generate text strings related to macromolecule types count
    this.dataProcessing.generateMoleculeCountText(this.macromolecules() ?? []);

    // initialise molstar and the image gallery functionality
    await this.initMolstarInstance();
    await this.initMolstarImageGallery();

    // get domain specific images
    const imagesForDomains = this.imageList.filter((eachImg) => {
      return eachImg.includes('CATH') || eachImg.includes('SCOP') || eachImg.includes('Pfam');
    });

    // count total domains to check if domain section is active
    this.totalDomains = imagesForDomains.length;

    // get a single modres image
    let modresImg = this.imageList.filter((eachImg) => {
      return eachImg.includes('_modres_');
    });
    if (modresImg.length > 1) modresImg = [modresImg[0]];

    // retrieve entity and domain colors from molj files of image gallery
    await this.dataProcessing.getColorsFromMolj([this.preferredAssemblyImgName!, ...imagesForDomains, ...modresImg]);

    // parse all data into list view or nested list view objects and molstar selection objects
    if (this.complexDetails()?.length) {
      this.dataProcessing.parseComplexDetails(this.complexDetails());
      this.dataProcessing.generateListSelectable(
        this.entryId()!,
        this.macromolecules()!,
        this.ligands()!,
        this.inputModifications()!,
        this.cathMappings()!,
        this.pfamMappings()!,
        this.scopMappings()!,
        this.imageList,
        this.molstarResiduesForAssembly()
      );
    }

    let firstTab = undefined;
    // set sections as active if they contain any data mapped to them
    if (this.dataProcessing.assemblyData().preferred !== undefined) {
      this.stateManagement.updateStatePropertyOfTab('Assembly', 'isInactive', false);
      firstTab = 'Assembly';
    } else {
      this.stateManagement.updateTabDisplayConfig('Assembly', 'N/A', 'na');
    }

    if (this.macromolecules()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Macromolecules', 'isInactive', false);
      if (!firstTab) firstTab = 'Macromolecules';
    } else {
      this.stateManagement.updateTabDisplayConfig('Macromolecules', 'N/A', 'na');
    }

    if (this.ligands()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Ligands', 'isInactive', false);
      if (!firstTab) firstTab = 'Ligands';
    } else {
      this.stateManagement.updateTabDisplayConfig('Ligands', 'N/A', 'na');
    }

    if (this.totalDomains > 0) {
      this.stateManagement.updateStatePropertyOfTab('Domains', 'isInactive', false);
      if (!firstTab) firstTab = 'Domains';
    } else {
      this.stateManagement.updateTabDisplayConfig('Domains', 'N/A', 'na');
    }

    if (this.inputModifications()!.length > 0) {
      this.stateManagement.updateStatePropertyOfTab('Modifications', 'isInactive', false);
      if (!firstTab) firstTab = 'Modifications';
    } else {
      this.stateManagement.updateTabDisplayConfig('Modifications', 'N/A', 'na');
    }
    if (!firstTab) firstTab = 'Assembly';

    await this.stateManagement.switchCurrentTab(firstTab);
  }
}
