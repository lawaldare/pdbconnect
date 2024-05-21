import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpIconService {
  components: string[] = [];

  registerComponent() {
    const id = this.components.length + 1;
    this.components.push(id + '');
    return id + '';
  }

  private currentHelpIcon: Subject<string> = new Subject();

  public getCurrentHelpIconValue(): Observable<string> {
    return this.currentHelpIcon.asObservable();
  }

  public setCurrentHelpIconValue(value: string): void {
    this.currentHelpIcon.next(value);
  }
}
