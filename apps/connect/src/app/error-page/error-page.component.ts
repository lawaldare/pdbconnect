/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pdbeLogoConfig } from '../entry/entry-constant';
import { ErrorsList } from './error-list';
import { EntryUtilService, Error } from '../entry/services/entry-util.service';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  private readonly entryUtilService = inject(EntryUtilService);
  public readonly headerLogoMenuConfig = pdbeLogoConfig;
  public statusCode = this.entryUtilService.errorStatusCode;
  private errorsList: Record<string, Error> = ErrorsList;
  public error = computed(() => this.errorsList[String(this.statusCode())]);

  public asPage = input<boolean>(true);
}
