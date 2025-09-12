import { Injectable } from '@angular/core';
import { driver } from 'driver.js';

@Injectable({
  providedIn: 'root',
})
export class TutorialTourService {
  public startTour() {
    const basicTourSteps: any = [
      {
        element: '#structure-summary-tour',
        popover: {
          title: 'Structure summary',
          description: 'Here you’ll find the key details about this structure, including authors, external databases links, and PDB model quality summary.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#structure-overview-tour',
        popover: {
          title: '3D structure overview',
          description: 'The interactive 3D viewer lets you explore the structure directly on the page.',
          side: 'bottom',
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
          align: 'start',
        },
      },
      {
        element: '#entry-navigation-tour',
        popover: {
          title: 'Entry navigation',
          description: 'Use the tabs to move through different sections of the entry and find more information.',
          side: 'bottom',
          align: 'start',
        },
      },
    ];
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: basicTourSteps,
    });

    driverObj.drive();
  }
}
