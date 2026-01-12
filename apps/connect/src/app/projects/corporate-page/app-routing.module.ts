import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { JoinPageComponent } from './join-page/join-page.component';
import { ServicesPageComponent } from './services-page/services-page.component';
import { GraphDownloadComponent } from './graph-download/graph-download.component';
import { PartnersPageComponent } from './partners-page/partners-page.component';
import { GraphSchemaComponent } from './graph-schema/graph-schema.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'services', component: ServicesPageComponent},
  {path: 'join', component: JoinPageComponent},
  {path: 'graph', component: GraphDownloadComponent},
  {path: 'partners', component: PartnersPageComponent},
  {path: 'schema', component: GraphSchemaComponent},
  {path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
