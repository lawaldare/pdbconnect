import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaterialModule } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaSelectors } from '../../store/pisa.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pisa-single-interface-details-complex-tab',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './single-interface-details-complex-tab.html',
  styleUrl: './single-interface-details-complex-tab.scss',
})
export class SingleInterfaceDetailsComplexTabComponent implements OnInit {
  public readonly interface = signal<any | null>(null);
  public pisaUtilService = inject(PisaUtilService);
  private pisaStore = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.pisaStore
      .select(PisaSelectors.interfaceResultForInterfaceIdComplexesTab)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((interfaceResult) => {
        console.log('Received interface result:', interfaceResult);
        this.interface.set(interfaceResult);
      });
  }

  public downloadFiles() {
    this.pisaUtilService.generateInterfaceJSON(this.interface());
  }
}
