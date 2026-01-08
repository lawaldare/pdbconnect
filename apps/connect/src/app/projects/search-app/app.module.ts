import { NgModule, provideZoneChangeDetection } from '@angular/core';
// import { RouterModule }   from '@angular/router';
import { AppMaterialModules } from './app.material.modules';
import { DatePipe } from '@angular/common';
import { Ng2CompleterModule } from './md-autocompleter';

// import { MyDatePickerModule } from 'mydatepicker';
// import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FlexLayoutModule } from '@angular/flex-layout'; //used in header for aligning logo and autocomplete

import { AppComponent } from './app.component';
import { ObjectKeysPipe } from './common//object-keys.pipe';
import { ArrayFillPipe } from './common/array-fill.pipe';
import { RoundPipe } from './common/round.pipe';
import { FormatSpacingPipe } from './common/formatMatchSeq.pipe';
import { SearchService } from './common/search.service';
import { EventBrokerService } from './common/EventBroker.service';
import { ThorService } from './common/thor.service';
import { AppRoutingModule } from './app-routing.module';
import { SearchContainerComponent } from './search/search.component';
import { ParamProcessingService } from './common/paramProcessing.service';
import { FilterChipsComponent } from './filter-chips/filter-chips.component';
import { FilterCardsComponent } from './filter-cards/filter-cards.component';
import { ListFacetComponent } from './list-facet/list-facet.component';
import { ValidationSliderComponent } from './validation-slider/validation-slider.component';
import { ValidationSliderService } from './validation-slider/validation-slider.service';
import { ResultCardComponent } from './result-card/result-card.component';
import { TabPaginationSectionComponent } from './tab-pagination-section/tab-pagination-section.component';
import { PivotResultCardComponent } from './pivot-result-card/pivot-result-card.component';
import { OrcidClaimDialogComponent } from './orcid-claim-dialog/orcid-claim-dialog.component';
import { GalleryModule, GalleryConfig } from './gallery';
import { SearchFormDialogComponent } from './search-form-dialog/search-form-dialog.component';
import { OrcidUserListDialogComponent } from './orcid-user-list-dialog/orcid-user-list-dialog.component';
import { TooltipContentComponent, TooltipContainerComponent, TooltipService } from './tooltip/tooltip.component';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { OldUrlParserService } from './common/oldUrlParser.service';
import { DownloadResultDialogComponent } from './download-result-dialog/download-result-dialog.component';
import { DownloadService } from './common/download.service';
import { DownloadFilesDialogComponent } from './download-files-dialog/download-files-dialog.component';
import { MolstarDialogComponent } from './molstar-dialog/molstar-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipDialogComponent } from './tooltip-dialog/tooltip-dialog.component';

import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter } from './app.date.adapter';
import { APP_DATE_FORMATS } from './app.date.adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PdbNewAutocompleteComponent } from './new-search-autocomplete/new-search-autocomplete.component';

export const galleryConfig: GalleryConfig = {
  style: {
    background: '#ffffff',
    height: '90%',
    width: '80%',
  },
  animation: 'fade',
  loader: {
    width: '50px',
    height: '50px',
    position: 'center',
    icon: 'oval',
  },
  description: {
    position: 'bottom',
    overlay: true,
    text: true,
    counter: true,
    style: {
      background: 'rgba(0,0,0, 0.7)',
    },
  },
  thumbnails: {
    width: 70,
    height: 70,
    position: 'bottom',
    space: 20,
  },
  // bullets: false,
  navigation: {
    nextIcon: '>',
    prevIcon: '<',
  },
  gestures: true,
};

@NgModule({
  declarations: [
    AppComponent,
    ObjectKeysPipe,
    ArrayFillPipe,
    RoundPipe,
    FormatSpacingPipe,
    SearchContainerComponent,
    FilterChipsComponent,
    FilterCardsComponent,
    ListFacetComponent,
    ValidationSliderComponent,
    ResultCardComponent,
    TabPaginationSectionComponent,
    PivotResultCardComponent,
    OrcidClaimDialogComponent,
    SearchFormDialogComponent,
    OrcidUserListDialogComponent,
    TooltipContentComponent,
    TooltipContainerComponent,
    TooltipDirective,
    DownloadResultDialogComponent,
    DownloadFilesDialogComponent,
    MolstarDialogComponent,
    TooltipDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModules,
    Ng2CompleterModule,
    GalleryModule.forRoot(galleryConfig),
    FlexLayoutModule,
    NgSelectModule,
    PdbNewAutocompleteComponent,
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    SearchService,
    EventBrokerService,
    ThorService,
    ValidationSliderService,
    DatePipe,
    ParamProcessingService,
    TooltipService,
    OldUrlParserService,
    DownloadService,
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
