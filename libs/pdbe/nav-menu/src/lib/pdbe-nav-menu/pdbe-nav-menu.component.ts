import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // <-- do not forget to import
import { delay } from 'rxjs';
import { UtilService } from '@pdbc/core';

@Component({
  selector: 'pdbc-pdbe-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pdbe-nav-menu.component.html',
  styleUrls: ['./pdbe-nav-menu.component.scss'],
})
export class PdbeNavMenuComponent implements OnInit {
  @Input() highlightColor = '';
  @Input() navSections: {
    sectionId: string;
    sectionName: string;
    isSubSection: boolean;
  }[] = [];
  @Input() verticalStickyElementId?: string;

  private readonly UtilService = inject(UtilService);
  private readonly route = inject(ActivatedRoute);

  // sectionId of navSection that current active on nav component (bold and with background)
  public currentlyActive = this.UtilService.currentlyActive;
  public previouslyActive?: string;

  // sectionId of navSection that current active on nav component (bold and with background)
  public clickedActive?: string;

  ngOnInit() {
    // if page route contains anchor navigation, trigger scrolling to it
    this.route.fragment.pipe(delay(1000)).subscribe((fragment) => {
      if (fragment) this.clickedScrollTo(fragment);
    });

    // On component init we check if page is loaded and create a createScrollObserver

    /**
     * readyState and DOMContentLoaded used despite breaking angular pattern
     * so does not have to be configured for each page and logic can be responsability
     * of this library component
     */
    // const thisAngularElement = this;
    if (document.readyState !== 'loading') {
      this.createScrollObserver();
    }
    document.addEventListener(
      'DOMContentLoaded',
      (_e) => {
        this.createScrollObserver();
      },
      false
    );
  }

  /**
   * Function taken from:
   * https://stackoverflow.com/a/22480938
   * Checks whether a given element is within the viewport of a page
   * supports a single sticky vertical element for determining visibility
   * @param el
   * @returns
   */
  isScrolledIntoView(el: Element) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    let minVisible = 0;

    // if sticky element exists, take that into account to determine whether element is visible
    // on vertical scroll
    if (this.verticalStickyElementId) {
      const stickyElement = document.getElementById(this.verticalStickyElementId);
      if (stickyElement) {
        minVisible = stickyElement.getBoundingClientRect().bottom;
      }
    }

    // Only completely visible elements return true:
    // const isVisible = elemTop >= minVisible && elemBottom <= window.innerHeight;
    const isTopVisible = elemTop >= minVisible && elemTop <= window.innerHeight;
    // const isBottomVisible = elemBottom >= minVisible && elemBottom <= window.innerHeight;
    const isinScroll = elemTop >= 0 && elemBottom <= window.innerHeight;

    let overlapRank = undefined;
    const y0 = minVisible;
    const y1 = window.innerHeight;

    const o0 = elemTop;
    const o1 = elemBottom;
    if (y0 >= o0 && y1 <= o1) {
      overlapRank = 1;
    } else if (y0 <= o0 && y1 >= o1) {
      overlapRank = 2;
    } else if (y0 > o0 || y1 < o1) {
      overlapRank = 3;
    }

    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;

    return { isTopVisible: isTopVisible, overlapRank: overlapRank, withinScroll: isinScroll };
  }

  /**
   * Initializes a scroll observer to track which sections are currently in view.
   * This observer updates the currently active section based on scroll position.
   */
  createScrollObserver() {
    // Array to hold all section IDs from navSections
    const allSectionIds = [];

    // Extract all section IDs from navSections and nested navSubSections
    for (const navSection of this.navSections) {
      const eleAndChildIds = [navSection.sectionId];
      allSectionIds.push(...eleAndChildIds);
    }

    /**
     * Callback function to check which sections are in view during scrolling.
     *
     * @param {Event} _e - The scroll event.
     */
    const checkScrolledIntoView = (_e: Event) => {
      // If scrolling was initiated by a click, do nothing
      if (this.clickedActive) return;

      // Arrays to keep track of currently visible sections
      const activeList = [];
      let idsRanks = [];

      // Get list of section IDs to monitor
      const elementIdList = this.navSections.map((navSection) => navSection.sectionId);

      // Check visibility for each section element
      for (const eachSectionId of elementIdList) {
        const sectionElement = document.getElementById(eachSectionId);

        // Skip if the element does not exist in the DOM
        if (!sectionElement) continue;

        // Check if the section element is in view
        const visibilityCheckObj = this.isScrolledIntoView(sectionElement);
        const sectionElementTopVisibility = visibilityCheckObj.isTopVisible;
        if (visibilityCheckObj.overlapRank) {
          idsRanks.push({
            id: eachSectionId,
            rank: visibilityCheckObj.overlapRank,
          });
        }
        if (sectionElementTopVisibility) activeList.push(eachSectionId);
      }

      idsRanks = idsRanks.sort((a, b) => a.rank - b.rank);

      // If no sections are currently in view, maintain the current state
      if (activeList.length === 0) return;

      // Determine scroll direction to update active section (https://stackoverflow.com/a/31223774)
      let lastScrollTop = 0;
      const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      if (st > lastScrollTop) {
        // Scrolling down: set the first visible section as active
        // this.currentlyActive = activeList[0];
        this.UtilService.setCurrentActive(activeList[0]);
      } else if (st < lastScrollTop) {
        // Scrolling up: set the last visible section as active
        // this.currentlyActive = activeList[activeList.length - 1];
        this.UtilService.setCurrentActive(activeList[activeList.length - 1]);
      }
      // Update the last known scroll position (prevent negative values e.g Mobile)
      lastScrollTop = st <= 0 ? 0 : st;

      // Update previously active section
      this.previouslyActive = this.currentlyActive + '';
    };

    // Attach scroll event listener to the document
    document.addEventListener('scroll', checkScrolledIntoView, false);
  }

  /**
   * Function to trigger smooth scrolling to a given page element by clicking the nav menu
   * @param elementId element id to scroll to
   */
  clickedScrollTo(elementId: string) {
    // For keeping clicked element active while scrolling
    this.clickedActive = elementId;
    this.scrollTo(elementId);
  }

  /**
   * Function to trigger smooth scrolling to a given page element
   * @param elementId element id to scroll to
   */
  scrollTo(elementId: string) {
    // this.currentlyActive = elementId;
    this.UtilService.setCurrentActive(elementId);
    const element = document.getElementById(elementId);
    // element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.smoothScroll(element!, 500);

    // unfocus document element before scrolling
    (<HTMLElement>document.activeElement)?.blur();

    // Necessary so clicked element remains active while scrollIntoView is scrolling
    let scrollTimeout: string | number | any | undefined;
    const onScrollEnd = (_e: Event) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.clickedActive = undefined;
        document.removeEventListener('scroll', onScrollEnd);
      }, 100);
    };
    document.addEventListener('scroll', onScrollEnd);
  }

  /**
   * Smoothly scrolls the window to a target element over a specified duration.
   *
   * @param {HTMLElement} target - The target element to scroll to.
   * @param {number} duration - The duration of the scroll animation in milliseconds.
   */
  smoothScroll(target: HTMLElement, duration: number) {
    // Initialize extraHeight to account for any sticky element that may overlap the target element
    let extraHeight = 0;

    // Check if there is a vertical sticky element by its ID
    if (this.verticalStickyElementId) {
      const stickyElement = document.getElementById(this.verticalStickyElementId);
      // If the sticky element exists, get its height
      if (stickyElement) {
        extraHeight = stickyElement.getBoundingClientRect().height;
      }
    }
    // Calculate the target scroll position, adjusting for sticky element height and a small offset
    const targetPosition = target?.getBoundingClientRect().top + window.scrollY - extraHeight - 10;

    // Get the current scroll position
    const startPosition = window.scrollY;

    // Calculate the distance to scroll
    const distance = targetPosition - startPosition;

    // Initialize startTime to null; it will be set during the first animation frame
    let startTime: number | null = null;

    /**
     * Performs the animation for smooth scrolling.
     *
     * @param {number} currentTime - The current timestamp provided by requestAnimationFrame.
     */
    function animation(currentTime: number) {
      // Set the start time on the first call
      if (startTime === null) startTime = currentTime;
      // Calculate the time elapsed since the start of the animation
      const timeElapsed = currentTime - startTime;
      // Compute the current scroll position using the easing function
      const run = ease(timeElapsed, startPosition, distance, duration);
      // Scroll the window to the calculated position
      window.scrollTo(0, run);
      // Continue the animation until the duration has elapsed
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    /**
     * Easing function to create a smooth scroll effect.
     *
     * @param {number} t - The current time (or position) of the tween.
     * @param {number} b - The beginning value of the property.
     * @param {number} c - The change between the beginning and destination value of the property.
     * @param {number} d - The total duration of the tween.
     * @returns {number} - The calculated value at the current time.
     */
    function ease(t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    // Start the animation
    requestAnimationFrame(animation);
  }
}
