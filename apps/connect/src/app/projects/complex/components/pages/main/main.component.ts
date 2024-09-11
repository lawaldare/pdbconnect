import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { headerLogoMenuConfig, headerSearchComplexConfig, navComplexSections } from '../../../../ligands/ligand.constant';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { SummaryComponent } from '../../page-sections/summary/summary.component';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, PdbeNavMenuComponent, SummaryComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchComplexConfig;
  public readonly navSections = navComplexSections;

  private readonly complexAPIService = inject(ComplexAPIService);

  public summaryData: any;
  public complexId = signal<string>('');

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.complexId.set(params['complexId'].toUpperCase());
          return this.complexAPIService.getSummaryForComplexData(this.complexId());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.summaryData = data['PDB-CPX-159519'];
      });
  }
}
