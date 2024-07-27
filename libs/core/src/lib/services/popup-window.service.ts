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

  popIn(popOutWindow: Window | null, innerWrapper: HTMLDivElement, id: string): void {
    const popOutWrapper = this.windowWrapperMap[id].popOutWrapper;
    this.renderer.appendChild(popOutWrapper.nativeElement, innerWrapper);
    if (popOutWindow) {
      this.closeWindow(id);
    }
  }

  popOut(popOutWrapper: ElementRef, id: string): void {
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

    popOutWindow.document.body.querySelector('.splide__arrows.splide__arrows--ltr')?.classList.add('hide-button');

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
      popOutWindow.document.head.insertAdjacentHTML(
        'beforeend',
        `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`
      );
    });

    document.head.querySelectorAll('style').forEach((node) => {
      popOutWindow.document.head.appendChild(node.cloneNode(true));
    });

    popOutWindow.document.body.classList.add('om-morpho');
  }
}
