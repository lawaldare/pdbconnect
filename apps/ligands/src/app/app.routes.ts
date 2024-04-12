import { Route } from '@angular/router';
import { MainComponent } from './pages/main/main.component';

export const appRoutes: Route[] = [{ path: ':entryId', component: MainComponent }];
