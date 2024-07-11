import { Route } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';
import { CitationComponent } from './pages/citation/citation.component';
import { OthersComponent } from './pages/others/others.component';
import { ButtonsPlaygroundComponent } from './pages/buttons-playground/buttons-playground.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'citation' },
  { path: 'citation', component: CitationComponent, title: 'Citation Page' },
  { path: 'summary', component: SummaryComponent, title: 'Summary Page' },
  { path: 'others', component: OthersComponent, title: 'Summary Page' },
  { path: 'buttons', component: ButtonsPlaygroundComponent, title: 'Buttons Page' },
];
