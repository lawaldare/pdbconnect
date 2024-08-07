import { Route } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';
import { CitationComponent } from './pages/citation/citation.component';
import { OthersComponent } from './pages/others/others.component';
import { ButtonsPlaygroundComponent } from './pages/buttons-playground/buttons-playground.component';
import { EntryEcm2024Component } from './pages/entry-ecm-2024/entry-ecm-2024.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'citation', data: { showNavigationBar: true } },
  { path: 'citation', component: CitationComponent, title: 'Citation Page', data: { showNavigationBar: true } },
  { path: 'summary', component: SummaryComponent, title: 'Summary Page', data: { showNavigationBar: true } },
  { path: 'others', component: OthersComponent, title: 'Summary Page', data: { showNavigationBar: true } },
  { path: 'buttons', component: ButtonsPlaygroundComponent, title: 'Buttons Page', data: { showNavigationBar: true } },
  { path: 'entry/:entryId', component: EntryEcm2024Component, title: 'Entry Page', data: { showNavigationBar: false, showPdbeLogoAndSearch: true, defaultMargins: false, bgColor: '#e3e3e3' } },
];
