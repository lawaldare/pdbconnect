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

  /** Images loading status */
  private loadedStates: boolean[] = [];

  ngOnInit() {
    // When the first image starts loading
    this.loadedStates = this.images.map(() => false);
  }

  isImageLoaded(index: number): boolean {
    return this.loadedStates[index];
  }

  onImageLoad(index: number) {
    this.loadedStates[index] = true;
  }

  onImageError(index: number) {
    this.loadedStates[index] = true;
  }

  next() {
    if (this.images.length === 0) return;
    this.currentIndex.update((i) => (i + 1) % this.images.length);
  }

  prev() {
    if (this.images.length === 0) return;
    this.currentIndex.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }
}
