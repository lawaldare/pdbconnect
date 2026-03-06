/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements OnInit {
  // public readonly headerSearchLogoMenuConfig = { ...headerComplexLogoMenuConfig, isComplexPage: true };
  // public readonly headerSearchConfig = headerSearchComplexConfig;
  private readonly route = inject(ActivatedRoute);

  public isComplexPage = signal(false);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((query) => {
          this.isComplexPage.set(query['from'] === 'complex');
          return of(null);
        })
      )
      .subscribe();
  }
}
