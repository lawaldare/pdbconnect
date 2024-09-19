import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { headerComplexLogoMenuConfig, headerSearchComplexConfig, navComplexSections } from '../../../../ligands/ligand.constant';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { SummaryComponent } from '../../page-sections/summary/summary.component';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComplexStructuresComponent } from '../../page-sections/complex-structures/complex-structures.component';
import { ComplexData } from '../../../models/complex-structure.model';
import { TruncateTextDirective } from '@pdbc/core';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    SummaryComponent,
    ComplexStructuresComponent,
    TruncateTextDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public readonly headerLogoMenuConfig = headerComplexLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchComplexConfig;
  public readonly navSections = navComplexSections;

  private readonly complexAPIService = inject(ComplexAPIService);

  public summaryData!: ComplexData;
  public complexId = signal<string>('');

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.complexId.set(params['complexId'].toUpperCase());
          return this.complexAPIService.getSummaryForComplexData(this.complexId());
        }),
        catchError((error) => {
          console.error('Error fetching complex data:', error);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: ComplexData) => {
        this.summaryData = data;
      });
  }
}
