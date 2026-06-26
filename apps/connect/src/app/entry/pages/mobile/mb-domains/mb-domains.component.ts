import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, Optional, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DEFAULT_DOMAIN_HIGHLIGHT_COLOR, resourceUrls } from '../../../entry-constant';
import { Dropdown, makeEntityColors } from '../../../helpers/misc';
import { SnapshotSpec } from '../../../helpers/mvs-views/mvs-snapshot-types';
import { CommonDropdownOptionData, makeDomainChainDropdownOptions, makeSymmetryDropdownOptions } from '../../../helpers/processed-data-to-controls';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { ProcessedDomain } from '../../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileStateService } from '../mobile-state.service';

@Component({
  selector: 'pdbc-mb-domains',
  imports: [CommonModule, EntryDropdownComponent],
  templateUrl: './mb-domains.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-domains.component.scss'],
})
export class MbDomainsComponent implements OnInit {
  private readonly state = inject(MobileStateService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);

  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly processedDomainsObs$ = this.globalStore.select(EntrySelectors.processedDomains);
  public readonly processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.processedMacromolecules(), this.processedLigands()));

  public readonly resourceUrls = resourceUrls;

  public selectedDomain = signal<ProcessedDomain | undefined>(undefined);
  public currentViewState = computed<'list' | 'detail'>(() => (this.selectedDomain() ? 'detail' : 'list'));
  public expanded = signal<boolean>(false);

  public dropdown = new Dropdown<CommonDropdownOptionData>({
    autoOptions: () => makeDomainChainDropdownOptions(this.selectedDomain(), true),
  });

  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    autoOptions: () => makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
    defaultOption: (options) => options.find((opt) => opt.data.instanceId !== undefined) ?? options[0],
  });

  public readonly currentSelectionChainId = computed<string | undefined>(() => this.dropdown.selectedOption()?.data.authAsymId);
  private readonly selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);
  private readonly inPrefAssemblyForChain = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No macromolecule selected -> true (no warning to display)

  private readonly preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForChain() ? this.preferredAssemblyId() : undefined));

  public readonly domainTableRows = computed(() => this.processedDomains() ?? []);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbDomainsComponent>) {
    // Update MVS snapshot when needed
    effect(() => this.compCommunication.mvsSnapshotSpec$.next(this.mvsSnapshotSpec()));

    // Update global mobileIsPrefAssembly (for warning display)
    effect(() => this.compCommunication.mobileIsPrefAssembly.set(this.inPrefAssemblyForChain()));
  }

  ngOnInit(): void {
    // /* 1. Fetch data */
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getCathMapping,
      EntryActions.getPfamMapping,
      EntryActions.getScop175Mapping,
      EntryActions.getEntryPolymerCoverage,
      EntryActions.getEntryMolecules,
      EntryActions.getProcessedDomains,
    ]);
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public async closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.state.updateSelectedComponent(null);
    this.state.updateSelectedTabName('');
  }

  public navigateToDetail(data: ProcessedDomain) {
    this.selectedDomain.set(data);
    this.scrollTabToTop();
  }

  public async goBackToList() {
    this.selectedDomain.set(undefined);
    this.scrollTabToTop();
  }

  private scrollTabToTop() {
    const container = document.querySelector('.mat-bottom-sheet-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  public getDomainUrl(domain?: ProcessedDomain) {
    if (!domain) return '';
    if (domain.resource.includes('SCOP')) return resourceUrls[domain.resource];
    return resourceUrls[domain.resource] + domain.additionalData?.accession;
  }

  public anyNonPrefAssembly(domain: ProcessedDomain) {
    return domain.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true) === false;
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const domain = this.selectedDomain();
    if (!domain) {
      return {
        name: `Preferred complex`,
        kind: 'pdbconnect_complex',
        params: { entry: entryId, assemblyId: this.preferredAssemblyId(), entityColors: this.entityColors(), volumeStreaming: true },
      };
    }

    const assemblyId = this.displayedAssemblyId();
    const instanceId = this.selectedInstanceId();

    return {
      name: 'Domain',
      kind: 'pdbconnect_domains',
      params: {
        entry: entryId,
        assemblyId,
        domains: [
          {
            name: domain.additionalData.accession,
            color: DEFAULT_DOMAIN_HIGHLIGHT_COLOR,
            selector: domain.additionalData.boundaries.map(
              (segment) =>
                ({
                  auth_asym_id: segment.chain,
                  beg_label_seq_id: segment.start,
                  end_label_seq_id: segment.end,
                  instance_id: instanceId,
                }) satisfies ComponentExpressionT
            ),
          },
        ],
        focus: true,
        volumeStreaming: true,
      },
    };
  });
}
