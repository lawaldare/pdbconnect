/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface PopOutWindow {
  innerWrapper: HTMLDivElement;
  popOutWrapper: ElementRef;
  popOutWindow: Window;
}

@Injectable({
  providedIn: 'root',
})
export class PopupWindowService {
  private windowWrapperMap: Record<string, PopOutWindow> = {};
  private renderer: Renderer2;

  constructor(private _renderer: RendererFactory2) {
    this.renderer = this._renderer.createRenderer(null, null);
  }

  private popIn(popOutWindow: Window | null, innerWrapper: HTMLDivElement, id: string): void {
    const popOutWrapper = this.windowWrapperMap[id]?.popOutWrapper;
    if (popOutWrapper) this.renderer.appendChild(popOutWrapper.nativeElement, innerWrapper);
    if (popOutWindow) {
      this.closeWindow(id);
    }
  }

  public popOut(popOutWrapper: ElementRef, id: string): void {
    if (this.windowWrapperMap[id]?.popOutWindow) {
      this.popIn(this.windowWrapperMap[id].popOutWindow, this.windowWrapperMap[id].innerWrapper, id);
      return;
    }
    const elmRect = popOutWrapper.nativeElement.getBoundingClientRect();
    const innerWrapper = document.createElement('div');
    innerWrapper.style.width = '100%';

    Array.from(popOutWrapper.nativeElement.children).forEach((element: any) => {
      innerWrapper.appendChild(element);
    });

    const popOutWindow = this.getPopOutWindow(elmRect, id);

    if (popOutWindow) {
      this.windowWrapperMap[id] = { innerWrapper, popOutWrapper, popOutWindow };
      this.cloneStylesToPopOutWindow(popOutWindow);
      this.renderer.appendChild(popOutWindow.document.body, innerWrapper);
      this.cloneScriptsToPopOutWindow(popOutWindow);
      this.setupEventProxy(popOutWindow, innerWrapper);

      popOutWindow.focus();
      popOutWindow.addEventListener('unload', () => this.popIn(popOutWindow, innerWrapper, id));
    }
  }

  private getPopOutWindow(elmRect: DOMRect, id: string): Window | null {
    const [winLeft, winTop] = this.getWindowPositioning(elmRect);

    const windowFeatures = `popup,width=${elmRect.width},height=${elmRect.height},left=${winLeft},top=${winTop}`;

    const popOutWindow = window.open('', id, windowFeatures);

    if (popOutWindow) {
      popOutWindow.document.title = window.document.title;
      popOutWindow.document.body.style.margin = '0';
      popOutWindow.document.body.style.backgroundColor = '#FFF';
      popOutWindow.document.body.style.display = 'flex';
      popOutWindow.document.body.style.justifyContent = 'center';
    }

    return popOutWindow;
  }

  private getWindowPositioning(elmRect: DOMRect): [number, number] {
    const navHeight = window.outerHeight - window.innerHeight;
    const navWidth = (window.outerWidth - window.innerWidth) / 2;

    const winTop = window.screenY + navHeight + elmRect.top - 60;
    const winLeft = window.screenX + navWidth + elmRect.left;

    return [winLeft, winTop];
  }

  private closeWindow(windowId: string): void {
    const popOutWindow = this.windowWrapperMap[windowId].popOutWindow;
    if (popOutWindow) {
      popOutWindow.close();
      delete this.windowWrapperMap[windowId];
    }
  }

  private cloneStylesToPopOutWindow(popOutWindow: Window): void {
    if (!window.navigator.userAgent.includes('Firefox')) {
      document.fonts.forEach((node) => {
        (popOutWindow.document as any).fonts.add(node);
      });
    }

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
      popOutWindow.document.head.insertAdjacentHTML(
        'beforeend',
        `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`
      );
    });

    document.head.querySelectorAll('style').forEach((node) => {
      popOutWindow.document.head.appendChild(node.cloneNode(true));
    });
  }

  private cloneScriptsToPopOutWindow(popOutWindow: Window): void {
    document.body.querySelectorAll('script').forEach((node) => {
      popOutWindow.document.body.appendChild(node.cloneNode(true));
    });
  }

  private setupEventProxy(win: Window, sourceContainer: HTMLDivElement) {
    const forwardEvent = (e: Event) => {
      const cloned = new (e.constructor as any)(e.type, e);
      document.dispatchEvent(cloned);
    };

    const events = ['pointerdown', 'pointermove', 'pointerup', 'mousedown', 'mousemove', 'mouseup'];
    events.forEach((eventType) => {
      sourceContainer.addEventListener(eventType, forwardEvent, true);
    });
  }

  public isMaximizedOnMac(): boolean {
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isScreenFilled = window.innerWidth >= screen.availWidth - 10 && window.innerHeight >= screen.availHeight - 10;
    const result = isFullscreen || isScreenFilled;
    if (result) {
      alert('Please minimize this window for the best experience!');
      return true;
    }
    return false;
  }
}
