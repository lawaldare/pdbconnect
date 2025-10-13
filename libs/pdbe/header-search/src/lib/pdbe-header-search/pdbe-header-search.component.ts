import { Component, inject, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataLayerService, GoogleAnalyticsService, HeaderSearchConfig, ThemeType, UtilService, ValueLabel } from '@pdbc/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pdbc-pdbe-header-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './pdbe-header-search.component.html',
  styleUrls: ['./pdbe-header-search.component.scss'],
})
export class PdbeHeaderSearchComponent implements OnInit {
  @Input() headerSearchConfig!: HeaderSearchConfig;
  public isOnComplexPage = input(false);
  searchTermStream = new Subject<string>();
  private fb = inject(FormBuilder);

  public buttonTheme!: string;
  public chipBg!: string;

  public form = this.fb.group({
    searchTerm: '',
  });

  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly utilService = inject(UtilService);

  ngOnInit() {
    this.buttonTheme = this.headerSearchConfig.type === ThemeType.PDBE ? 'pdbe' : 'pdbe-kb';
    this.chipBg = this.headerSearchConfig.type === ThemeType.PDBE ? 'pdbe-chip-bg' : 'pdbe-kb-chip-bg';

    this.form.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged(),
        filter(Boolean)
      )
      .subscribe((value) => {
        // console.log(value);
      });
  }

  public onSubmit(form: FormGroup): void {
    const value = form.value.searchTerm;
    this.utilService.redirectToSearchTerm(value);
  }

  public openID(ligandId: string): void {
    this.utilService.redirectToSearchTerm(ligandId);
    this.googleAnalyticsService.logClickEvents('example_click', 'Search Examples Links', 'navigate_to_example', ligandId);
  }

  public getExampleLabel(id: string | ValueLabel): string {
    return typeof id === 'string' ? id : id.label;
  }

  getExampleValue(id: string | ValueLabel): string {
    return typeof id === 'string' ? id : id.value;
  }
}
