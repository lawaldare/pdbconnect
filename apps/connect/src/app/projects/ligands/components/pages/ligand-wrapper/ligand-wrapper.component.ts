import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { LigandsMainPageComponent } from '../main/main.component';
import { ClcPrdMainComponent } from '../clc-prd-main/clc-prd-main.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerLogoMenuConfig, headerSearchConfig } from '../../../ligand.constant';
import { BiodataActions } from '../../../../store/biodata.actions';
import { BiodataState } from '../../../../store/biodata.model';
import { Store } from '@ngrx/store';
import { NotificationComponent } from '@pdbc/notification';

@Component({
  selector: 'pdbc-ligand-wrapper',
  standalone: true,
  imports: [LigandsMainPageComponent, ClcPrdMainComponent, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, NotificationComponent],
  templateUrl: './ligand-wrapper.component.html',
  styleUrl: './ligand-wrapper.component.sass',
})
export class LigandWrapperComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<BiodataState>);

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
          this.globalStore.dispatch(BiodataActions.setCurrentLigandId({ ligandId }));
          this.globalStore.dispatch(BiodataActions.getStructures());
          this.globalStore.dispatch(BiodataActions.getSummary());
          this.globalStore.dispatch(BiodataActions.setDownloadOptions());
          this.globalStore.dispatch(BiodataActions.getRelatedLigands());
          this.globalStore.dispatch(BiodataActions.getSupercomponents());
          if (ligandId.startsWith('CLC') || ligandId.startsWith('PRD')) {
            this.isMainLigandId.set(false);
          } else {
            this.isMainLigandId.set(true);
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
