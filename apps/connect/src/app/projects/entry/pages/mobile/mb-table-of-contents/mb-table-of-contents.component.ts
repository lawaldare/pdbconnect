import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from '@pdbc/core';
import { combineLatest, filter, map } from 'rxjs';

export interface NavigationLink {
  id: string;
  title: string;
}

@Component({
  selector: 'pdbc-mb-table-of-contents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-table-of-contents.component.html',
  styleUrl: './mb-table-of-contents.component.scss',
})
export class MbTableOfContentsComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly gAS = inject(GoogleAnalyticsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public tableTitle = input<string>('Table of contents');
  public gasEventToLog = input<string>('');
  public navigationLinks = input<NavigationLink[]>([]);
  public enableSectionId = input<boolean>(false);

  public currentNavigationLinkIdx = signal<number>(0);
  public currentNavigationLink = computed(() => {
    const navLinks = this.navigationLinks();
    if (!navLinks.length) {
      return undefined;
    }
    const idx = this.currentNavigationLinkIdx();
    return navLinks[idx];
  });

  public enableSectionIdObs$ = toObservable(this.enableSectionId);

  ngOnInit(): void {
    const sectionId$ = this.route.queryParams.pipe(
      map((params) => params['sectionId']),
      filter(Boolean)
    );

    combineLatest([sectionId$, this.enableSectionIdObs$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([_, isEnabled]) => isEnabled)
      )
      .subscribe(([sectionId, isEnabled]) => {
        if (isEnabled === false) return;
        queueMicrotask(() => {
          requestAnimationFrame(() => {
            const element = document.getElementById(sectionId);
            const toc = document.querySelector('.table-of-contents') as HTMLElement;
            if (element && toc) {
              const offsetTop = element.offsetTop;

              document.body.scrollTo({
                top: offsetTop - toc.offsetHeight,
                behavior: 'instant',
              });
            }
          });
        });
      });
  }

  ngAfterViewInit() {
    document.body.addEventListener('scroll', this.bodyScrollHandler, { passive: true });
  }

  ngOnDestroy() {
    document.body.removeEventListener('scroll', this.bodyScrollHandler);
  }

  private bodyScrollHandler = this.onScroll.bind(this);

  private onScroll() {
    this.navigationLinks().forEach((section, idx) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.currentNavigationLinkIdx.set(idx);
        }
      }
    });
  }

  public isFullLinksDisplayed = signal<boolean>(false);

  public toggleNavigationLinks(): void {
    this.isFullLinksDisplayed.update((value) => !value);
  }

  public scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.isFullLinksDisplayed.set(false);
    const element = document.getElementById(sectionId);
    const toc = document.querySelector('.table-of-contents') as HTMLElement;
    if (element && toc) {
      const offsetTop = element.offsetTop;
      document.body.scrollTo({ top: offsetTop - toc.offsetHeight, behavior: 'smooth' });
    }
    const gasEvent = this.gasEventToLog();
    if (gasEvent.length) {
      this.gAS.logPageEvents(gasEvent, {});
    }
  }
}
