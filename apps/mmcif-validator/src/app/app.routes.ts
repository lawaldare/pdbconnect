import { Routes } from '@angular/router';
import { UploadPageComponent } from './components/upload-page/upload-page';
import { ResultsPageComponent } from './components/results-page/results-page';
import { ValidatingPageComponent } from './components/validating-page/validating-page';

export const routes: Routes = [
  { path: '', component: UploadPageComponent },
  { path: 'validating', component: ValidatingPageComponent },
  { path: 'results', component: ResultsPageComponent },
];
