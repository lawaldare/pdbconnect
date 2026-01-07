import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MaterialModule } from '@pdbc/core';
import { EventBrokerService, IEventListener } from '../common/EventBroker.service';
import { SearchService } from '../common/search.service';
import * as appSettings from '../app.settings';
import { GalleryModalComponent } from '../gallery/component/gallery-modal/gallery-modal.component';
import { ListFacetComponent } from '../list-facet/list-facet.component';
import { CommonModule } from '@angular/common';
import { TooltipContainerComponent } from '../tooltip/tooltip.component';
import { PdbNewAutocompleteComponent } from '../new-search-autocomplete/new-search-autocomplete.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchContainerComponent } from '../search-container/search-container.component';

declare const gtag: any;

@Component({
  selector: 'pdbc-search-app-container',
  templateUrl: './search-app-container.component.html',
  styleUrls: ['./search-app-container.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    ListFacetComponent,
    TooltipContainerComponent,
    GalleryModalComponent,
    PdbNewAutocompleteComponent,
    FlexLayoutModule,
    SearchContainerComponent,
  ],
})
export class SearchAppContainerComponent implements OnDestroy {
  private readonly _eventBroker = inject(EventBrokerService);
  private searchService = inject(SearchService);
  title = 'PDB Search Application';
  facetUpdateListener: IEventListener;
  facetOpenListener: IEventListener;
  menuFacetData: any;
  currentPage = '/search';
  searchtext = '';
  facetManagerList = [
    'entryAuthorFacetManager',
    'moleNameFacetManager',
    'molTypeFacetManager',
    'interactingLigandsFacetManager',
    'orgNameFacetManager',
    'expMethodFacetManager',
    'assemblyCompositionFacetManager',
    'assemblyTypeFacetManager',
    'assemblyFormFacetManager',
    'journalFacetManager',
    'resolutionFacetsManager',
    'ecNumberFacetManager',
    'bioCellComponentFacetManager',
    'statusFacetManager',
    'geneNameFacetManager',
    'genusFacetManager',
    'superkingdomFacetManager',
    'biologicalProcessFacetManager',
    'biologicalFunctionFacetManager',
    'citationYearFacetManager',
    'citAuthorsFacetManager',
    'scopFamilyFacetManager',
    'scopFoldFacetManager',
    'cathClassFacetManager',
    'cathTopologyFacetManager',
    'spacegroupFacetManager',
    'refSoftFacetManager',
    'beamSrcNameFacetManager',
    'detectorFacetManager',
    'detectorTypeFacetManager',
    'diffProtocolFacetManager',
    'synchrotronSiteFacetManager',
  ];
  pdbeUrl;

  // Sidemenu
  @ViewChild(MatSidenav) facetMenu!: MatSidenav;

  onFacetSelect(selectedFacet: any): any {
    if (typeof selectedFacet == 'undefined') return false;
    this._eventBroker.emit('menu-facet-selected', selectedFacet);
    this.facetMenu.close();
  }

  constructor() {
    this.facetUpdateListener = this._eventBroker.listen<boolean>('facet-data-update', (facetDataValue: any) => {
      this.menuFacetData = facetDataValue;
    });
    this.facetOpenListener = this._eventBroker.listen<boolean>('open-facet-clicked', (value: any) => {
      this.facetMenu.open();
      window.scrollTo(0, 0);
      gtag('event', 'filters_section_opened_in_mobile');
    });

    this.pdbeUrl = appSettings.pdbeUrl;
  }

  ngOnDestroy() {
    this.facetUpdateListener.ignore();
    this.facetOpenListener.ignore();
  }

  //Search Auctocomplete Config
  autoCompleteConfigRight = {
    resultBoxAlign: 'right',
    redirectOnClick: false,
    searchUrl: appSettings.pdbeUrl + 'search/pdb-autocomplete/select',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    sort: 'category+asc,num_pdb_entries+desc',
    additionalParams: 'rows=20000&json.nl=map&wt=json',
  };

  autoCompleteConfigLeft = {
    resultBoxAlign: 'left',
    redirectOnClick: false,
    searchUrl: appSettings.pdbeUrl + 'search/pdb-autocomplete/select',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    sort: 'category+asc,num_pdb_entries+desc',
    additionalParams: 'rows=20000&json.nl=map&wt=json',
  };

  onAutocompleteSelect(selectedItem: any) {
    console.log('Autocomplete selected item:', selectedItem);
    this._eventBroker.emit('autocomplete-select', selectedItem);
  }

  headerSearchClick() {
    if (typeof this.searchtext == 'undefined' || this.searchtext == '' || this.searchtext == null) return;
    this.onAutocompleteSelect({ var_name: 'text', value: this.searchtext });
    this.searchtext = '';
  }

  openAdvancedSearch() {
    this._eventBroker.emit('open-advanced-search', true);
  }
}
