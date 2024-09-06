import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { LigandsMainPageComponent } from '../main/main.component';
import { ClcPrdMainComponent } from '../clc-prd-main/clc-prd-main.component';

@Component({
  selector: 'pdbc-ligand-wrapper',
  standalone: true,
  imports: [LigandsMainPageComponent, ClcPrdMainComponent],
  templateUrl: './ligand-wrapper.component.html',
  styleUrl: './ligand-wrapper.component.sass',
})
export class LigandWrapperComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  public isMainLigandId = signal(true);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          if (ligandId.startsWith('CLC') || ligandId.startsWith('PRD')) {
            this.isMainLigandId.set(false);
          } else {
            this.isMainLigandId.set(true);
          }
          // this.ligandId = ligandId;
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
