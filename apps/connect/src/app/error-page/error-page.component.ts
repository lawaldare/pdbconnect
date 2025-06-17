/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, inject, input } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { pdbeLogoConfig } from '../projects/entry/entry-constant';
import { ActivatedRoute } from '@angular/router';
import { ErrorsList } from './error-list';
import { EntryUtilService, Error } from '../projects/entry/services/entry-util.service';
import { gsap } from 'gsap';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    // const split = new SplitText('.errormsg', { type: 'words' });
    // gsap
    //   .timeline({ defaults: { opacity: 0, ease: 'back' } })
    //   .from('h1', { y: -100, stagger: { each: 0.2 } })
    //   .from('h2', { scale: 0, duration: 1.5 })
    //   .from('p.errormsg', { y: 100, duration: 1.5 }, '<');
    // .from(split.words, { y: 50, duration: 1, stagger: 0.05, ease: 'back(4)' }, '<');
  }
}
