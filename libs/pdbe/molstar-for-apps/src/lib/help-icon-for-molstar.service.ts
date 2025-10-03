import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelpIconForMolstarService {
  private _showHelpIcon = signal<boolean>(true);
  public showHelpIcon = this._showHelpIcon.asReadonly();

  public toggleHelpIcon(state: boolean): void {
    this._showHelpIcon.set(!state);
  }
}
