import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pdbeLogoConfig } from '../projects/entry/entry-constant';
import { ActivatedRoute } from '@angular/router';
import { ErrorsList } from './error-list';
import { EntryUtilService, Error } from '../projects/entry/services/entry-util.service';

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
  private readonly route = inject(ActivatedRoute);
  public statusCode = this.entryUtilService.errorStatusCode;
  private errorsList: Record<string, Error> = ErrorsList;
  // public error = signal<Error>({} as Error);
  public error = computed(() => this.errorsList[String(this.statusCode())]);

  public asPage = input<boolean>(true);

  constructor() {
    // this.route.queryParams.subscribe((params) => {
    //   const code = params['status'] ?? String(this.statusCode());
    //   this.statusCode.set(Number(code));
    //   const error = this.errorsList[code];
    //   this.error.set(error);
    // });
  }
}
