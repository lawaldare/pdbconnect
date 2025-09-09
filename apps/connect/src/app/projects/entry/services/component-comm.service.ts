import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import type { InitParams } from 'pdbe-molstar/lib/spec';
@Injectable({
  providedIn: 'root',
})
export class ComponentCommunicationService {
  public currentTabName = signal<string | undefined>(undefined);
  public slowNetwork$ = new BehaviorSubject<boolean | undefined>(undefined);

  public mobileMolstar?: MolstarComponent;
  public mobileMolstarLoaded$ = new BehaviorSubject<boolean>(false);
  public mobileModelIdx$ = new BehaviorSubject<string>('1');
  public configForMobileMolstar = signal<InitParams | undefined>(undefined);
  public mobileMolstarDisplay = 'none';

  public assemblySelection$ = new BehaviorSubject<number | undefined>(undefined);
  public macromoleculeSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public ligandSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public domainSelection$ = new BehaviorSubject<number | undefined>(undefined);
  public llmSelection$ = new BehaviorSubject<number | undefined>(undefined);
}
