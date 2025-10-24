import { inject, Injectable, signal } from '@angular/core';
import { driver } from 'driver.js';
import { tourIds } from '../complex.constant';
import { ComplexUtilService } from './complex-util.service';

@Injectable({
  providedIn: 'root',
})
export class ComplexPageTutorialTourService {
  public readonly complexUtilService = inject(ComplexUtilService);
  public showSummaryTourBanner = signal(true);
  public showStructuresTourBanner = signal(true);
  public showPISATourBanner = signal(true);
  public showLigandsTourBanner = signal(true);
  public showSubcomplexesTourBanner = signal(true);
  public showSupercomplexesTourBanner = signal(true);

  public showHelpGuideModal = signal(false);

  // loaded data state for each tab
  public hasStructures = signal(true);
  public hasPisaData = signal(true);
  public hasLigands = signal(true);
  public hasSubcomplexes = signal(true);
  public hasSupercomplexes = signal(true);

  public summaryTabTourSteps: any = [
    {
      id: 'summary',
      element: '#summary-label-tour',
      popover: {
        title: 'Summary',
        description:
          'View essential information about this complex, including its components, oligomeric state, symmetry, and experimental methods used to determine its structure.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#structures-label-tour',
      popover: {
        title: 'Structures',
        description: 'Explore all experimentally determined assemblies representing this complex.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#pisa-label-tour',
      popover: {
        title: 'PISA',
        description:
          'This section lists assembly properties predicted by PISA for all instances of this complex, including surface area, solvation energy, and estimated stability.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#ligands-label-tour',
      popover: {
        title: 'Ligands',
        description: 'View all unique ligands observed bound directly to assemblies representing this complex in the PDB.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#subcomplexes-label-tour',
      popover: {
        title: 'Subcomplexes',
        description: 'This section lists all subcomplexes that contain a subset of the components found in this complex.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#supercomplexes-label-tour',
      popover: {
        title: 'Supercomplexes',
        description: 'This section lists all supercomplexes that include this complex along with additional components.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'summary',
      element: '#citations-label-tour',
      popover: {
        title: 'Citations',
        description: 'This section lists publications associated with the structures representing this complex, providing links to the corresponding articles.',
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
  ];

  public structuresTabTourSteps: any = [
    {
      id: 'structures',
      element: '#structure-table-tour',
      popover: {
        title: 'Browse and visualise assemblies in Mol*',
        description:
          'Each row in the table represents a PDB assembly. Selecting a row loads the corresponding assembly in the 3D viewer. You can also click on the column headers to sort or search the table by specific keywords.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'structures',
      element: '#structure-bound-filters-tour',
      popover: {
        title: 'Filter assemblies by bound macromolecules',
        description: 'Use the dropdown filter to show assemblies containing specific bound macromolecules.',
        side: 'top',
        align: 'end',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.structures, 'true', 365);
          this.showStructuresTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public pisaTabTourSteps: any = [
    {
      id: 'pisa',
      element: '#pisa-table-tour',
      popover: {
        title: 'Filter and compare assemblies',
        description:
          'Select a resolution range and/or experimental method, then click “Apply” to view filtered results. Each row represents a PDB assembly with its calculated PISA parameters.',
        side: 'top',
        align: 'center',
      },
    },
    {
      id: 'pisa',
      element: '#pisa-charts-tour',
      popover: {
        title: 'Analyse value ranges and distributions',
        description: 'The sliders and histograms show how each PISA property varies across assemblies. Use them to compare values and identify outliers or trends.',
        side: 'bottom',
        align: 'center',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.pisa, 'true', 365);
          this.showPISATourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public ligandsTabTourSteps: any = [
    {
      id: 'ligands',
      element: '#ligands-search-tour',
      popover: {
        title: 'Find ligands',
        description: 'Use the search bar to find ligands by name or ID.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'ligands',
      element: '#ligands-sort-tour',
      popover: {
        title: 'Organise ligands',
        description: 'Sort the list by functional type or frequency bound in PDB entries.',
        side: 'top',
        align: 'end',
      },
    },
    {
      id: 'ligands',
      element: '#ligands-list-tour',
      popover: {
        title: ' View ligand information',
        description: 'Each ligand card shows its chemical structure, functional type, and the number of PDB entries in which it is bound to this complex.',
        side: 'top',
        align: 'center',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.ligands, 'true', 365);
          this.showLigandsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public subcomplexesTabTourSteps: any = [
    {
      id: 'subcomplexes',
      element: '#subcomplexes-search-tour',
      popover: {
        title: 'Find subcomplexes',
        description: 'Use the search bar to find subcomplexes by component name or accession.',
        side: 'right',
        align: 'center',
      },
    },
    {
      id: 'subcomplexes',
      element: '#subcomplexes-table-tour',
      popover: {
        title: 'Compare subcomplexes',
        description: 'Selecting a row loads the corresponding subcomplex for structural comparison.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'subcomplexes',
      element: '#molstar-container',
      popover: {
        title: 'Visualise structural superpositions',
        description:
          'The Mol* viewer shows a superposition of the selected subcomplex with the current complex. Shared components are colored by entity, while the rest are in grey.',
        side: 'left',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.subcomplexes, 'true', 365);
          this.showSubcomplexesTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public supercomplexesTabTourSteps: any = [
    {
      id: 'supercomplexes',
      element: '#supercomplexes-search-tour',
      popover: {
        title: 'Find supercomplexes',
        description: 'Use the search bar to locate supercomplexes by component name or accession.',
        side: 'right',
        align: 'center',
      },
    },
    {
      id: 'supercomplexes',
      element: '#supercomplexes-table-tour',
      popover: {
        title: 'Compare supercomplexes',
        description: 'Selecting a row loads the corresponding supercomplex for structural comparison.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'supercomplexes',
      element: '#molstar-container',
      popover: {
        title: 'Visualise structural superpositions',
        description:
          'The Mol* viewer shows a superposition of the selected supercomplex with the current complex. Shared components appear in grey, while additional components are coloured by entity.',
        side: 'left',
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
      case 'structures':
        this.setCookie(tourIds.structures, 'true', 365);
        break;
      case 'pisa':
        this.setCookie(tourIds.pisa, 'true', 365);
        break;
      case 'ligands':
        this.setCookie(tourIds.ligands, 'true', 365);
        break;
      case 'subcomplexes':
        this.setCookie(tourIds.subcomplexes, 'true', 365);
        break;
      case 'supercomplexes':
        this.setCookie(tourIds.supercomplexes, 'true', 365);
        break;
      default:
        console.log('No tour steps found for this tab');
        break;
    }
  }

  public startTourFromHelp() {
    const currentTabName = this.complexUtilService.currentComplexTabName();
    switch (currentTabName) {
      case 'summary':
        this.startTour(this.summaryTabTourSteps);
        break;
      case 'structures':
        if (this.hasStructures()) {
          this.startTour(this.structuresTabTourSteps);
        }
        break;
      case 'pisa':
        if (this.hasPisaData()) {
          this.startTour(this.pisaTabTourSteps);
        }
        break;
      case 'ligands':
        if (this.hasLigands()) {
          this.startTour(this.ligandsTabTourSteps);
        }
        break;
      case 'subcomplexes':
        if (this.hasSubcomplexes()) {
          this.startTour(this.subcomplexesTabTourSteps);
        }
        break;
      case 'supercomplexes':
        if (this.hasSupercomplexes()) {
          this.startTour(this.supercomplexesTabTourSteps);
        }
        break;
      default:
        console.log('No tour steps found for this tab');
        break;
    }

    this.showHelpGuideModal.set(false);
  }
}
