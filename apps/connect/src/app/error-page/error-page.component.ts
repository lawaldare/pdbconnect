import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pdbeLogoConfig } from '../projects/entry/entry-constant';
import { ActivatedRoute } from '@angular/router';
import { ErrorsList } from './error-list';

export interface Error {
  title: string;
  message: string;
}

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  public readonly headerLogoMenuConfig = pdbeLogoConfig;
  private readonly route = inject(ActivatedRoute);
  public statusCode = signal<number>(404);
  private errorsList: Record<string, Error> = ErrorsList;
  public error = signal<Error>({} as Error);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const code = params['status'] ?? String(this.statusCode());
      this.statusCode.set(Number(code));
      const error = this.errorsList[code];
      this.error.set(error);
    });
  }
}
