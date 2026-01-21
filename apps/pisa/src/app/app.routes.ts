import { Route } from '@angular/router';
import { UploadPageComponent } from './components/upload-page/upload-page';
import { AssemblyTabsPageComponent } from './components/assembly-tabs-page/assembly-tabs';
import { ProcessingPageComponent } from './components/processing-page/processing-page';

export const appRoutes: Route[] = [
  {
    path: '',
    component: UploadPageComponent,
  },
  {
    path: 'processing',
    component: ProcessingPageComponent,
  },
  {
    path: 'processing/:jobId',
    component: ProcessingPageComponent,
  },
  {
    path: 'assemblies',
    component: AssemblyTabsPageComponent,
  },
];
