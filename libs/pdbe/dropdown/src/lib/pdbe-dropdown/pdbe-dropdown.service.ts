import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  components: string[] = [];

  registerComponent() {
    const id = this.components.length + 1;
    this.components.push(id + '');
    return id + '';
  }

  unregisterComponent(id: string) {
    const idx = this.components.indexOf(id);
    if (idx !== -1) {
      this.components.splice(idx, 1);
    }
  }

  private currentDropdown: Subject<string> = new Subject();

  public getCurrentDropdownValue(): Observable<string> {
    return this.currentDropdown.asObservable();
  }

  public setCurrentDropdownValue(value: string): void {
    this.currentDropdown.next(value);
  }
}
