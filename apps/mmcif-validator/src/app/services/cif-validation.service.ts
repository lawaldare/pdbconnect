import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CifValidationService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker('assets/workers/pyodid-worker.js');
  }

  public validate(cifText: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        const data = event.data;

        if (data.type === 'RESULT') {
          this.worker.removeEventListener('message', listener);
          resolve(data.payload);
        }

        if (data.type === 'ERROR') {
          this.worker.removeEventListener('message', listener);
          reject(data.payload);
        }
      };

      this.worker.addEventListener('message', listener);

      this.worker.postMessage({
        type: 'VALIDATE',
        payload: { cifText },
      });
    });
  }

  public loadDictionary(): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        const data = event.data;

        if (data.type === 'DICTIONARY_READY') {
          this.worker.removeEventListener('message', listener);
          resolve(data.payload);
        }

        if (data.type === 'ERROR') {
          this.worker.removeEventListener('message', listener);
          reject(data.payload);
        }
      };

      this.worker.addEventListener('message', listener);

      this.worker.postMessage({
        type: 'LOAD_DICTIONARY',
      });

      console.log('Message sent to worker');
    });
  }
}
