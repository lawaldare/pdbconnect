import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private loadedScripts: Set<string> = new Set();
  private loadedStyles = new Set<string>();

  public loadScript(src: string, isModule = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      if (isModule) script.type = 'module';

      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(`Failed to load script: ${src}`);

      document.body.appendChild(script);
    });
  }
  public loadGlobal<T = any>(src: string, globalVarName: string, isModule = false): Promise<T> {
    return this.loadScript(src, isModule).then(() => {
      return new Promise<T>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          const ref = (window as any)[globalVarName];
          if (ref) {
            clearInterval(checkInterval);
            resolve(ref);
          }
        }, 50);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(`Global variable '${globalVarName}' not found after loading ${src}`);
        }, 5000);
      });
    });
  }

  public loadStyle(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedStyles.has(href)) {
        resolve();
        return;
      }

      // Avoid duplicates already in DOM (SSR / hydration safety)
      const existing = document.querySelector(`link[rel="stylesheet"][href="${href}"]`);
      if (existing) {
        this.loadedStyles.add(href);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;

      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };

      link.onerror = () => reject(`Failed to load stylesheet: ${href}`);

      document.head.appendChild(link);
    });
  }
}
