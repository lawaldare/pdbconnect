import { Component, Renderer2, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { CoreModule } from '@pdbc/core';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { filter } from 'rxjs/operators';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { ThemeType } from '@pdbc/core';

@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule, CoreModule, NavigationBarComponent, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  selector: 'pdbe-connect-playground',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'playground';

  // Property to control the visibility of the navigation bar
  public showNavigationBar = signal(true);

  // Properties to control the default margin+padding of .content div
  public defaultMargins = signal(true);

  // Properties to control the PDBe logo visibility and style
  public showPdbeLogoAndSearch = signal(false);
  public readonly pdbeLogoConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
    ],
    menuHighlightColor: '#0a5032',
  };

  public readonly pdbeSearchConfig = {
    examples: [
      {
        label: 'Haemoglobin',
        url: 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22hemoglobin%22, %22condition1%22:%22AND%22, %22condition2%22:%22Contains%22%7D%5D, %22resultState%22:%7B%22tabIndex%22:0, %22paginationIndex%22:1, %22perPage%22:%2210%22, %22sortBy%22:%22Sort%20by%22%7D%7D',
      },
      {
        label: 'BRCA1_HUMAN',
        url: 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22BRCA1_HUMAN%22, %22condition1%22:%22AND%22, %22condition2%22:%22Contains%22%7D%5D, %22resultState%22:%7B%22tabIndex%22:0, %22paginationIndex%22:1, %22perPage%22:%2210%22, %22sortBy%22:%22Sort%20by%22%7D%7D',
      },
    ],
    backgroundColor: '#007B53',
    hasAdvancedSearch: true,
    buttonText: 'Search',

    type: ThemeType.PDBE,
  };

  // Inject ActivatedRoute and Router services
  constructor(private route: ActivatedRoute, private router: Router, private renderer: Renderer2) {
    // Subscribe to router events to detect navigation changes
    this.router.events
      .pipe(
        // Filter for navigation end events
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Get the current route snapshot
        const currentRoute = this.route.root.firstChild?.snapshot;

        // Set the showNavigationBar property based on the route's data
        this.showNavigationBar.set(currentRoute?.data['showNavigationBar'] ?? false);

        // Set the showNavigationBar property based on the route's data
        this.showPdbeLogoAndSearch.set(currentRoute?.data['showPdbeLogoAndSearch'] ?? false);

        this.defaultMargins.set(currentRoute?.data['defaultMargins'] ?? false);

        // Set the body background color based on the route's data
        const bgColor = currentRoute?.data['bgColor'] ?? '';
        this.renderer.setStyle(document.body, 'backgroundColor', bgColor);
      });
  }
}
