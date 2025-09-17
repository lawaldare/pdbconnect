import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { LigandsMainPageComponent } from '../main/main.component';
import { ClcPrdMainComponent } from '../clc-prd-main/clc-prd-main.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { clcNavSections, headerLogoMenuConfig, headerSearchConfig, navSections } from '../../../ligand.constant';
import { LigandActions } from '../../../store/ligand.actions';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { NotificationComponent } from '@pdbc/notification';
import { DataPrivacyBannerComponent } from '@pdbc/core';

@Component({
  selector: 'pdbc-ligand-wrapper',
  standalone: true,
  imports: [LigandsMainPageComponent, ClcPrdMainComponent, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, NotificationComponent, DataPrivacyBannerComponent],
  templateUrl: './ligand-wrapper.component.html',
  styleUrl: './ligand-wrapper.component.scss',
})
export class LigandWrapperComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public isMainLigandId = signal(true);
  public showNotificationBanner = signal<boolean>(false);

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;

  ngOnInit(): void {
    this.showNotification();
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          this.globalStore.dispatch(LigandActions.setCurrentLigandId({ ligandId }));
          this.globalStore.dispatch(LigandActions.getStructures());
          this.globalStore.dispatch(LigandActions.getPolymers());
          this.globalStore.dispatch(LigandActions.getSummary());
          this.globalStore.dispatch(LigandActions.setDownloadOptions());
          this.globalStore.dispatch(LigandActions.getRelatedLigands());
          this.globalStore.dispatch(LigandActions.getSupercomponents());
          if (ligandId.startsWith('CLC') || ligandId.startsWith('PRD')) {
            this.isMainLigandId.set(false);
            this.globalStore.dispatch(LigandActions.setNavItems({ navItems: clcNavSections }));
          } else {
            this.isMainLigandId.set(true);
            this.globalStore.dispatch(LigandActions.setNavItems({ navItems: navSections }));
          }
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private showNotification() {
    const href = document.location.href;
    if (href.includes('dev.') || href.includes('wwwdev.')) {
      this.showNotificationBanner.set(true);
    } else {
      this.showNotificationBanner.set(false);
    }
  }
}
