import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { CoreModule } from '@pdbc/core';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule, CoreModule, NavigationBarComponent],
  selector: 'pdbe-connect-playground',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'playground';
  
  // Property to control the visibility of the navigation bar
  showNavigationBar: boolean = true;

  // Inject ActivatedRoute and Router services
  constructor(private route: ActivatedRoute, private router: Router) {
    
    // Subscribe to router events to detect navigation changes
    this.router.events.pipe(

      // Filter for navigation end events
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      
      // Get the current route snapshot
      const currentRoute = this.route.root.firstChild?.snapshot;

      // Set the showNavigationBar property based on the route's data
      this.showNavigationBar = currentRoute?.data['showNavigationBar'] ?? true;
    });
  }
}
