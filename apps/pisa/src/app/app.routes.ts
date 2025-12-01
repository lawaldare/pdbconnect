import { Route } from '@angular/router';
import { UploadPageComponent } from './components/upload-page/upload-page';
import { Upload } from './components/upload/upload';

export const appRoutes: Route[] = [
  {
    path: '',
    component: UploadPageComponent,
  },
  {
    path: 'table',
    component: Upload,
  },
];
