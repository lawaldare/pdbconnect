import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderSearchConfig, ThemeType } from '@pdbc/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pdbc-pdbe-header-search',
  standalone: true,
  imports: [CommonModule, PdbeButtonComponent, PdbeLinkButtonComponent, PdbeChipsComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './pdbe-header-search.component.html',
  styleUrls: ['./pdbe-header-search.component.scss'],
})
export class PdbeHeaderSearchComponent implements OnInit {
  @Input() headerSearchConfig!: HeaderSearchConfig;
  searchTermStream = new Subject<string>();

  public buttonTheme!: string;
  public chipBg!: string;

  public form = this.fb.group({
    searchTerm: '',
  });

  constructor(private fb: FormBuilder) {}

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
        console.log(value);
      });
  }

  public onSubmit(form: FormGroup): void {
    const value = form.value.searchTerm;
    console.log(value);
  }
}
