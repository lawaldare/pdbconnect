import { inject, Injectable, signal } from '@angular/core';
import { driver } from 'driver.js';
import { LigandUtilService } from '../ligand-util.service';
import { tourIds } from '../ligand.constant';

@Injectable({
  providedIn: 'root',
})
export class LigandPageTutorialTourService {
  public readonly ligandUtilService = inject(LigandUtilService);

  public showDescriptionTourBanner = signal(true);
  public showPropertiesTourBanner = signal(true);
  public showStructuresTourBanner = signal(true);
  public showInteractionsTourBanner = signal(true);
  public showRelatedLigandsTourBanner = signal(true);

  public showHelpGuideModal = signal(false);

  // loaded data state for each tab
  public hasProperties = signal(true);
  public hasStructures = signal(true);
  public hasInteractions = signal(true);
  public hasRelatedLigands = signal(true);
  public hasStereoisomers = signal(true);

  public descriptionTabTourSteps: any = [
    {
      id: 'description',
      element: '#ligand-description-tour',
      popover: {
        title: 'Ligand description',
        description:
          'View key details about the ligand, including its name, synonyms, molecular formula, and chemical descriptors such as IUPAC, InChI, InChIKey, and SMILES.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'description',
      element: '#ligand-gallery-tour',
      popover: {
        title: 'Ligand 2D view',
        description: 'See the full structure, individual atoms, scaffold, and fragments.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'description',
      element: '#ligand-molstar-button-tour',
      popover: {
        title: 'Ligand 3D view',
        description: 'Interact with the structure in 3D to have a better look: rotate, zoom in, or select individual atoms, scaffolds, and fragments.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'description',
      element: '#ligand-properties-label-tour',
      popover: {
        title: 'Physicochemical Properties',
        description: 'View key features that describe a ligand’s size, structure, flexibility, functional groups, and chemical behavior.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'description',
      element: '#ligand-structures-label-tour',
      popover: {
        title: 'Bound structures',
        description:
          'Explore all proteins or PDB structures that directly bind to the ligand, with details such as protein name, source organism, EC number, and more.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'description',
      element: '#ligand-interactions-label-tour',
      popover: {
        title: 'Interaction Statistics',
        description:
          'Explore aggregated atom-level ligand–protein interactions across all PDB entries, visualised through interactive heatmaps and a 2D ligand view.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'description',
      element: '#ligand-related-label-tour',
      popover: {
        title: 'Related Ligands',
        description: 'View ligands structurally related to the current ligand, grouped by same scaffold, similarity, and stereochemistry for easier comparison.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'description',
      element: '#ligand-databases-label-tour',
      popover: {
        title: 'Ligand-specific databases',
        description: 'Access cross-references to other small-molecule data resources. Scroll through each database list to view all available links.',
        side: 'bottom',
        align: 'center',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.description, 'true', 365);
          this.showDescriptionTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public propertiesTabTourSteps: any = [
    {
      id: 'properties',
      element: '#molecular-properties-tour',
      popover: {
        title: 'Molecular properties',
        description: 'View key features describing ligand’s size, composition, polarity, and solubility.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'properties',
      element: '#conformational-properties-tour',
      popover: {
        title: 'Conformational properties',
        description: 'Explore the ligand flexibility, including the number of rotatable bonds.',
        side: 'top',
        align: 'center',
      },
    },
    {
      id: 'properties',
      element: '#ring-properties-tour',
      popover: {
        title: 'Ring properties',
        description: 'Understand a ligand’s structure and flexibility by examining its rings, helping predict stability and interactions.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'properties',
      element: '#surface-properties-tour',
      popover: {
        title: 'Surface properties',
        description: 'View the ligand’s surface characteristics, including topological polar surface area, which affects interactions and solubility.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'properties',
      element: '#functional-properties-tour',
      popover: {
        title: 'Functional group properties',
        description: 'Understand a ligand’s reactivity and binding by exploring ligand’s key chemical groups like hydrogen bond donors, acceptors, and amides.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'properties',
      element: '#stereochemical-properties-tour',
      popover: {
        title: 'Stereochemical properties',
        description: 'View the number of stereocenters, indicating chirality and 3D orientation which can affect biological activity and binding specificity.',
        side: 'top',
        align: 'center',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.properties, 'true', 365);
          this.showPropertiesTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public structuresTabTourSteps: any = [
    {
      id: 'structures',
      element: '#structures-groupby-tour',
      popover: {
        title: 'Proteins vs Structures view',
        description:
          'Switch between Proteins and Structures views. The Proteins view groups data by protein, showing the total number of PDB structures for a given protein, while the Structures view lists all individual PDB entries for detailed exploration.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      id: 'structures',
      element: '#protein-overview-tour',
      popover: {
        title: 'Protein Overview',
        description: 'Click on the protein accession link to view more about that given protein.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'structures',
      element: '#ligand-function-tour',
      popover: {
        title: 'Ligand function',
        description:
          'View the ligand’s functional role, classified as drug-like, cofactor-like, or reactant-like. Hover to see details on how the function is annotated.',
        side: 'left',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.structures, 'true', 365);
          this.showStructuresTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public interactionsTabTourSteps: any = [
    {
      id: 'interactions',
      element: '#ligand-2d-image-tour',
      popover: {
        title: 'Ligand 2D image',
        description:
          'View how frequently each ligand atom interacts across all protein–ligand complexes in the PDB. On the image, larger darker green circles indicate key interaction hotspots of the ligand. Hover or click on atoms to highlight the corresponding cells on the heatmap for a synchronized view.',
        side: 'left',
        align: 'start',
      },
    },
    {
      id: 'interactions',
      element: '#amino-heatmap-tour',
      popover: {
        title: 'Amino acid heatmap',
        description:
          'See how often each ligand atom interacts with specific protein residues. Darker cells represent more frequent interactions, helping identify which residue types the ligand binds to most often.',
        side: 'right',
        align: 'start',
      },
    },
    {
      id: 'interactions',
      element: '#heatmap-sort-filter-tour',
      popover: {
        title: 'Sort and filter interactions',
        description:
          'Sort the heatmap by Interactions to highlight the ligand’s key binding atoms, or by Amino Acid Properties to explore the types of amino acids involved in binding. Filter the view by different interaction types to update the heatmap and 2D view accordingly.',
        side: 'right',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.interactions, 'true', 365);
          this.showInteractionsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public relatedLigandsTabTourSteps: any = [
    {
      id: 'related-ligands',
      element: '#same-scaffold-tour',
      popover: {
        title: 'Same scaffold',
        description:
          'These ligands share the same scaffold. Click on ligand image to open its 3D view. Hover over the ligand ID to see its full name, and click the PDB entry link to view all structures this ligand binds to.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'related-ligands',
      element: '#similar-ligands-tour',
      popover: {
        title: 'Similar ligands',
        description: 'These ligands have ≥60% structural similarity based on the PARITY method.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'related-ligands',
      element: '#stereoisomers-tour',
      popover: {
        title: 'Stereoisomers',
        description: 'These ligands are stereoisomers.',
        side: 'top',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.ligands, 'true', 365);
          this.showRelatedLigandsTourBanner.set(false);
          options.driver.destroy();
        },
      },
    },
  ];

  public relatedLigandsTabTourStepsWithoutStereoisomers: any = [
    {
      id: 'related-ligands',
      element: '#same-scaffold-tour',
      popover: {
        title: 'Same scaffold',
        description:
          'These ligands share the same scaffold. Click on ligand image to open its 3D view. Hover over the ligand ID to see its full name, and click the PDB entry link to view all structures this ligand binds to.',
        side: 'top',
        align: 'start',
      },
    },
    {
      id: 'related-ligands',
      element: '#similar-ligands-tour',
      popover: {
        title: 'Similar ligands',
        description: 'These ligands have ≥60% structural similarity based on the PARITY method.',
        side: 'top',
        align: 'start',
        doneBtnText: 'Finish',
        onNextClick: (el: any, step: any, options: any) => {
          this.setCookie(tourIds.ligands, 'true', 365);
          this.showRelatedLigandsTourBanner.set(false);
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
      case 'description':
        this.setCookie(tourIds.description, 'true', 365);
        break;
      case 'structures':
        this.setCookie(tourIds.structures, 'true', 365);
        break;
      case 'properties':
        this.setCookie(tourIds.properties, 'true', 365);
        break;
      case 'interactions':
        this.setCookie(tourIds.interactions, 'true', 365);
        break;
      case 'ligands':
        this.setCookie(tourIds.ligands, 'true', 365);
        break;
      default:
        console.error('No tour steps found for this tab');
        break;
    }
  }

  public startTourFromHelp() {
    const currentTabName = this.ligandUtilService.currentligandTabName();
    switch (currentTabName) {
      case 'description':
        this.startTour(this.descriptionTabTourSteps);
        break;
      case 'structures':
        if (this.hasStructures()) {
          this.startTour(this.structuresTabTourSteps);
        }
        break;
      case 'properties':
        if (this.hasProperties()) {
          this.startTour(this.propertiesTabTourSteps);
        }
        break;
      case 'interactions':
        if (this.hasInteractions()) {
          this.startTour(this.interactionsTabTourSteps);
        }
        break;
      case 'related-ligands':
        if (this.hasRelatedLigands()) {
          this.startTour(this.hasStereoisomers() ? this.relatedLigandsTabTourSteps : this.relatedLigandsTabTourStepsWithoutStereoisomers);
        }
        break;
      default:
        console.error('No tour steps found for this tab');
        break;
    }

    this.showHelpGuideModal.set(false);
  }
}
