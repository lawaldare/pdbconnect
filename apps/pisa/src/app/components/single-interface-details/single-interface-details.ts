import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pisa-single-interface-details',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './single-interface-details.html',
  styleUrl: './single-interface-details.scss',
})
export class SingleInterfaceDetailsComponent {
  public interface = input.required<any | null>();
}
