import { Injectable } from '@angular/core';

export interface CifStoredData {
  fileName: string;
  cifText: string;
}

@Injectable({ providedIn: 'root' })
export class CifFileStoreService {
  private readonly dbName = 'mmcif-validator-db';
  private readonly storeName = 'files';
  private readonly version = 1;

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async put(key: string, value: CifStoredData | Blob): Promise<void> {
    const db = await this.openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    db.close();
  }

  async get(key: string): Promise<CifStoredData | Blob | undefined> {
    const db = await this.openDb();

    const result = await new Promise<CifStoredData | Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).get(key);
      req.onsuccess = () => resolve(req.result as CifStoredData | undefined);
      req.onerror = () => reject(req.error);
    });

    db.close();
    return result;
  }

  // async putCifFile(key: string, value: Blob): Promise<void> {
  //   const db = await this.openDb();

  //   await new Promise<void>((resolve, reject) => {
  //     const tx = db.transaction(this.storeName, 'readwrite');
  //     tx.objectStore(this.storeName).put(value, key);
  //     tx.oncomplete = () => resolve();
  //     tx.onerror = () => reject(tx.error);
  //   });

  //   db.close();
  // }

  // async getCifFile(key: string): Promise<Blob | undefined> {
  //   const db = await this.openDb();

  //   const result = await new Promise<Blob | undefined>((resolve, reject) => {
  //     const tx = db.transaction(this.storeName, 'readonly');
  //     const req = tx.objectStore(this.storeName).get(key);
  //     req.onsuccess = () => resolve(req.result as Blob | undefined);
  //     req.onerror = () => reject(req.error);
  //   });

  //   db.close();
  //   return result;
  // }

  async del(key: string): Promise<void> {
    const db = await this.openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    db.close();
  }
}
