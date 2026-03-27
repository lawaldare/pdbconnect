import { Routes } from '@angular/router';
import { ResultsPageComponent } from './components/result-page/result-page';
import { UploadPageComponent } from './components/upload-page/upload-page';

export const routes: Routes = [
  { path: '', component: UploadPageComponent },
  { path: 'results', component: ResultsPageComponent },
];
