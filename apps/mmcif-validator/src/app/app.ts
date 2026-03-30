import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';

@Component({
  imports: [RouterModule, HeaderComponent, VfEbiHeaderComponent, VfEbiFooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _router = inject(Router);
  public isResultsPage = signal(false);

  constructor() {
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event.url.includes('/results')) {
        window.scrollTo(0, 0);
        this.isResultsPage.set(true);
      }
    });
  }
}
