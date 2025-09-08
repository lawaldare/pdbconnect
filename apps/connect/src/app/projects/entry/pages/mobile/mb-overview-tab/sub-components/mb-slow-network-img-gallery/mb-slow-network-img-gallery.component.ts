import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-mb-slow-network-image-gallery',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './mb-slow-network-img-gallery.component.html',
  styleUrls: ['./mb-slow-network-img-gallery.component.scss'],
})
export class MbSlowNetworkImageGalleryComponent implements OnInit {
  /** List of image URLs */
  @Input() images: string[] = [];

  /** Current index signal */
  public currentIndex = signal(0);

  /** Current img loading status */
  public isLoading = true;

  ngOnInit() {
    // When the first image starts loading
    if (this.images.length > 0) {
      this.isLoading = true;
    }
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError() {
    this.isLoading = false;
  }

  next() {
    if (this.images.length === 0) return;
    this.isLoading = true; // show spinner immediately
    this.currentIndex.update((i) => (i + 1) % this.images.length);
  }

  prev() {
    if (this.images.length === 0) return;
    this.isLoading = true; // show spinner immediately
    this.currentIndex.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  goTo(index: number) {
    this.isLoading = true; // show spinner immediately
    this.currentIndex.set(index);
  }
}
