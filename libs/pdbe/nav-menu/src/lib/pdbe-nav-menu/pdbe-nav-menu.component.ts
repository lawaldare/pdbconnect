import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // <-- do not forget to import

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

  // sectionId of navSection that current active on nav component (bold and with background)
  currentlyActive?: string;

  // sectionId of navSection that current active on nav component (bold and with background)
  clickedActive?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // if page route contains anchor navigation, trigger scrolling to it
    this.route.fragment.subscribe((fragment) => {
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
    const isVisible = elemTop >= minVisible && elemBottom <= window.innerHeight;
    const isinScroll = elemTop >= 0 && elemBottom <= window.innerHeight;

    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;

    return { visible: isVisible, withinScroll: isinScroll };
  }

  /**
   * Function for creating scrolling tracker of sections in page
   */
  createScrollObserver() {
    // const thisAngularElement = this;
    const allSectionIds = [];

    // first we get all section ids of navSections and nested navSubSections
    for (const navSection of this.navSections) {
      const eleAndChildIds = [navSection.sectionId];
      allSectionIds.push(...eleAndChildIds);
    }

    const checkScrolledIntoView = (_e: Event) => {
      // if we are scrolling by click, do nothing
      if (this.clickedActive) return;

      const activeList = [];

      // for each element to monitor, check if it is within view
      const elementIdList = this.navSections.map((navSection) => navSection.sectionId);
      for (const eachSectionId of elementIdList) {
        const sectionElement = document.getElementById(eachSectionId);

        if (!sectionElement) continue; // if element exists on page

        const sectionElementVisibility = this.isScrolledIntoView(sectionElement).visible;
        if (sectionElementVisibility) activeList.push(eachSectionId);
      }

      // if no active elements, just keep state as it is
      if (activeList.length === 0) return;

      // for detecting scroll direction: https://stackoverflow.com/a/31223774
      let lastScrollTop = 0;
      const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      if (st > lastScrollTop) {
        // downscroll code
        this.currentlyActive = activeList[0];
      } else if (st < lastScrollTop) {
        // upscroll code
        this.currentlyActive = activeList[activeList.length - 1];
      } // else was horizontal scroll
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    };
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
    this.currentlyActive = elementId;
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // unfocus document element before scrolling
    (<HTMLElement>document.activeElement)?.blur();

    // Necessary so clicked element remains active while scrollIntoView is scrolling
    let scrollTimeout: string | number | NodeJS.Timeout | undefined;
    const onScrollEnd = (_e: Event) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.clickedActive = undefined;
        document.removeEventListener('scroll', onScrollEnd);
      }, 100);
    };
    document.addEventListener('scroll', onScrollEnd);
  }
}
