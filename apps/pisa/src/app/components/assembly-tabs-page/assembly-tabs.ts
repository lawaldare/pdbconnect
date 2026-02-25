/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { DownloadFileTypeService, MaterialModule, ScrollPositionService } from '@pdbc/core';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { catchError, EMPTY, filter, mergeMap, of } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaActions } from '../../store/pisa.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ComplexesTabComponent } from '../complexes-tab/complexes-tab';
import { InterfacesTabComponent } from '../interfaces-tab/interfaces-tab';
import { MolstarPluginService } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pisa-assembly-tabs-page',
  imports: [CommonModule, MaterialModule, ComplexesTabComponent, InterfacesTabComponent],
  templateUrl: './assembly-tabs.html',
  styleUrl: './assembly-tabs.scss',
})
export class AssemblyTabsPageComponent implements OnInit {
  private pisaStore = inject(Store);
  private pisaUtilService = inject(PisaUtilService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly scrollService = inject(ScrollPositionService);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly molstarPluginService = inject(MolstarPluginService);

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));
  public readonly interfaceResponse = toSignal(this.pisaStore.select(PisaSelectors.interfaceResults).pipe(filter(Boolean)));

  public numberOfComplexes = linkedSignal({
    source: this.assemblyResponse,
    computation: () => {
      const assemblyResults = this.assemblyResponse();
      const sum = assemblyResults?.pqs_sets?.reduce((acc: number, curr: any) => acc + curr.complexes.length, 0);
      return sum;
    },
  });

  public numberOfInterfaces = linkedSignal({
    source: this.interfaceResponse,
    computation: () => {
      const interfaceResults = this.interfaceResponse();
      const sum = interfaceResults?.interface_types?.reduce((acc: number, curr: any) => acc + curr.interfaces.length, 0);
      return sum;
    },
  });

  public rowData = signal<any[]>([]);

  public fileDetails = signal<any>(this.pisaUtilService.getDataInSessionStorage('pisa-assembly-details'));

  private readonly pisaRouteTabs = [
    { label: 'Complexes', id: 'complexes' },
    { label: 'Interfaces', id: 'interfaces' },
  ];

  public selectedTab = signal<number>(0);
  public uploadFile = signal<boolean>(true);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const routeTabs = this.pisaRouteTabs;
      const tabName = params['activeTab'];
      this.pisaUtilService.updateCurrentTabName(tabName ?? 'complexes');
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
    });

    this.checkUploadStatus();
  }

  private checkUploadStatus(): void {
    const status = sessionStorage.getItem('uploadFile');
    if (status === 'true') {
      this.uploadFile.set(true);
    } else {
      this.uploadFile.set(false);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.molstarPluginService.loadPlugin();

    this.pisaStore
      .select(PisaSelectors.jobId)
      .pipe(
        mergeMap((jobId) => {
          if (!jobId) {
            console.error('No job ID available in store.');
            const payload = this.pisaUtilService.getDataInSessionStorage('pisa-assembly-payload');
            if (payload) {
              this.pisaStore.dispatch(PisaActions.submitPISAJob({ payload }));
            } else {
              console.error('No assembly payload found in session storage.');
              // this.onStartButtonClicked();
            }
          }
          // return this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean));
          return EMPTY;
        }),
        catchError((error) => {
          console.error('Error fetching assembly results:', error);
          return of(null);
        })
      )
      .subscribe((assemblyResults) => {
        // console.log('Assembly results received:', assemblyResults);
      });
  }

  private onStartButtonClicked(): void {
    const href = window.location.href;
    const hrefLink = href.split('/').slice(0, -1).join('/');
    window.open(hrefLink, '_self');
  }

  public selectTab(event: MatTabChangeEvent) {
    const routeTabs = this.pisaRouteTabs;
    const tabName = routeTabs[event.index].id;
    this.pisaUtilService.updateCurrentTabName(tabName ?? 'complexes');

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });

    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
  }

  public downloadComplexesCSV() {
    const gridApi = this.pisaUtilService.currentGridAPI();
    const mappedData: any[] = [];
    gridApi?.forEachNodeAfterFilter((node: any) => {
      mappedData.push({
        'Complex key': node.data.complex_instance_id ?? node.data.groupHeader,
        Formula: node.data.formula,
        Composition: node.data.composition,
        'Surface area, sq. Å': node.data.asa,
        'Buried area, sq. Å': node.data.bsa,
        'ΔGint, kcal/mol': node.data.int_energy,
        'ΔGdiss, kcal/mol': node.data.diss_energy,
        'Contains interfaces': node.data.interfaces?.map((element: any) => element.interface_id).join(', '),
      });
    });
    this.downloadFileTypeService.downloadCSV(mappedData, 'complexes.csv');
  }
  public downloadInterfacesCSV() {
    const gridApi = this.pisaUtilService.currentGridAPI();
    const mappedData: any[] = [];
    gridApi?.forEachNodeAfterFilter((node: any) => {
      mappedData.push({
        'Interface key': node.data.interfaceKey ?? node.data.groupHeader,
        'Structure 1\nchain': node.data.structureOneChain,
        'Structure 1\nN_atoms': node.data.structureOneNAtoms,
        'Structure 1\nN_residues': node.data.structureOneNResidues,
        'Structure 2\nchain': node.data.structureTwoChain,
        'Structure 2\nN_atoms': node.data.structureTwoNAtoms,
        'Structure 2\nN_residues': node.data.structureTwoNResidues,
        'Interfc.\narea': node.data.interfaceArea,
        'ΔG\nkcal/mol': node.data.interfaceEnergy,
        'ΔG\nP-value': node.data.pValue,
        CSS: node.data.css,
        'Found in\ncomplex': node.data.complexes,
      });
    });
    this.downloadFileTypeService.downloadCSV(mappedData, 'interfaces.csv');
  }

  public shareYourFeedBack(): void {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScRBLqVDS_PtMuJgeFGMffsJ3Sovj218IYhjLI3hpI-pStPiA/viewform', '_blank');
  }
}
