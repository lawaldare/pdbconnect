import { Component, computed, DestroyRef, HostListener, inject, Renderer2, signal, OnInit } from '@angular/core';
import { Molstar370DefaultParams } from '../../helpers/molstar-helpers';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryMainFacade } from '../main/entry-main.facade';
import { CommonModule } from '@angular/common';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { EMPTY, filter, map, mergeMap, switchMap } from 'rxjs';
import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { EntryActions } from '../../store/entry.actions';
import { ActivatedRoute } from '@angular/router';
import { MetaTagService } from '../../services/meta-tag.service';
import { EntryBioschemasService } from '../../services/entry.bioschemas';
@Component({
  selector: 'pdbc-3d',
  standalone: true,
  imports: [CommonModule, MolstarComponent],
  templateUrl: './molstar-3d.component.html',
  styleUrls: ['./molstar-3d.component.scss'],
})
export class Entry3DPageComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = signal<string>('');
  public readonly assemblyId = signal<string | undefined>(undefined);

  public showStatusMessage = signal<boolean>(false);
  public entryStatus = signal<string>('');
  public hasClosedMessage = signal<boolean>(false);

  private readonly facade = inject(EntryMainFacade);

  private readonly route = inject(ActivatedRoute);
  // private readonly metaTagService = inject(MetaTagService);
  private readonly destroyRef = inject(DestroyRef);
  // private readonly entryBioschemasService = inject(EntryBioschemasService);
  // private readonly renderer = inject(Renderer2);

  public readonly configForMolstar = computed(() => {
    const entryId = this.entryId();
    const assemblyId = this.assemblyId();
    const isDesktop = this.facade.isDesktop();

    if (!entryId) return undefined;

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: entryId,
      assemblyId,
      loadMaps: true,
      landscape: isDesktop ? true : false,
      sequencePanel: true,
      expanded: true,
      hideCanvasControls: ['expand'],
      validationAnnotation: true,
      domainAnnotation: true,
      symmetryAnnotation: true,
    };

    return configForMolstar;
  });

  constructor() {
    this.facade.checkWindowWidth();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase().replace('pdb_0000', '');
          this.entryId.set(entryId);
          const rest = params['rest'];
          if (rest) {
            const decoded = decodeURIComponent(rest); // "&assembly=1"

            const match = decoded.match(/assembly=([0-9]+)/);
            if (match) {
              this.assemblyId.set(match[1]);
            }
          }
          this.globalStore.dispatch(EntryActions.setCurrentEntryId({ entryId }));
          this.globalStore.dispatch(EntryActions.getEntryStatus());
          return this.globalStore.select(EntrySelectors.entryStatus).pipe(
            filter(Boolean),
            map((response: EntryStatus) => response.status_code)
          );
        }),
        mergeMap(async (status: StatusCode) => {
          if (status !== 'INITIAL') {
            // redirect to status pages after 5 seconds
            this.showStatusMessage.set(true);
            this.entryStatus.set(status);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event): void {
    this.facade.checkWindowWidth();
  }
}
