import { Component, DestroyRef, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { SummaryComponent } from '../../page-sections/summary/summary.component';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexStructuresComponent } from '../../page-sections/complex-structures/complex-structures.component';
import { TruncateTextDirective } from '@pdbc/core';
import { headerComplexLogoMenuConfig, headerSearchComplexConfig, navComplexSections } from '../../../complex.constant';
import { ComplexInteractionsComponent } from '../../page-sections/complex-interactions/complex-interactions.component';
import { ComplexPublicationsComponent } from '../../page-sections/complex-publications/complex-publications.component';
import { ComplexLigandsComponent } from '../../page-sections/complex-ligands/complex-ligands.component';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexActions } from '../../../store/complex.actions';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { LoadingState } from '../../../../ligands/enums/loading-state.enum';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ComplexBioschemasService } from '../../../services/complex.bioschemas';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    SummaryComponent,
    ComplexStructuresComponent,
    TruncateTextDirective,
    ComplexInteractionsComponent,
    ComplexPublicationsComponent,
    ComplexLigandsComponent,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bioschemasService = inject(ComplexBioschemasService);
  private readonly renderer = inject(Renderer2);

  public readonly headerLogoMenuConfig = headerComplexLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchComplexConfig;
  private readonly navSectionsInit = navComplexSections;

  private readonly globalStore = inject(Store<ComplexStoreState>);

  public summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  public complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
  public loaded = toSignal(this.globalStore.select(ComplexSelectors.loadingState));
  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  public readonly status = LoadingState;

  ngOnInit(): void {
    this.globalStore.dispatch(ComplexActions.setNavItems({ navItems: this.navSectionsInit }));
    this.route.params
      .pipe(
        switchMap((params) => {
          const complexId = params['complexId'].toUpperCase();
          this.globalStore.dispatch(ComplexActions.setCurrentComplexId({ complexId }));
          this.globalStore.dispatch(ComplexActions.getComplexData());
          this.globalStore.dispatch(ComplexActions.getLigandsForComplexes());
          this.globalStore.dispatch(ComplexActions.getComplexInteractions());
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.bioschemasService.buildBioschemasJSON(this.renderer);
      });
  }
}
