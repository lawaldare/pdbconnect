import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, AfterViewChecked, signal } from '@angular/core';
import { keyFeatureListslides } from '../corporate-page.constant';
declare const d3: any;
declare const gtag: any;

@Component({
  selector: 'pdbc-key-features-list',
  templateUrl: './key-features-list.component.html',
  styleUrls: ['./key-features-list.component.scss'],
  imports: [CommonModule],
})
export class KeyFeaturesListComponent implements OnInit {
  private readonly slides = keyFeatureListslides;

  private chunkSize = signal(3);
  public chunkIndex = signal(0);
  private maxChunk = signal(0);
  public currentChunks = signal<any[]>([]);
  private currentChunkIndex = signal<any[]>([]);
  public chunks = signal<any[]>([]);

  ngOnInit(): void {
    // window.addEventListener('resize', this.wrapper);
    if (window.innerWidth < 900) {
      this.chunkSize.set(2);
    }
    if (window.innerWidth < 540) {
      this.chunkSize.set(1);
    }
    this.buildCarousel();
  }

  @HostListener('window:resize', ['$event'])
  calcChunks(event: any) {
    this.chunkSize.set(3);
    if (window.innerWidth < 900) {
      this.chunkSize.set(2);
    }
    if (window.innerWidth < 540) {
      this.chunkSize.set(1);
    }
    this.buildCarousel();
  }

  // ngOnDestroy() {
  // window.removeEventListener('resize', this.calcChunks);
  // }

  buildChunks(to_chunk_array: any) {
    this.chunks.update(() => []);
    for (let i = 0; i < to_chunk_array.length; i += this.chunkSize()) {
      const chunk: any = to_chunk_array.slice(i, i + this.chunkSize());
      this.chunks().push(chunk);
    }
  }

  calculateFill(j: number) {
    if (j === this.chunkIndex()) {
      return '#085F5C';
    }
    return 'transparent';
  }

  calculateCircleX(j: number) {
    return 1.2 * (j + 1) + 'em';
  }

  getCurrentChunk() {
    this.currentChunks.update(() => []);
    for (const idx of this.currentChunkIndex()) {
      this.currentChunks().push(this.slides[idx]);
    }
  }

  buildCarousel() {
    this.buildChunks(this.slides);
    this.currentChunkIndex.update(() => Array.from(Array(this.chunkSize()).keys()));
    this.maxChunk.set(Math.ceil(this.slides.length / this.chunkSize()));
    this.getCurrentChunk();
  }

  updateCarousel(idx: number) {
    this.chunkIndex.update((index) => index + idx);

    if (this.chunkIndex() < 0) {
      this.chunkIndex.set(this.chunks().length - 1);
    }
    if (this.chunkIndex() > this.chunks().length - 1) {
      this.chunkIndex.set(0);
    }

    const slides_to_get = idx * this.chunkSize();
    this.currentChunkIndex.update((currentChunkIndex) =>
      currentChunkIndex.map((each_id) => {
        each_id += slides_to_get;
        if (each_id < 0) {
          each_id += this.slides.length;
        } else if (each_id > this.slides.length - 1) {
          each_id -= this.slides.length;
        }
        return each_id;
      })
    );
    this.getCurrentChunk();
  }
}
