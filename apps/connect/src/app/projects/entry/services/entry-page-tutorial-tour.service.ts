import { inject, Injectable, signal } from '@angular/core';
import { driver } from 'driver.js';
import { ComponentCommunicationService } from './component-comm.service';
import { tourIds } from '../entry-constant';

@Injectable({
  providedIn: 'root',
})
export class EntryPageTutorialTourService {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public showSummaryTourBanner = signal(true);
  public showModelQualityTourBanner = signal(true);
  public showAssembliesTourBanner = signal(true);
  public showMacromoleculesTourBanner = signal(true);
  public showLigandsTourBanner = signal(true);
  public showDomainsTourBanner = signal(true);
  public showAnnotationsTourBanner = signal(true);

  public showHelpGuideModal = signal(false);

  // loaded data state for each tab
  public hasAssemblies = signal(true);
  public hasMacromolecules = signal(true);
  public hasAnnotations = signal(true);
  public hasLigands = signal(true);
  public hasDomains = signal(true);

  public summaryTabTourSteps: any = [
    {
      id: 'summary',
      element: '#structure-summary-tour',
      popover: {
        title: 'Structure summary',
        description: 'Here you’ll find the key details about this structure, including authors, external databases links, and PDB model quality summary.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'summary',
      element: '#structure-overview-tour',
      popover: {
        title: '3D structure overview',
        description: 'The interactive 3D viewer lets you explore the structure directly on the page.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'summary',
      element: '#entry-features-tour',
      popover: {
        title: 'Entry features in 3D',
        description:
          'The accordions display key features of the entry. Expanding each section provides more detail and links the feature directly to the 3D viewer. For example, clicking on “Ligands” will highlight the ligands in the 3D view. Clicking on one ligand will highlight and, then, focus the viewer on it.',
        side: 'bottom',
        align: 'center',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.summary, 'true', 365);
          this.showSummaryTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
    // {
    //   id: 'summary',
    //   element: '#entry-navigation-tour',
    //   popover: {
    //     title: 'Entry navigation',
    //     description: 'Use the tabs to move through different sections of the entry and find more information.',
    //     side: 'bottom',
    //     align: 'start',
    //     doneBtnText: 'Finish',
    //     onNextClick: (el: any, step: any, options: any) => {
    //       this.setCookie(tourIds.summary, 'true', 365);
    //       this.showSummaryTourBanner.set(false);
    //       options.driver.destroy();
    //     },
    //   },
    // },
  ];

  public modelQualityTabTourSteps: any = [
    {
      id: 'model-quality',
      element: '#model-quality-data-side-tour',
      popover: {
        title: 'Model quality',
        description:
          'Scroll down the page to check validation metric scores, PDB-REDO quality summary and different model quality information according to the experiment type of an entry.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'model-quality',
      element: '#molstar-side-tour',
      popover: {
        title: 'Model quality in 3D',
        description: 'Residues in the 3D viewer are coloured by validation issues according to the legend. Use the top menu to filter by issue type.',
        side: 'left',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.modelQuality, 'true', 365);
          this.showModelQualityTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public complexesTabTourSteps: any = [
    {
      id: 'assemblies',
      element: '#complexes-content-tour',
      popover: {
        title: 'Complex details',
        description: 'View detailed information for a Complex, including PISA metrics, alongside its 3D structure.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'assemblies',
      element: '#dashboard-stat-links-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'assemblies',
      element: '#complexes-list-tour',
      popover: {
        title: 'Available complexes',
        description: 'Here you will see all complexes for this entry. If there’s more than one, switch between them to compare details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.assemblies, 'true', 365);
          this.showAssembliesTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public macromoleculeTabTourSteps: any = [
    {
      id: 'macromolecules',
      element: '#macromolecule-details-tour',
      popover: {
        title: 'Macromolecule details',
        description: 'View details about a macromolecule, including UniProt mappings, Gene names and GO terms, if available.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'macromolecules',
      element: '#deeper-analysis-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'macromolecules',
      element: '#annotations-viewer-tour',
      popover: {
        title: '3D and annotation viewers',
        description: 'Explore residue-mapped annotations for a macromolecule with the interactive viewers below.',
        side: 'top',
        align: 'center',
      },
    },
    {
      id: 'macromolecules',
      element: '#interactive-sequence-viewer-tour',
      popover: {
        title: 'Interactive sequence viewer',
        description:
          'In the Sequence Viewer, click a residue to locate and zoom to it in 3D. Colours highlight validation issues, and the right-hand panel shows both author numbering (Auth) and sequence IDs when available.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'macromolecules',
      element: '#map-data-btn',
      popover: {
        title: 'Map your residues in 3D',
        description:
          'Add your own annotations by entering residues or ranges to display them on 3D. Your data is used only on this page and is never sent to a server.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'macromolecules',
      element: '#macromolecules-list-tour',
      popover: {
        title: 'Available macromolecules',
        description:
          'Here you will see all macromolecules for this entry. If there’s more than one, filter by protein or RNA/DNA and switch between them to see details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.macromolecules, 'true', 365);
          this.showMacromoleculesTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public ligandsTabTourSteps: any = [
    {
      id: 'ligands',
      element: '#ligands-detail-tour',
      popover: {
        title: 'Ligand details',
        description: 'View details about a ligand,  including its name and available synonyms, formula and molecular weight.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'ligands',
      element: '#ligand-deeper-analysis-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'ligands',
      element: '#ligand-interaction-tour',
      popover: {
        title: 'Ligand interactions linked to 3D',
        description: 'Explore the table with ligand–macromolecule contacts generated by PDBe Arpeggio. Hover over a row to highlight the interaction atoms in 3D.',
        side: 'top',
        align: 'center',
      },
    },
    {
      id: 'ligands',
      element: '#ligand-environment-tour',
      popover: {
        title: 'Ligand environment in 2D view',
        description:
          'The viewer shows a 2D network of interactions between the ligand and nearby residues. Colours mark interaction types. Hover a residue to highlight it in the 3D viewer above.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'ligands',
      element: '#ligand-list-tour',
      popover: {
        title: 'Available ligands and modified residues',
        description:
          'Here you will see all ligands and modifications for this entry. If there’s more than one, filter by bound ligand or modified residues and switch between them to see details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.ligands, 'true', 365);
          this.showLigandsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public domainTabTourSteps: any = [
    {
      id: 'domains',
      element: '#domains-detail-tour',
      popover: {
        title: 'Domains details',
        description:
          'View details about a domain here, including its description, a link to the original domain resource and the domain segments in both author and sequence ID numbering.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'domains',
      element: '#domains-sequence-viewer-tour',
      popover: {
        title: 'Interactive sequence viewer',
        description:
          'In the Sequence Viewer, click a residue to locate and zoom to it in 3D. Colours highlight domain regions, and the right-hand panel shows both author numbering (Auth) and sequence IDs when available.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'domains',
      element: '#domains-list-tour',
      popover: {
        title: 'Available domains',
        description:
          'Here you will see all domains for this entry. If there’s more than one, filter by domain resource (CATH, SCOP, and Pfam)  and switch between them to see details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.domains, 'true', 365);
          this.showDomainsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public annotationsTabTourSteps: any = [
    {
      id: 'llm',
      element: '#text-mined-annotations-tour',
      popover: {
        title: 'Text mined annotations',
        description:
          'Explore residue annotations automatically extracted from the primary PDB publication. Details here include the source paper reference and links to the AI text-mining pipeline.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'llm',
      element: '#ai-annotations-sequence-viewer-tour',
      popover: {
        title: 'AI annotations in the Sequence Viewer',
        description:
          'In the Sequence Viewer, click a residue to see its annotations and zoom to it in 3D. Colours indicate model quality and blue circles highlight annotated residues, with details shown in the right-hand panel.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'llm',
      element: '#llm-list-tour',
      popover: {
        title: 'Available molecules with annotations',
        description: 'Here you will see all molecules that have text-mined annotations in this entry. If there’s more than one, switch between them to see details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.llm, 'true', 365);
          this.showAnnotationsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public startTour(steps: any[]): void {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: steps,
      prevBtnText: 'Previous step',
      onDestroyed: (element: any, step: any, options: any) => {
        this.setCookiesWhenTourClosedWithFinishing(step.id);
      },
    });

    driverObj.drive();
  }

  public getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  public setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private setCookiesWhenTourClosedWithFinishing(tourId: string): void {
    switch (tourId) {
      case 'summary':
        this.setCookie(tourIds.summary, 'true', 365);
        break;
      case 'model-quality':
        this.setCookie(tourIds.modelQuality, 'true', 365);
        break;
      case 'assemblies':
        this.setCookie(tourIds.assemblies, 'true', 365);
        break;
      case 'macromolecules':
        this.setCookie(tourIds.macromolecules, 'true', 365);
        break;
      case 'ligands':
        this.setCookie(tourIds.ligands, 'true', 365);
        break;
      case 'domains':
        this.setCookie(tourIds.domains, 'true', 365);
        break;
      case 'llm':
        this.setCookie(tourIds.llm, 'true', 365);
        break;
      default:
        console.log('No tour steps found for this tab');
        break;
    }
  }

  public startTourFromHelp() {
    const currentTabName = this.compCommunication.currentTabName();
    switch (currentTabName) {
      case 'summary':
        this.startTour(this.summaryTabTourSteps);
        break;
      case 'model-quality':
        this.startTour(this.modelQualityTabTourSteps);
        break;
      case 'assemblies':
        if (this.hasAssemblies()) {
          this.startTour(this.complexesTabTourSteps);
        }
        break;
      case 'macromolecules':
        if (this.hasMacromolecules()) {
          this.startTour(this.macromoleculeTabTourSteps);
        }
        break;
      case 'ligands':
        if (this.hasLigands()) {
          this.startTour(this.ligandsTabTourSteps);
        }
        break;
      case 'domains':
        if (this.hasDomains()) {
          this.startTour(this.domainTabTourSteps);
        }
        break;
      case 'llm':
        if (this.hasAnnotations()) {
          this.startTour(this.annotationsTabTourSteps);
        }
        break;
      default:
        console.log('No tour steps found for this tab');
        break;
    }

    this.showHelpGuideModal.set(false);
  }
}
