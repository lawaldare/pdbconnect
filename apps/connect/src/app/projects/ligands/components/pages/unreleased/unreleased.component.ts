import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerLogoMenuConfig, headerSearchConfig } from '../../../ligand.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'pdbc-unreleased',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  templateUrl: './unreleased.component.html',
  styleUrl: './unreleased.component.scss',
})
export class UnreleasedComponent implements OnInit {
  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public readonly unreleasedText = signal('');

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const ligandId = params['ligandId'].toUpperCase();
          this.unreleasedText.set(`This ligand, ${ligandId}, is currently not released.`);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
