import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CifValidationService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('../../workers/pyodide-validator.worker', import.meta.url), { type: 'module' });
  }

  validate(cifText: string): Promise<any> {
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
}
