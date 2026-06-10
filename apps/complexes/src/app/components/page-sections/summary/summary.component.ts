/* eslint-disable @typescript-eslint/no-explicit-any */

import { AfterViewInit, Component, computed, inject, linkedSignal, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ParticipantDirective } from '../../../directives/participants.directive';
import { ComplexSymmetryPipe } from '../../../pipes/symmetry.pipe';
import { Assembly, ComplexData, Participant } from '../../../models/complex-structure.model';
import { OEMCDirective } from '../../../directives/oemc.directive';
import { AssetPipe, MaterialModule } from '@pdbc/core';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { filter, map } from 'rxjs';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { MatDialog } from '@angular/material/dialog';
import { DiffSymmetryDialogComponent } from '../../section-components/diff-symmetry-dialog/diff-symmetry-dialog.component';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { complexSummaryTabTooltips, tourIds } from '../../../complex.constant';
import { ComplexPageTutorialTourService } from '../../../services/complex-page-tutorial-tour.service';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule, HelpIconWithTooltipComponent, MolstarComponent, MaterialModule, AssetPipe, ParticipantDirective, ComplexSymmetryPipe, OEMCDirective],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, AfterViewInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
  public ligands = toSignal(this.globalStore.select(ComplexSelectors.complexLigands));

  public readonly tutorialTourService = inject(ComplexPageTutorialTourService);

  private readonly utilService = inject(ComplexUtilService);
  private readonly dialog = inject(MatDialog);

  public iconPath = '';

  public config!: { moleculeId: string; bgColor: { r: number; g: number; b: number }; assemblyId: number; hideControls: boolean };

  public height = '400px';
  public width = '100%';

  public diffSymmetries = signal<Assembly[]>([]);

  public readonly complexSummaryTabTooltips = complexSummaryTabTooltips;

  public mappedLigands = linkedSignal({
    source: this.ligands,
    computation: () => {
      const filteredligands = this.ligands()?.filter((ligand) => ligand.annotations.includes('Cofactor-like'));
      return filteredligands;
    },
  });

  public summaryData = toSignal(
    this.globalStore.select(ComplexSelectors.complexData).pipe(
      filter(Boolean),
      map((data) => {
        this.checkForDifferentSymmetrySymbols(data);
        return {
          ...data,
          unique_observed_experimental_methods_with_counts: this.countPdbIdExperimentalMethod(data.assemblies),
        };
      })
    )
  );

  public participants = signal<Participant[]>(this.summaryData()?.participants.slice(0, 4) ?? []);
  public respresentStructure = computed(() => this.summaryData()?.representative_structure);
  public uniqueBoundMacromolecules = computed(() => this.summaryData()?.unique_bound_macromolecules?.join(', ') ?? '');
  public textIcon = signal<string>('more');
  public baseUrl = 'https://www.ebi.ac.uk/';

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.iconPath = document.location.hostname === 'localhost' ? '' : 'complexes/assets/images/help_outline_24px.svg';
    }
    this.config = {
      moleculeId: this.respresentStructure()?.pdb_id ?? '',
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: Number(this.respresentStructure()?.assembly_id),
      hideControls: true,
    };
  }

  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    const agreed = this.tutorialTourService.getCookie(tourIds.summary);
    if (agreed) {
      this.isBannerCookies.set(true);
    }
  }

  public startSummaryTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.summaryTabTourSteps);
  }

  private countPdbIdExperimentalMethod(data: Assembly[]) {
    const methodCounts = {} as any;

    data.forEach((entry) => {
      const { pdb_id, experimental_method } = entry;

      // Initialize the method in the counts object if not already done
      if (!methodCounts[experimental_method]) {
        methodCounts[experimental_method] = new Set();
      }

      // Add the pdb_id to the set for the method
      methodCounts[experimental_method].add(pdb_id);
    });

    // Convert sets to counts
    const result = {} as any;
    for (const method in methodCounts) {
      result[method] = methodCounts[method].size;
    }

    return result;
  }

  public viewMore(): void {
    if (this.textIcon() === 'less') {
      this.participants.update(() => this.summaryData()?.participants.slice(0, 4) ?? []);
      this.textIcon.set('more');
    } else {
      this.participants.update(() => this.summaryData()?.participants ?? []);
      this.textIcon.set('less');
    }
  }

  public openLigandPage(ligandId: string) {
    this.utilService.openLigandPage(ligandId);
  }

  private checkForDifferentSymmetrySymbols(data: ComplexData): void {
    const diffSymmetries = data.assemblies.reduce((acc: Assembly[], assembly: Assembly) => {
      if (assembly.symmetry.symbol !== data.symmetry.symbol) {
        acc.push(assembly);
      }
      return acc;
    }, [] as Assembly[]);

    this.diffSymmetries.update(() => diffSymmetries);
  }

  public openDiffSymmetryDialog(): void {
    this.dialog.open(DiffSymmetryDialogComponent, {
      disableClose: false,
      panelClass: 'bond-Dialog',
      data: {
        assemblies: this.diffSymmetries(),
      },
    });
  }
}
