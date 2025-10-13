/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, ElementRef, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '@pdbc/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexSelectors } from '../../../../../store/complex.selectors';
import { ComplexStoreState } from '../../../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { PISAAssemblyParam } from '../../../../../models/pisa-assembly-param.model';

@Component({
  selector: 'pdbc-pisa-filter',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pisa-filter.component.html',
  styleUrl: './pisa-filter.component.scss',
})
export class PisaFilterComponent implements OnInit {
  public minResolutionBound = signal(0);
  public maxResolutionBound = signal(0);
  public minResolutionBoundValue = this.minResolutionBound();
  public maxResolutionBoundValue = this.maxResolutionBound();
  public methods = signal<string[]>([]);
  public selectedMethod = new FormControl('', { nonNullable: true });
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly pisa = toSignal(this.globalStore.select(ComplexSelectors.pisa));

  @ViewChild('minInputRef', { read: ElementRef }) public minInputRef!: ElementRef;
  @ViewChild('maxInputRef', { read: ElementRef }) public maxInputRef!: ElementRef;

  public sliderDisabled = signal(false);

  public filterChange = output<any>();

  ngOnInit(): void {
    setTimeout(() => {
      this.methods.set(this.getUniqueExperimentalMethods(this.pisa() ?? []));
      const { min, max } = this.getResolutionRange(this.pisa() ?? []);
      this.minResolutionBound.set(min);
      this.maxResolutionBound.set(max);
      this.minResolutionBoundValue = this.minResolutionBound();
      this.maxResolutionBoundValue = this.maxResolutionBound();
    }, 500);
  }

  private getUniqueExperimentalMethods(data: PISAAssemblyParam[]): string[] {
    return [...new Set(data.map((entry) => entry.experimental_method))];
  }

  private getResolutionRange(data: PISAAssemblyParam[]): { min: number; max: number } {
    const resolutions = data.map((entry) => +entry.resolution?.toFixed(2)).filter((r) => r != null && !isNaN(r));

    if (resolutions.length === 0) {
      return { min: 0, max: 0 };
    }
    const min = Math.min(...resolutions);
    const max = Math.max(...resolutions);
    return { min, max };
  }

  public applyFilters(): void {
    const method = this.selectedMethod.value;
    const minValue = this.minResolutionBoundValue;
    const maxValue = this.maxResolutionBoundValue;

    this.filterChange.emit({ method, minValue, maxValue });
  }

  public resetFilters(): void {
    this.selectedMethod.setValue('');
    this.minResolutionBoundValue = this.minResolutionBound();
    this.maxResolutionBoundValue = this.maxResolutionBound();
    this.sliderDisabled.set(false);
    this.minInputRef.nativeElement.disabled = false;
    this.maxInputRef.nativeElement.disabled = false;
    this.applyFilters();
  }

  public onMethodChange(value: string): void {
    if (value === 'Solution NMR') {
      this.minResolutionBoundValue = this.minResolutionBound();
      this.maxResolutionBoundValue = this.maxResolutionBound();
      this.sliderDisabled.set(true);
      this.minInputRef.nativeElement.disabled = true;
      this.maxInputRef.nativeElement.disabled = true;
    } else {
      this.sliderDisabled.set(false);
      this.minInputRef.nativeElement.disabled = false;
      this.maxInputRef.nativeElement.disabled = false;
    }
  }
}
