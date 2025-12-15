import { Route } from '@angular/router';
import { UploadPageComponent } from './components/upload-page/upload-page';
import { AssemblyTabsPageComponent } from './components/assembly-tabs-page/assembly-tabs';

export const appRoutes: Route[] = [
  {
    path: '',
    component: UploadPageComponent,
  },
  {
    path: 'tables',
    component: AssemblyTabsPageComponent,
  },
];
