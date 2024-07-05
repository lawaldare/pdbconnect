import { Route } from '@angular/router';
import { CitationComponent } from './pages/citation/citation.component';
import { SummaryComponent } from './pages/summary/summary.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'citation' },
  { path: 'citation', component: CitationComponent, title: 'Citation Page' },
  { path: 'summary', component: SummaryComponent, title: 'Summary Page' },
];
