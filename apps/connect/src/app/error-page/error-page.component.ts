/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pdbeLogoConfig } from '../projects/entry/entry-constant';
import { ActivatedRoute } from '@angular/router';
import { ErrorsList } from './error-list';
import { EntryUtilService, Error } from '../projects/entry/services/entry-util.service';
import { of, switchMap } from 'rxjs';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerComplexLogoMenuConfig, headerSearchComplexConfig } from '../projects/complex/complex.constant';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements OnInit {
  private readonly entryUtilService = inject(EntryUtilService);
  public readonly headerLogoMenuConfig = pdbeLogoConfig;
  public readonly headerSearchLogoMenuConfig = { ...headerComplexLogoMenuConfig, isComplexPage: true };
  public readonly headerSearchConfig = headerSearchComplexConfig;
  private readonly route = inject(ActivatedRoute);
  public statusCode = this.entryUtilService.errorStatusCode;
  private errorsList: Record<string, Error> = ErrorsList;
  public error = computed(() => this.errorsList[String(this.statusCode())]);

  public asPage = input<boolean>(true);

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
