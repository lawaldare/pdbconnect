import { Injectable } from '@angular/core';
import { CifDictionaryItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CifDictionaryService {
  private dictionary: Record<string, CifDictionaryItem> = {};

  setDictionary(dictionary: Record<string, CifDictionaryItem>): void {
    this.dictionary = dictionary;
  }

  getItem(name: string): CifDictionaryItem | null {
    return this.dictionary[name] ?? null;
  }

  hasLoaded(): boolean {
    return Object.keys(this.dictionary).length > 0;
  }
}
