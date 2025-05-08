import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private loadedScripts: Set<string> = new Set();

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
}
