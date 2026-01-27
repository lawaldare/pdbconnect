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
  selector: 'pisa-single-interface-details-interface-tab',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './single-interface-details-interface-tab.html',
  styleUrl: './single-interface-details-interface-tab.scss',
})
export class SingleInterfaceDetailsInterfaceTabComponent implements OnInit {
  public readonly interface = signal<any | null>(null);
  public pisaUtilService = inject(PisaUtilService);
  private pisaStore = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.pisaStore
      .select(PisaSelectors.interfaceResultForInterfaceIdInterfacesTab)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((interfaceResult) => {
        this.interface.set(interfaceResult);
      });
  }

  public downloadFiles() {
    this.pisaUtilService.generateInterfaceJSON(this.interface());
  }
}
