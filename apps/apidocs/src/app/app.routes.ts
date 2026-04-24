import { Route } from '@angular/router';
import { PdbeApiPage } from './pages/pdbe-api/pdbe-api-page.component';
import { PdbeSearchSolrPage } from './pages/pdbe-search-solr/pdbe-search-solr-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: PdbeApiPage, // "/" default route
  },
  {
    path: 'search',
    component: PdbeSearchSolrPage, // "/search"
  },
  {
    path: '**',
    redirectTo: '', // fallback
  },
];
