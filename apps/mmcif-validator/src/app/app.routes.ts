import { Routes } from '@angular/router';
import { UploadPageComponent } from './components/upload-page/upload-page';
import { ResultsPageComponent } from './components/results-page/results-page';

export const routes: Routes = [
  { path: '', component: UploadPageComponent },
  { path: 'results', component: ResultsPageComponent },
];
