import { inject, Injectable, signal } from '@angular/core';
import { driver } from 'driver.js';
import { ComponentCommunicationService } from './component-comm.service';
import { routeTabs, tourIds } from '../entry-constant';

@Injectable({
  providedIn: 'root',
})
export class TutorialTourService {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly showTourBanner = signal(true);

  public summaryTabTourSteps: any = [
    {
      element: '#structure-summary-tour',
      popover: {
        title: 'Structure summary',
        description: 'Here you’ll find the key details about this structure, including authors, external databases links, and PDB model quality summary.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#structure-overview-tour',
      popover: {
        title: '3D structure overview',
        description: 'The interactive 3D viewer lets you explore the structure directly on the page.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#entry-features-tour',
      popover: {
        title: 'Entry features in 3D',
        description:
          'The accordions display key features of the entry. Expanding each section provides more detail and links the feature directly to the 3D viewer. For example, clicking on “Ligands” will highlight the ligands in the 3D view. Clicking on one ligand will highlight and, then, focus the viewer on it.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#entry-navigation-tour',
      popover: {
        title: 'Entry navigation',
        description: 'Use the tabs to move through different sections of the entry and find more information.',
        side: 'bottom',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.summary, 'true', 365);
          this.showTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public modelQualityTabTourSteps: any = [
    {
      element: '#model-quality-data-side-tour',
      popover: {
        title: 'Model quality summary',
        description: 'Here you’ll find the key details about this structure, including authors, external databases links, and PDB model quality summary.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '#molstar-side-tour',
      popover: {
        title: 'Entry navigation',
        description: 'Use the tabs to move through different sections of the entry and find more information.',
        side: 'left',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.modelQuality, 'true', 365);
          options.driver.destroy();
        },
      },
    },
  ];

  public complexesTabTourSteps: any = [
    {
      element: '#complexes-content-tour',
      popover: {
        title: 'Complex details',
        description: 'View detailed information for a Complex, including PISA metrics, alongside its 3D structure.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#dashboard-stat-links-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#complexes-list-tour',
      popover: {
        title: 'Available complexes',
        description: 'Here you will see all complexes for this entry. If there’s more than one, switch between them to compare details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.assemblies, 'true', 365);
          options.driver.destroy();
        },
      },
    },
  ];

  public macromoleculeTabTourSteps: any = [
    {
      element: '#macromolecule-details-tour',
      popover: {
        title: 'Macromolecule details',
        description: 'View details about a macromolecule, including UniProt mappings, Gene names and GO terms, if available.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#deeper-analysis-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#annotations-viewer-tour',
      popover: {
        title: '3D and annotation viewers',
        description: 'Explore residue-mapped annotations for a macromolecule with the interactive viewers below.',
        side: 'top',
        align: 'center',
      },
    },
    {
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
          options.driver.destroy();
        },
      },
    },
  ];

  public ligandsTabTourSteps: any = [
    {
      element: '#ligands-detail-tour',
      popover: {
        title: 'Ligand details',
        description: 'View details about a ligand,  including its name and available synonyms, formula and molecular weight.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#ligand-deeper-analysis-tour',
      popover: {
        title: 'Deeper analysis',
        description: 'Go further with aggregated data, metrics, and resources in PDBe-KB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#ligand-interaction-tour',
      popover: {
        title: 'Ligand interactions linked to 3D',
        description: 'Explore the table with ligand–macromolecule contacts generated by PDBe Arpeggio. Hover over a row to highlight the interaction atoms in 3D.',
        side: 'top',
        align: 'center',
      },
    },
    {
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
          options.driver.destroy();
        },
      },
    },
  ];

  public domainTabTourSteps: any = [
    {
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
          options.driver.destroy();
        },
      },
    },
  ];

  public annotationsTabTourSteps: any = [
    {
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
      element: '#llm-list-tour',
      popover: {
        title: 'Available molecules with annotations',
        description: 'Here you will see all molecules that have text-mined annotations in this entry. If there’s more than one, switch between them to see details.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.llm, 'true', 365);
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
}
