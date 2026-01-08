/* eslint-disable no-useless-escape */
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, inject } from '@angular/core';
import { FacetGroups, FacetOrder } from '../common/facet-order';
import { SearchResultModel } from '../common/search-result-model';
import { SearchService } from '../common/search.service';
import { ObjectKeysPipe } from '../common/object-keys.pipe';
import { EventBrokerService, IEventListener } from '../common/EventBroker.service';
import { CommonModule, Location } from '@angular/common';
import { ThorService } from '../common/thor.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParamProcessingService } from '../common/paramProcessing.service';
import { OrcidClaimDialogComponent } from '../orcid-claim-dialog/orcid-claim-dialog.component';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';
import { OldUrlParserService } from '../common/oldUrlParser.service';
import { DownloadResultDialogComponent } from '../download-result-dialog/download-result-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '@pdbc/core';
import { FilterChipsComponent } from '../filter-chips/filter-chips.component';
import { ListFacetComponent } from '../list-facet/list-facet.component';
import { TabPaginationSectionComponent } from '../tab-pagination-section/tab-pagination-section.component';
import { FormsModule } from '@angular/forms';
import { ResultCardComponent } from '../result-card/result-card.component';
import { PivotResultCardComponent } from '../pivot-result-card/pivot-result-card.component';

declare const AjaxSolr: any;
declare const PDBe: any;
declare const gtag: any;

@Component({
  selector: 'pdbc-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    FilterChipsComponent,
    ListFacetComponent,
    TabPaginationSectionComponent,
    FormsModule,
    ResultCardComponent,
    PivotResultCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject();
  private autocompleteEventListener!: IEventListener;
  private facetMenuEventListener!: IEventListener;
  private openAdvancedSearchListener!: IEventListener;
  filtercards: any[];
  facetData: any = {};
  solrManagerRef: any;
  completeQuery = "Click 'Generate Query' button to display the complete Solr Query Here!";
  notificationMsg = 'Loading';
  activeFacetIndex: any;
  activeFacetManager = '';
  activeTabIndex = 0;
  facetOrder: any;
  showTabLoader = false;
  thorInfo: any;
  qValue = 'q=';
  fqValue = 'fq=';
  facetManagerList: any[] = [];
  facetManagerGrouping: any[] = [];
  facetTagFq = {};
  sequenceParamFlag = false;
  loaderPauseTime = 1000;
  serviceHook: any = {};
  urlSubscriber: any;
  routeSubscriber: any;
  thorClaimInfoById: any = {};
  tabAttributes: any = SearchResultModel;
  isLatestChemistry = false;
  sequenceClustering = false;
  sequenceClusteringValue = 0;
  clusteringExceptions = ['pivotEntriesManager'];
  repStructuresFacet = {
    list: [
      {
        count: 0,
        label: '100%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '95%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '90%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '70%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '50%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '40%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
      {
        count: 0,
        label: '30%',
        otherDetails: {
          facetManagerName: 'repStructursFacetManager',
          facetTitle: 'Representative Structures',
          field: 'q_seq_100_cluster_number',
        },
      },
    ],
  };

  private readonly cd = inject(ChangeDetectorRef);
  public readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  public readonly _eventBroker = inject(EventBrokerService);
  private readonly thorService = inject(ThorService);
  private readonly paramProcessingService = inject(ParamProcessingService);
  private readonly oldUrlParser = inject(OldUrlParserService);

  constructor() {
    //Initialise Thor
    this.thorInfo = Object.assign({}, this.thorService.getThorInfo());
    /*
    //commented THOR
    if(typeof this.thorInfo.claimingInfoData == 'undefined' || this.thorInfo.thorInitError){
      thorService.loadClaimingInfo('PDB').then(() => {
        this.thorInfo = Object.assign({}, thorService.getThorInfo());
      });
    }*/

    //Initialise solr manager
    this.solrManagerRef = AjaxSolr.createManagerStore(PDBe.SolrApp.managerConfig);
    this.facetOrder = FacetOrder;
    this.facetManagerList = this.getFacetManagers();
    this.filtercards = this.searchService.getFilterCards();

    //Subscribe to app level global events
    this.subscribeToGlobalEvents();
  }

  ngOnInit() {
    //Subscribe to location observable for 'Back' button functionality
    this.urlSubscriber = this.location.subscribe((params) => {
      const urlParamsStr = params.url?.split(/\?searchParams=(.+)/)[1];
      if (typeof urlParamsStr != 'undefined') {
        const urlParamJson = JSON.parse(decodeURIComponent(urlParamsStr));
        this.loadUrlParams(urlParamJson, true);
      } else {
        this.removeAllFilters();
      }
    });

    //Subscribe to route observable for param loading from url on page reload
    this.routeSubscriber = this.route.queryParamMap.subscribe((paramMap: any) => {
      const raw = paramMap.get('searchParams');
      if (this.filtercards && this.filtercards.length == 0 && raw) {
        const decoded = decodeURIComponent(raw.replace(/\+/g, '%20'));
        // ✅ remove accidental "?view=..." suffix
        const jsonOnly = decoded.split('?')[0];
        this.loadUrlParams(JSON.parse(jsonOnly), true);
        return;
      }

      const advanced = paramMap.get('advancedSearch');
      if (advanced === 'true') {
        this.openSearchForm();
        return;
      }

      const searchParamObj = this.oldUrlParser.parse(paramMap);
      if (Object.keys(searchParamObj).length > 0) {
        this.loadUrlParams(searchParamObj, true);
      }
    });
  }

  arrayChunk(arr: any, chunkSize: number): any {
    const result = [];
    for (let index = 0, len = arr.length; index < len; index += chunkSize) {
      result.push(arr.slice(index, index + chunkSize));
      return result;
    }
  }

  //Function to parse and load url params
  loadUrlParams(urlParams: any, reloadTabFlag: any) {
    //reset search params
    this.searchService.resetFilterCards();
    this.filtercards = this.searchService.getFilterCards().slice();
    const urlSearchParams = urlParams;

    for (const paramKey in urlSearchParams) {
      if (paramKey == 'resultState') {
        //Set Result State
        if (typeof urlSearchParams[paramKey].tabIndex != 'undefined') this.activeTabIndex = urlSearchParams[paramKey].tabIndex;
        if (typeof urlSearchParams[paramKey].paginationIndex != 'undefined')
          this.tabAttributes[this.activeTabIndex].pagination.currentPage = urlSearchParams[paramKey].paginationIndex;
        if (typeof urlSearchParams[paramKey].sortBy != 'undefined' && this.activeTabIndex == 0)
          this.tabAttributes[this.activeTabIndex].pagination.sort.value = urlSearchParams[paramKey].sortBy.replace(/^\"|\"$|^\'|\'$/g, '');
        if (typeof urlSearchParams[paramKey].perPage != 'undefined') this.tabAttributes[this.activeTabIndex].pagination.perPage = urlSearchParams[paramKey].perPage;
      } else {
        urlSearchParams[paramKey].forEach((paramValues: any) => {
          const paramCond2 = typeof paramValues.condition2 != 'undefined' ? paramValues.condition2.replace(/^\"|\"$|^\'|\'$/g, '') : undefined;
          if (paramKey == 'q_seq_100_cluster_number') paramValues.value += '%';
          let tempParamValue = paramValues.value;
          if (typeof tempParamValue == 'string') tempParamValue = paramValues.value.replace(/^\"|\"$|^\'|\'$/g, '');
          this.addFacetFilterCard(paramKey, tempParamValue, paramValues.condition1, paramCond2, 'paramLoader');
        });
      }
    }

    if (urlSearchParams.resultState && urlSearchParams.resultState.sortBy) {
      if (this.tabAttributes[this.activeTabIndex].pagination.sort) {
        let isNewSort = true;
        this.tabAttributes[this.activeTabIndex].pagination.sort.options.forEach((sortOption: any) => {
          if (sortOption.value == urlSearchParams.resultState.sortBy) isNewSort = false;
        });
        const sortValsList = ['phmmer(e_value) asc', 'phmmer(e_value) desc', 'fasta(e_value) asc', 'fasta(e_value) desc'];
        if (sortValsList.indexOf(urlSearchParams.resultState.sortBy) > -1) isNewSort = false;
        if (isNewSort) {
          const optionValue = urlSearchParams.resultState.sortBy.split(' ')[0];
          const optionLabel = optionValue
            .split('_')
            .join(' ')
            .replace(/^\w/, (c: string) => c.toUpperCase());
          this.tabAttributes[this.activeTabIndex].pagination.sort.options.push({
            label: optionLabel + ' (asc)',
            value: optionValue + ' asc',
          });
          this.tabAttributes[this.activeTabIndex].pagination.sort.options.push({
            label: optionLabel + ' (desc)',
            value: optionValue + ' desc',
          });
        }
      }
    }

    if (reloadTabFlag) this.reloadTab(reloadTabFlag);
  }

  getFacetManagers() {
    const manList = [];
    const grouping = [];
    for (const managerKey in this.facetOrder) {
      manList.push(this.facetOrder[managerKey].solrManager);

      //grouping
      const groupIndex = this.facetOrder[managerKey].groupingIndex;

      if (typeof grouping[groupIndex] == 'undefined') {
        grouping[groupIndex] = [this.facetOrder[managerKey].solrManager];
      } else {
        grouping[groupIndex].push(this.facetOrder[managerKey].solrManager);
      }
    }

    this.facetManagerGrouping = grouping;
    return manList;
  }

  //Function to subscribe app level global events
  subscribeToGlobalEvents() {
    this.autocompleteEventListener = this._eventBroker.listen<boolean>('autocomplete-select', (autoCompleteValue: any) => {
      if (typeof autoCompleteValue == 'undefined') {
        return;
      }

      this.displayLoading(true);

      //reset search params
      this.searchService.resetFilterCards();
      this.filtercards = this.searchService.getFilterCards().slice();

      //reset facet data
      this.facetData = Object.assign({}, {});
      this.activeFacetManager = '';
      this.cd.detectChanges(); //Trigger change detection

      //Set solrcoreurl to normal
      this.facetOrder = FacetOrder;
      this.facetManagerList = this.getFacetManagers();

      //add card
      let selAutocompleteField = autoCompleteValue.var_name;
      let selAutocompleteCondition = 'Contains';
      if (selAutocompleteField != 'text') {
        selAutocompleteField = 'q_' + selAutocompleteField;
        selAutocompleteCondition = 'Equal to';
      }
      this.addFacetFilterCard(selAutocompleteField, autoCompleteValue.value, 'AND', selAutocompleteCondition);
    });

    this.facetMenuEventListener = this._eventBroker.listen<boolean>('menu-facet-selected', (selFacetValue: any) => {
      if (typeof selFacetValue == 'undefined') {
        return;
      }

      this.displayLoading(true);
      this.cd.detectChanges(); //Trigger change detection

      if (typeof selFacetValue.action != 'undefined') {
        this.loadMoreFacetData(selFacetValue.details.facetManagerName);
      } else {
        if (!this.checkFilterCardExist(selFacetValue.otherDetails.field, selFacetValue.label)) {
          this.facetData = Object.assign({}, {});
          this.activeFacetManager = '';
        }

        // this.facetData = Object.assign({}, {});
        if (selFacetValue.otherDetails.isRange == true) {
          this.addFacetFilterCard(selFacetValue.otherDetails.field, selFacetValue.label, 'AND', '= range');
        } else {
          let fcCondition = undefined;

          const facetCardObject = Object.assign({}, PDBe.SolrApp.searchFields[selFacetValue.otherDetails.field]);

          if (facetCardObject.type == 'int' || facetCardObject.type == 'float' || facetCardObject.type == 'date') {
            fcCondition = '=';
          } else if (facetCardObject.type == 'string') {
            fcCondition = 'Equal to';
          }
          this.addFacetFilterCard(selFacetValue.otherDetails.field, selFacetValue.label, 'AND', fcCondition);
        }
      }
    });

    this.openAdvancedSearchListener = this._eventBroker.listen<boolean>('open-advanced-search', (val: any) => {
      this.openSearchForm();
    });
  }

  //Function to display loading message / icon
  displayLoading(show: any) {
    if (show) {
      this.showTabLoader = true;
      this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].loadingMsg;
    } else {
      this.showTabLoader = false;
    }
  }

  //Function to check if filter card exist
  checkFilterCardExist(fieldName: string, fieldValue: any) {
    let isExist = false;
    this.searchService.getFilterCards().forEach((existingFilter, existingFilterIndex) => {
      if (existingFilter.alias.indexOf(fieldName) > -1 && existingFilter.selectedValue == fieldValue) {
        isExist = true;
        // return false;
      }

      if (fieldName == 'q_seq_100_cluster_number' && existingFilter.alias.indexOf('q_seq_100_cluster_number') > -1 && existingFilter.selectedValue != fieldValue) {
        this.searchService.removeFilterCard(existingFilterIndex);
      }
    });

    return isExist;
  }

  //Function to get filter card object
  createFilterCardObject(facetKey: string | number, facetValue: any, condition?: any, relation?: any) {
    let facetCardObject: any;
    if (typeof PDBe.SolrApp.searchFields[facetKey] != 'undefined') {
      facetCardObject = Object.assign({}, PDBe.SolrApp.searchFields[facetKey]);
    } else {
      const thisFacetLabel = typeof this.facetOrder[facetKey] != 'undefined' ? this.facetOrder[facetKey].facetLabel : facetKey;
      facetCardObject = Object.assign(
        {},
        {
          label: thisFacetLabel,
          type: 'string',
          condition: 'AND',
          relation: 'Equal to',
        }
      );
    }

    if (typeof facetCardObject.alias == 'undefined') {
      facetCardObject.alias = [facetKey];
    } else {
      facetCardObject.alias.unshift(facetKey);
    }

    if (typeof condition != 'undefined') {
      facetCardObject['condition'] = condition;
    } else if (typeof facetCardObject['condition'] == 'undefined') {
      facetCardObject['condition'] = 'AND';
    }

    if (typeof relation != 'undefined') {
      facetCardObject['relation'] = relation;
    } else if (typeof facetCardObject['relation'] == 'undefined') {
      facetCardObject['relation'] = 'Contains';
      if (facetCardObject.submitFilter == 'processAssemblyType') {
        facetCardObject['relation'] = '=';
      } else {
        if (facetCardObject.type == 'int' || facetCardObject.type == 'float' || facetCardObject.type == 'date') {
          facetCardObject['relation'] = '= range';
        }
      }
    }

    //fix for release year facet which is not in the config
    if ((facetCardObject['relation'] == '= range' || facetCardObject['relation'] == '=') && facetCardObject['type'] == 'string') {
      facetCardObject['type'] = 'int';
    }

    facetCardObject['selectedValue'] = facetValue; //set selected value

    return facetCardObject;
  }

  //Get manager list for query
  getManagerListForQuery(addTotalManager: boolean) {
    let managerListForQuery = [this.tabAttributes[this.activeTabIndex].manager];
    if (addTotalManager && typeof this.tabAttributes[this.activeTabIndex].totalManager != 'undefined') {
      managerListForQuery.push(this.tabAttributes[this.activeTabIndex].totalManager);
    }
    // managerListForQuery = managerListForQuery.concat(this.facetManagerList);
    if (Object.keys(this.facetData).length == 0) {
      managerListForQuery = managerListForQuery.concat(this.facetManagerList);
    }
    return managerListForQuery;
  }

  //Function to add Filter
  addFacetFilterCard(facetKey: string, facetValue: string, condition?: any, relation?: any, invokedFrom?: string) {
    //stop if filter already exist
    if (this.checkFilterCardExist(facetKey, facetValue)) {
      return;
    }

    //Show loader
    this.displayLoading(true);

    //Create new facetcard object
    const newFacetCard = this.createFilterCardObject(facetKey, facetValue, condition, relation);

    //split range value
    if (newFacetCard.relation == '= range' || newFacetCard.relation == '!= range') {
      const valArr = facetValue.split(' - ');
      if (valArr.length == 2) {
        if (valArr[0] == '*' || valArr[1] == '*') {
          newFacetCard.relation = '<=';
          newFacetCard.selectedValue = valArr[1];
          if (valArr[1] == '*') {
            newFacetCard.relation = '>=';
            newFacetCard.selectedValue = valArr[0];
          }
        } else {
          newFacetCard['selectedValue'] = valArr[0];
          newFacetCard['rangeValue2'] = valArr[1];
        }
      } else {
        newFacetCard.relation = '=';
      }
    }

    //Format date
    if (newFacetCard.type == 'date') {
      newFacetCard.selectedValue = new Date(newFacetCard.selectedValue);
      if (newFacetCard.rangeValue2) newFacetCard.rangeValue2 = new Date(newFacetCard.rangeValue2);
    }

    if (newFacetCard.submitFilter == 'processAssemblyType') {
      const polymerNameDict: any = {
        monomer: '1',
        dimer: '2',
        trimer: '3',
        tetramer: '4',
        pentamer: '5',
        hexamer: '6',
        heptamer: '7',
        octamer: '8',
        nonamer: '9',
        decamer: '10',
      };

      if (typeof polymerNameDict[newFacetCard['selectedValue']] != 'undefined') {
        newFacetCard['selectedValue'] = polymerNameDict[newFacetCard['selectedValue']];
      } else {
        newFacetCard['selectedValue'] = newFacetCard['selectedValue'].split('-mer')[0];
      }
    }

    //Add records to the filter card
    this.searchService.addFilterCards(newFacetCard);
    this.filtercards = this.searchService.getFilterCards().slice();

    //filters Updated Flag
    for (let tabIndex = 0, tablen = this.tabAttributes.length; tabIndex < tablen; tabIndex++) {
      this.tabAttributes[tabIndex].filterUpdated = true;
      if (invokedFrom != 'paramLoader') this.tabAttributes[tabIndex].pagination.currentPage = 1;
    }

    //Re-run query, If not invoked from url param loader the generate new query and request
    const queryManagerList = this.getManagerListForQuery(true);
    if (invokedFrom != 'paramLoader') this.generateQuery(queryManagerList);
  }

  //Function to format facet api response into component model
  formatFacetData(facetManagerName: any, facetResult: { facet_counts?: any; facets?: any }, queryUrl: string, maxLength?: number) {
    const facetApiData = facetResult.facet_counts.facet_fields;
    let formattedData: any;
    for (const fieldName in facetApiData) {
      let qFieldName = 'q_' + fieldName;

      //Replace organism_scientific_name with organism_name for advance search form
      if (fieldName == 'organism_scientific_name') {
        qFieldName = 'q_organism_name';
      }

      if (typeof this.facetOrder[qFieldName] != 'undefined' && typeof facetApiData[fieldName] != 'undefined') {
        const title = this.facetOrder[qFieldName]['facetLabel'];
        const titleCount = facetResult.facets[fieldName]; // || Object.keys(facetApiData[fieldName]).length;
        const list = [];
        // var listLength = 0

        if (typeof maxLength == 'undefined') maxLength = 50;

        for (const facetItem in facetApiData[fieldName]) {
          // if(listLength == maxLength)break;
          // listLength++;
          list.push({
            label: facetItem,
            count: facetApiData[fieldName][facetItem],
            otherDetails: {
              field: qFieldName,
              facetTitle: title,
              facetManagerName: facetManagerName,
            },
          });

          delete facetApiData[fieldName][facetItem];
        }

        if (list.length > 0) {
          formattedData = {
            title: title,
            titleCount: titleCount,
            list: list,
            queryUrl: queryUrl,
            // remainingData: facetApiData[fieldName]
          };
        }
      }
    }
    return formattedData;
  }

  //Function to format facet api response into component model
  loadMoreFacetData(facetManagerName: string) {
    const currentRecordsLength = this.facetData[facetManagerName].list.length;
    let newQueryUrl = this.facetData[facetManagerName].queryUrl;

    if (newQueryUrl == '') {
      const selectedSolrManager = this.solrManagerRef[facetManagerName];

      const fcQueryData = this.tabAttributes[this.activeTabIndex].recentQueryData;

      newQueryUrl = fcQueryData.url + '?' + selectedSolrManager.store.string();

      if (fcQueryData.fq) newQueryUrl += '&' + fcQueryData.fq;
      if (fcQueryData.paramCardString) newQueryUrl += '&' + fcQueryData.paramCardString;
    }

    //change offset & limit to 10
    if (currentRecordsLength == 50) {
      newQueryUrl = newQueryUrl.replace('&facet.offset=0&', '&facet.offset=' + currentRecordsLength + '&');
      // newQueryUrl = newQueryUrl.replace('&facet.limit=100&', '&facet.limit=101&');
    } else {
      newQueryUrl = newQueryUrl.replace('&facet.offset=' + (currentRecordsLength - 100) + '&', '&facet.offset=' + currentRecordsLength + '&');
      // newQueryUrl = newQueryUrl.replace('&facet.limit=100&', '&facet.limit=101&');
    }

    //Unsubscribe old api request
    if (this.serviceHook[facetManagerName]) {
      this.serviceHook[facetManagerName].unsubscribe();
      this.serviceHook[facetManagerName] = undefined;
    }

    this.serviceHook[facetManagerName] = this.searchService
      .querySolr(facetManagerName, newQueryUrl)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        if (typeof res == 'undefined' || typeof res.facet_counts == 'undefined') {
          this.facetData[facetManagerName].list = this.facetData[facetManagerName].list.slice();
          this.cd.detectChanges();
          return;
        }

        const totalNormalFacets = Object.keys(res.facet_counts.facet_fields).length;
        const totalRangeFacets = Object.keys(res.facet_counts.facet_ranges).length;

        if (totalNormalFacets > 0 || totalRangeFacets > 0) {
          let moreFormattedFacetData: any;
          if (totalNormalFacets > 0) {
            moreFormattedFacetData = this.formatFacetData(facetManagerName, res, res['queryUrl'], 100);
          } else {
            moreFormattedFacetData = this.formatRangeFacetData(facetManagerName, res, res['queryUrl']);
          }

          if (moreFormattedFacetData.list && moreFormattedFacetData.list.length > 0) {
            /*if(moreFormattedFacetData.titleCount == 101 ){
              this.facetData[facetManagerName].titleCount += moreFormattedFacetData.titleCount;
            }else{
              this.facetData[facetManagerName].titleCount = 100;
            }*/
            this.facetData[facetManagerName].list = this.facetData[facetManagerName].list.concat(moreFormattedFacetData.list);
            this.facetData[facetManagerName].queryUrl = moreFormattedFacetData.queryUrl;
            this.cd.detectChanges();
          }
        }
      });
  }

  //Function to format range facet api response into component model
  formatRangeFacetData(facetManagerName: string, facetResult: { facet_counts: { facet_ranges: any }; facets: { [x: string]: any } }, queryUrl: any) {
    const facetApiData = facetResult.facet_counts.facet_ranges;
    let formattedData: any;
    for (const fieldName in facetApiData) {
      const qFieldName = 'q_' + fieldName;
      if (typeof this.facetOrder[qFieldName] != 'undefined' && typeof facetApiData[fieldName] != 'undefined') {
        const title = this.facetOrder[qFieldName]['facetLabel'];
        const titleCount = facetResult.facets[fieldName]; //Object.keys(facetApiData[fieldName]['counts']).length;
        const list = [];
        // var listLength = 0;
        for (const facetItem in facetApiData[fieldName]['counts']) {
          // if(listLength == 10)break;
          // listLength++;
          list.push({
            label: facetItem + ' - ' + (parseFloat(facetItem) + facetApiData[fieldName]['gap']),
            count: facetApiData[fieldName]['counts'][facetItem],
            otherDetails: {
              field: qFieldName,
              facetTitle: title,
              isRange: true,
              facetManagerName: facetManagerName,
            },
          });
        }

        if (list.length > 0) {
          formattedData = {
            title: title,
            titleCount: titleCount,
            list: list,
          };
        }
      }
    }
    return formattedData;
  }

  //Function to generate Solr query
  generateQuery(solrManagers: string[], invokedFrom?: string): void {
    //reset thor data
    this.resetThorData();

    //Show Tab Loader
    this.displayLoading(true);

    //create param string for query and url update
    this.qValue = 'q=(';
    this.fqValue = 'fq=';
    let paramCardString = '';

    const paramsInUrl: any = {};

    //Iterate filter card fields
    this.sequenceParamFlag = false;
    this.isLatestChemistry = false;
    this.sequenceClustering = false;
    this.filtercards.forEach((fieldData, fcCardIndex) => {
      if (fieldData.alias[0] == 'q_seq_100_cluster_number') {
        this.sequenceClustering = true;
        let fieldValue = fieldData.selectedValue;
        if (/.+\%/.test(fieldData.selectedValue)) fieldValue = fieldData.selectedValue.slice(0, -1);
        this.sequenceClusteringValue = +fieldValue;
        paramsInUrl['q_seq_100_cluster_number'] = [
          {
            value: fieldValue,
            condition1: fieldData.condition,
            condition2: fieldData.relation,
          },
        ];
        return;
      }

      if (fieldData.selectedValue == 'latest_chemistry') {
        this.isLatestChemistry = true;
      }

      //Ignore card if value not defined or blank
      if (typeof fieldData.selectedValue == 'undefined') return;

      //Trim / clean the selected value
      if (fieldData.type != 'date' && fieldData.type != 'int' && fieldData.type != 'float') {
        fieldData.selectedValue = fieldData.selectedValue.trim();
      }

      if (fieldData.selectedValue.toString() == '') return;

      //Ignore card after chip creation if condition is set to ignore
      if (fieldData.condition == 'IGNORE') return;

      //Redirect to Entries Tab if sequence param
      if (fieldData.alias[0] == 'q_fasta_sequence' || fieldData.alias[0] == 'q_phmmer_sequence') {
        this.sequenceParamFlag = true;

        //Remove individual facets
        if (solrManagers.length > 1) {
          const newSolrManagers = [];
          solrManagers.forEach((fcManageName) => {
            if (this.facetManagerList.indexOf(fcManageName as any) == -1) {
              newSolrManagers.push(fcManageName);
            }
          });

          newSolrManagers.push('facetsManager');

          solrManagers = newSolrManagers;
        }

        let sortByVal = 'phmmer(e_value)';
        if (fieldData.alias[0] != 'q_phmmer_sequence') {
          sortByVal = 'fasta(e_value)';
        }

        //update sort data
        if (!invokedFrom || (invokedFrom && invokedFrom !== 'sortEvent')) {
          if (this.activeTabIndex == 0) {
            if (this.tabAttributes[this.activeTabIndex].pagination.sort.options[1].label != 'E-value (asc)') {
              this.tabAttributes[this.activeTabIndex].pagination.sort.options.splice(1, 0, {
                label: 'E-value (desc)',
                value: sortByVal + ' desc',
              });
              this.tabAttributes[this.activeTabIndex].pagination.sort.options.splice(1, 0, {
                label: 'E-value (asc)',
                value: sortByVal + ' asc',
              });
              this.tabAttributes[this.activeTabIndex].pagination.sort.value = sortByVal + ' asc';
            } else if (
              this.tabAttributes[this.activeTabIndex].pagination.sort.options[1].label == 'E-value (asc)' &&
              this.tabAttributes[this.activeTabIndex].pagination.sort.value.split(' ')[0] != sortByVal
            ) {
              this.tabAttributes[this.activeTabIndex].pagination.sort.options[1] = {
                label: 'E-value (asc)',
                value: sortByVal + ' asc',
              };
              this.tabAttributes[this.activeTabIndex].pagination.sort.options[2] = {
                label: 'E-value (desc)',
                value: sortByVal + ' desc',
              };
              this.tabAttributes[this.activeTabIndex].pagination.sort.value = sortByVal + ' asc';
            }

            this.tabAttributes[this.activeTabIndex].pagination.perPage = '100';
          }
        }
      }

      //Process selected value to create fq param
      const processedVal = this.paramProcessingService.processParamValue(fieldData);

      if (typeof fieldData.appendValueToParams != 'undefined' || typeof fieldData.appendValueToFq != 'undefined') {
        if (fieldData.appendValueToParams == true) {
          paramCardString = fieldData.queryField + '=' + processedVal; //+'&bf=phmmer(identity_percent)';
          // paramCardString = processedVal;
        }

        if (typeof fieldData.fqValue != 'undefined') {
          // this.fqValue = fieldData.fqValue;
          this.fqValue == 'fq=' ? (this.fqValue += fieldData.fqValue) : (this.fqValue += '&' + fieldData.fqValue);
        }
      } else {
        //Append AND, OR, NOT condition to q value depending on array index
        if (this.qValue !== '' && this.qValue !== 'q=' && this.qValue !== 'q=(' && fieldData.condition == 'OR') this.qValue += ')';
        if (this.qValue !== '' && this.qValue !== 'q=' && this.qValue !== 'q=(') this.qValue += '%20' + fieldData.condition + '%20';
        if (this.qValue !== '' && this.qValue !== 'q=' && this.qValue !== 'q=(' && fieldData.condition == 'OR') this.qValue += '(';
        this.qValue += processedVal;
      }

      //Add url param for the filter card

      let paramSelectedVal = fieldData.selectedValue;
      if (fieldData.type == 'date') paramSelectedVal = new Date(paramSelectedVal).toISOString();
      if (fieldData.relation == '= range' || fieldData.relation == '!= range') {
        if (fieldData.type == 'date') {
          let dt1 = new Date(fieldData.selectedValue).toISOString();
          let dt2 = new Date(fieldData.rangeValue2).toISOString();
          if (dt1 > dt2) {
            const tempval1 = dt1;
            dt1 = dt2;
            dt2 = tempval1;
          }
          paramSelectedVal = dt1 + ' - ' + dt2;
        } else {
          paramSelectedVal = fieldData.selectedValue + ' - ' + fieldData.rangeValue2;
        }
      }

      if (typeof paramsInUrl[fieldData.alias[0]] == 'undefined') {
        paramsInUrl[fieldData.alias[0]] = [];
      }

      paramsInUrl[fieldData.alias[0]].push({
        value: paramSelectedVal,
        condition1: fieldData.condition,
        condition2: fieldData.relation,
      });
    });

    this.qValue += ')';

    //If not sequence search reset the sort and pagination
    /*if(!this.sequenceParamFlag){

      if(this.activeTabIndex == 0){
        if(this.tabAttributes[this.activeTabIndex].pagination.sort.options[1].label == 'E-value (asc)'){
          this.tabAttributes[this.activeTabIndex].pagination.sort.options.splice(1,2);
        }

        let sortValsList = ['phmmer(e_value) asc', 'phmmer(e_value) desc', 'fasta(e_value) asc', 'fasta(e_value) desc'];

        if(sortValsList.indexOf(this.tabAttributes[this.activeTabIndex].pagination.sort.value) > -1){
          this.tabAttributes[this.activeTabIndex].pagination.sort.value = 'Sort by';
          this.tabAttributes[this.activeTabIndex].pagination.perPage = '10';
        }

      }

    }*/

    if (!this.sequenceParamFlag && !this.sequenceClustering) {
      if (this.activeTabIndex == 0) {
        if (
          this.tabAttributes[this.activeTabIndex].pagination.sort.options[1].label == 'E-value (asc)' ||
          this.tabAttributes[this.activeTabIndex].pagination.sort.options[1].label == 'Cluster rank (asc)'
        ) {
          this.tabAttributes[this.activeTabIndex].pagination.sort.options.splice(1, 2);
        }

        const sortValsList = ['phmmer(e_value) asc', 'phmmer(e_value) desc', 'fasta(e_value) asc', 'fasta(e_value) desc'];
        const sequenceClusteringSortOptions = [
          'seq_100_cluster_rank asc',
          'seq_100_cluster_rank desc',
          'seq_95_cluster_rank asc',
          'seq_95_cluster_rank desc',
          'seq_90_cluster_rank asc',
          'seq_90_cluster_rank desc',
          'seq_70_cluster_rank asc',
          'seq_70_cluster_rank desc',
          'seq_50_cluster_rank asc',
          'seq_50_cluster_rank desc',
          'seq_40_cluster_rank asc',
          'seq_40_cluster_rank desc',
          'seq_30_cluster_rank asc',
          'seq_30_cluster_rank desc',
        ];

        if (
          sortValsList.indexOf(this.tabAttributes[this.activeTabIndex].pagination.sort.value) > -1 ||
          sequenceClusteringSortOptions.indexOf(this.tabAttributes[this.activeTabIndex].pagination.sort.value) > -1
        ) {
          this.tabAttributes[this.activeTabIndex].pagination.sort.value = 'Sort by';
          this.tabAttributes[this.activeTabIndex].pagination.perPage = '10';
        }
      }
    }

    //If latest_chemistry change pivot manager
    if (this.isLatestChemistry) {
      if (solrManagers.indexOf('compoundsManager') > -1) {
        solrManagers[solrManagers.indexOf('compoundsManager')] = 'compoundsForLatestChemManager';
        solrManagers[solrManagers.indexOf('compoundsTotalManager')] = 'compoundsForLatestChemTotalManager';
      }
    } else {
      if (solrManagers.indexOf('compoundsForLatestChemManager') > -1) {
        solrManagers[solrManagers.indexOf('compoundsForLatestChemManager')] = 'compoundsManager';
        solrManagers[solrManagers.indexOf('compoundsForLatestChemTotalManager')] = 'compoundsTotalManager';
      }
    }

    //If sequence clustring
    if (this.sequenceClustering && this.activeTabIndex == 0) {
      this.fqValue == 'fq='
        ? (this.fqValue += 'seq_' + this.sequenceClusteringValue + '_cluster_number:[* TO *]')
        : (this.fqValue += '&seq_' + this.sequenceClusteringValue + '_cluster_number:[* TO *]');

      //update sort data
      const seqSortVal = 'seq_' + this.sequenceClusteringValue + '_cluster_rank';
      if (this.tabAttributes[0].pagination.sort.options[1].label != 'Cluster rank (asc)') {
        this.tabAttributes[0].pagination.sort.options.splice(1, 0, {
          label: 'Cluster rank (desc)',
          value: seqSortVal + ' desc',
        });
        this.tabAttributes[0].pagination.sort.options.splice(1, 0, {
          label: 'Cluster rank (asc)',
          value: seqSortVal + ' asc',
        });
        this.tabAttributes[0].pagination.sort.value = seqSortVal + ' asc';
      }

      // this.tabAttributes[this.activeTabIndex].pagination.perPage = '100';
    }

    let message = '';
    let emptyFacet = false;
    if (this.qValue == 'q=()') this.qValue = 'q=';
    if (this.qValue != 'q=' || this.fqValue != 'fq=' || paramCardString != '') {
      //Update route state with url params
      const tabParams: any = {
        tabIndex: this.activeTabIndex,
        paginationIndex: this.tabAttributes[this.activeTabIndex].pagination.currentPage,
        perPage: this.tabAttributes[this.activeTabIndex].pagination.perPage,
      };

      if (typeof this.tabAttributes[this.activeTabIndex].pagination.sort != 'undefined') {
        tabParams['sortBy'] = this.tabAttributes[this.activeTabIndex].pagination.sort.value;
      }

      paramsInUrl['resultState'] = tabParams;
      this.router.navigate([], {
        queryParams: { searchParams: JSON.stringify(paramsInUrl), view: 'macromolecules' },
        queryParamsHandling: '',
      });

      if (this.activeTabIndex != 0 && this.sequenceParamFlag) {
        message = 'Sequence search is currently not available for this section!';
      } else {
        message = '';
        this.doSolrRequest(solrManagers, paramCardString, this.qValue, this.fqValue);
      }
    } else {
      message = this.tabAttributes[this.activeTabIndex].addFilterMsg;
      emptyFacet = true;
    }

    if (message != '') {
      this.tabAttributes[this.activeTabIndex].currentMessage = message;
      this.tabAttributes[this.activeTabIndex].resultCardData = undefined;
      if (emptyFacet) {
        this.facetData = {};
        this.activeFacetManager = '';
        //Emit event for mobile facet menu
        this._eventBroker.emit<any>('facet-data-update', this.facetData);
      }

      setTimeout(() => {
        this.displayLoading(false);
        this.cd.detectChanges();
      }, this.loaderPauseTime);
    }
  }

  //Funtion to make Solr request and process the result
  doSolrRequest(solrManagers: any[], paramCardString: string, qValue: string, fqValue: string) {
    solrManagers.forEach((managerName) => {
      let managerStoreParams = '';
      let newQVal = qValue;
      let factTagFqStr = '';
      const selectedSolrManager = this.solrManagerRef[managerName];
      const url = selectedSolrManager.solrUrl + 'select';
      if (managerName == 'entriesManager') {
        //Set rows param for records per page
        selectedSolrManager.store.remove('rows');
        selectedSolrManager.store.addByValue('rows', this.tabAttributes[this.activeTabIndex].pagination.perPage);

        //Set start param for pagination
        selectedSolrManager.store.remove('start');
        selectedSolrManager.store.addByValue(
          'start',
          (this.tabAttributes[this.activeTabIndex].pagination.currentPage - 1) * parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage)
        );

        //Set sort
        selectedSolrManager.store.remove('sort');
        if (this.tabAttributes[this.activeTabIndex].pagination.sort != undefined && this.tabAttributes[this.activeTabIndex].pagination.sort.value != 'Sort by') {
          selectedSolrManager.store.addByValue('sort', this.tabAttributes[this.activeTabIndex].pagination.sort.value);
        }
      } else if (
        managerName == 'macroMoleculesManager' ||
        managerName == 'compoundsManager' ||
        managerName == 'proteinFamiliesManager' ||
        managerName == 'compoundsForLatestChemManager'
      ) {
        if (typeof fqValue != 'undefined') {
          if (fqValue == '' || fqValue == 'fq=') {
            fqValue = 'fq=status:REL';
          } else {
            fqValue += ' AND status:REL';
          }
        }

        const fieldByManager: any = {
          macroMoleculesManager: {
            limit: 'f.molecule_name.facet.limit',
            offset: 'f.molecule_name.facet.offset',
          },
          compoundsManager: {
            limit: 'f.interacting_ligands.facet.limit',
            offset: 'f.interacting_ligands.facet.offset',
          },
          proteinFamiliesManager: {
            limit: 'f.pfam_name.facet.limit',
            offset: 'f.pfam_name.facet.offset',
          },
          compoundsForLatestChemManager: {
            limit: 'f.new_revised_ligand.facet.limit',
            offset: 'f.new_revised_ligand.facet.offset',
          },
        };

        //Set rows param for records per page
        selectedSolrManager.store.remove(fieldByManager[managerName].limit);
        selectedSolrManager.store.addByValue(fieldByManager[managerName].limit, parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage));

        //Set start param for pagination
        selectedSolrManager.store.remove(fieldByManager[managerName].offset);
        selectedSolrManager.store.addByValue(
          fieldByManager[managerName].offset,
          (this.tabAttributes[this.activeTabIndex].pagination.currentPage - 1) * parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage)
        );

        // console.log(newQVal)
      }

      //remove default q and fq parameters from the manager
      selectedSolrManager.store.remove('q');
      selectedSolrManager.store.remove('fq');

      //Query Url sections
      const queryUrlSection = [];

      //Get manager store paramters
      // if(this.sequenceClustering && this.clusteringExceptions.indexOf(managerName) == -1){
      if (this.sequenceClustering && this.activeTabIndex == 0) {
        const oldGrpVal = selectedSolrManager.store.values('group.field');
        //Set group by and fl
        selectedSolrManager.store.remove('group.field');
        selectedSolrManager.store.addByValue('group.field', 'seq_' + this.sequenceClusteringValue + '_cluster_number');

        const flArr1 = selectedSolrManager.store.values('fl')[0];

        if (typeof flArr1 != 'undefined') {
          flArr1.push('seq_' + this.sequenceClusteringValue + '_cluster_number');
          flArr1.push('seq_' + this.sequenceClusteringValue + '_cluster_rank');
          selectedSolrManager.store.remove('fl');
          selectedSolrManager.store.addByValue('fl', flArr1);
        }
        managerStoreParams = selectedSolrManager.store.string();

        //Reset group by and fl
        selectedSolrManager.store.remove('group.field');
        selectedSolrManager.store.addByValue('group.field', oldGrpVal);

        if (typeof flArr1 != 'undefined') {
          flArr1.pop('seq_' + this.sequenceClusteringValue + '_cluster_number');
          flArr1.pop('seq_' + this.sequenceClusteringValue + '_cluster_rank');
          selectedSolrManager.store.remove('fl');
          if (flArr1.length > 0) selectedSolrManager.store.addByValue('fl', flArr1);
        }
      } else {
        managerStoreParams = selectedSolrManager.store.string();
      }

      //modifiy fq for citation year facet
      if (managerName == 'citationYearFacetManager') {
        factTagFqStr = ''; //'{!collapse%20field=pdb_id}';
      } else {
        factTagFqStr = '';
      }

      //Push url sections in array
      if (typeof managerStoreParams != 'undefined' && managerStoreParams != '') queryUrlSection.push(managerStoreParams);
      if (typeof paramCardString != 'undefined' && paramCardString != '') {
        queryUrlSection.push(paramCardString);
        if (typeof newQVal == 'undefined' || newQVal == '' || newQVal == 'q=') newQVal = 'q=*:*';
      }
      //For facet query add
      if (managerName == 'facetsManager') {
        const fctNameArr: any[] = [];
        this.facetManagerList.forEach((fcManageName) => {
          const facetFieldName = this.solrManagerRef[fcManageName].store.values('facet.field')[0] || this.solrManagerRef[fcManageName].store.values('facet.range')[0];
          if (typeof facetFieldName != 'undefined') fctNameArr.push(facetFieldName + ' : "unique(' + facetFieldName + ')"');
        });

        if (fctNameArr.length > 0) {
          newQVal = newQVal + '&json.facet={' + fctNameArr.join(', ') + '}';
        }
      } else if (this.facetManagerList.indexOf(managerName) != -1) {
        const facetFieldName = this.solrManagerRef[managerName].store.values('facet.field')[0] || this.solrManagerRef[managerName].store.values('facet.range')[0];
        if (typeof facetFieldName != 'undefined') newQVal = newQVal + '&json.facet={' + facetFieldName + ' : "unique(' + facetFieldName + ')"}';
      }
      if (typeof newQVal != 'undefined' && newQVal != '') queryUrlSection.push(newQVal);

      if (factTagFqStr != '') {
        if (typeof fqValue == 'undefined' || fqValue == '') {
          factTagFqStr == 'fq=' + factTagFqStr;
        } else if (fqValue == 'fq=') {
          factTagFqStr == 'fq=' + factTagFqStr;
        } else {
          factTagFqStr == fqValue + '&' + factTagFqStr;
        }

        queryUrlSection.push(factTagFqStr);
      } else {
        if (typeof fqValue != 'undefined' && fqValue != '' && fqValue != 'fq=') queryUrlSection.push(fqValue);
      }

      // queryUrlSection.push('q=*:*');
      // queryUrlSection.push(qValue.replace('q=','fq='));

      this.completeQuery = url + '?' + queryUrlSection.join('&') + '&wt=json';

      //Unsubscribe old api request
      if (this.serviceHook[managerName]) {
        this.serviceHook[managerName].unsubscribe();
        this.serviceHook[managerName] = undefined;
      }

      //Download query data object
      const downloadQueryData = {
        url: url,
        q: newQVal,
        fq: fqValue,
        paramCardString: paramCardString,
      };

      this.serviceHook[managerName] = this.searchService
        .querySolr(managerName, this.completeQuery, downloadQueryData)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(
          (res: any) => {
            if (typeof res == 'undefined') return;

            //save the query url for download
            if (res['managerName'] == this.tabAttributes[this.activeTabIndex].manager) {
              this.tabAttributes[this.activeTabIndex].recentQueryData = res['downloadQueryData'];
            }

            //If solr response failed
            if (typeof res.error != 'undefined') {
              if (res.managarName == this.tabAttributes[this.activeTabIndex].manager) {
                this.tabAttributes[this.activeTabIndex].resultCardData = undefined;
                this.tabAttributes[this.activeTabIndex].currentMessage = res.error;

                setTimeout(() => {
                  this.displayLoading(false);
                }, this.loaderPauseTime);
              }
              return;
            }

            const managerfacetIndex = this.facetManagerList.indexOf(res['managerName']);
            if (managerfacetIndex >= 0 || res['managerName'] == 'facetsManager') {
              const totalNormalFacets = Object.keys(res.facet_counts.facet_fields).length;
              const totalRangeFacets = Object.keys(res.facet_counts.facet_ranges).length;

              if (totalNormalFacets > 0 || totalRangeFacets > 0) {
                //If Not All FacetManager
                if (res['managerName'] != 'facetsManager') {
                  let formatedFacetData: any;
                  if (totalNormalFacets > 0) {
                    formatedFacetData = this.formatFacetData(res['managerName'], res, res['queryUrl']);
                  } else {
                    formatedFacetData = this.formatRangeFacetData(res['managerName'], res, res['queryUrl']);
                  }

                  if (typeof formatedFacetData != 'undefined') {
                    this.facetData[res['managerName']] = Object.assign({}, formatedFacetData);

                    if (this.activeFacetManager == '') {
                      this.activeFacetManager = res['managerName'];
                      this.activeFacetIndex = managerfacetIndex;
                    } else {
                      if (managerfacetIndex < this.activeFacetIndex) {
                        this.activeFacetManager = res['managerName'];
                        this.activeFacetIndex = managerfacetIndex;
                      }
                    }
                  }

                  //If All FacetManager
                } else {
                  if (totalNormalFacets > 0) {
                    for (const fctField in res.facet_counts.facet_fields) {
                      let fctFieldValue = {};
                      // fctFieldValue[fctField] = res.facet_counts.facet_fields[fctField];
                      const facetDataObj: any = {
                        facet_counts: {
                          facet_fields: {},
                        },
                        facets: {},
                      };

                      facetDataObj.facet_counts.facet_fields[fctField] = res.facet_counts.facet_fields[fctField];
                      facetDataObj.facets[fctField] = res.facets[fctField];
                      fctFieldValue = facetDataObj;

                      const fcRecord = this.facetOrder['q_' + fctField];
                      if (typeof fcRecord == 'undefined') continue;
                      const fcManagerName = fcRecord.solrManager;

                      const formatedFacetData2 = this.formatFacetData(fcManagerName, fctFieldValue, '');

                      if (typeof formatedFacetData2 != 'undefined') {
                        this.facetData[fcManagerName] = Object.assign({}, formatedFacetData2);

                        if (this.activeFacetManager == '') {
                          this.activeFacetManager = fcManagerName;
                          this.activeFacetIndex = this.facetManagerList.indexOf(fcManagerName);
                        } else {
                          if (this.facetManagerList.indexOf(fcManagerName) < this.activeFacetIndex) {
                            this.activeFacetManager = fcManagerName;
                            this.activeFacetIndex = this.facetManagerList.indexOf(fcManagerName);
                          }
                        }
                      }
                    }
                  }
                }

                //Emit event for mobile facet menu
                this.cd.detectChanges();
                this._eventBroker.emit<any>('facet-data-update', this.facetData);
              }
            } else if (res['managerName'] == 'entriesManager') {
              const groupedByField = 'pdb_id';
              if (this.sequenceClustering) {
                const field = 'seq_' + this.sequenceClusteringValue + '_cluster_number';
                const resData = res.grouped[field];
                delete res.grouped[field];
                res.grouped['pdb_id'] = resData;
              }

              this.tabAttributes[this.activeTabIndex].resultCardData = res;
              this.tabAttributes[this.activeTabIndex].pagination.totalPages = Math.ceil(
                parseInt(res.grouped[groupedByField].ngroups) / parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage)
              );
              this.tabAttributes[this.activeTabIndex].pagination.totalRecords = res.grouped[groupedByField].ngroups;
              this.tabAttributes[this.activeTabIndex].pagination.pages = this.visiblePageNumbers();
              this.tabAttributes[this.activeTabIndex].filterUpdated = false;

              if (
                typeof res.grouped[groupedByField].ngroups == 'undefined' ||
                (typeof res.grouped[groupedByField].ngroups != 'undefined' && res.grouped[groupedByField].ngroups == 0)
              ) {
                this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].emptyResultMsg;
              }

              this.tabAttributes[this.activeTabIndex].pagination = Object.assign({}, this.tabAttributes[this.activeTabIndex].pagination);

              setTimeout(() => {
                this.displayLoading(false);
                this.cd.detectChanges(); //Trigger change detection
              }, this.loaderPauseTime);

              //Get Claims Info For Result Entries
              //this.getClaimsInfoForResultEntries(res); //commented THOR
            } else if (
              res['managerName'] == 'macroMoleculesTotalManager' ||
              res['managerName'] == 'compoundsTotalManager' ||
              res['managerName'] == 'proteinFamiliesTotalManager' ||
              res['managerName'] == 'compoundsForLatestChemTotalManager'
            ) {
              /*if(res.facet_counts && res.facet_counts.facet_pivot){

              var currentPivotManager = this.solrManagerRef[res['managerName']];
              var currentPivotResultKey = currentPivotManager.store.values('facet.pivot')[0];

              var facetCount = res.facet_counts.facet_pivot[currentPivotResultKey].length;
              this.tabAttributes[this.activeTabIndex].pagination.totalPages = Math.ceil(facetCount / parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage));
              this.tabAttributes[this.activeTabIndex].pagination.totalRecords = facetCount;
              this.tabAttributes[this.activeTabIndex].pagination.pages = this.visiblePageNumbers();
              this.tabAttributes[this.activeTabIndex].pagination = Object.assign({}, this.tabAttributes[this.activeTabIndex].pagination);
              this.cd.detectChanges(); //Trigger change detection
            }*/

              // let keyMapping = {
              //   macroMoleculesTotalManager: 'molecule_name',
              //   compoundsTotalManager: 'interacting_ligands',
              //   proteinFamiliesTotalManager: 'pfam_name',
              //   compoundsForLatestChemTotalManager: 'new_revised_ligand'
              // }

              if (res.facet_counts && res.facet_counts.facet_fields) {
                const currentPivotManager = this.solrManagerRef[res['managerName']];
                const currentPivotResultKey = currentPivotManager.store.values('facet.field')[0];

                const facetCount = Object.keys(res.facet_counts.facet_fields[currentPivotResultKey]).length;
                this.tabAttributes[this.activeTabIndex].pagination.totalPages = Math.ceil(
                  facetCount / parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage)
                );
                this.tabAttributes[this.activeTabIndex].pagination.totalRecords = facetCount;
                this.tabAttributes[this.activeTabIndex].pagination.pages = this.visiblePageNumbers();
                this.tabAttributes[this.activeTabIndex].pagination = Object.assign({}, this.tabAttributes[this.activeTabIndex].pagination);
                this.cd.detectChanges(); //Trigger change detection
              }
            } else if (res['managerName'] == 'pivotEntriesManager') {
              //order result by pivot results
              const orderedRes: any[] = [];

              if (res.grouped && res.grouped.entry_entity && res.grouped.entry_entity.groups && res.grouped.entry_entity.groups.length > 0) {
                const pivotResCardData = this.tabAttributes[this.activeTabIndex].resultCardData;
                pivotResCardData.sortOrder.forEach((sortOrderValue: any, sortIndex: any) => {
                  res.grouped.entry_entity.groups.forEach((entryData: any, entryDataIndex: number) => {
                    if (sortOrderValue == entryData.groupValue) {
                      orderedRes[sortIndex] = Object.assign({}, entryData.doclist.docs[0]);
                      // return false;
                    }
                  });
                  //Merge pivot data
                  orderedRes[sortIndex]['bestEntry'] = pivotResCardData.pivotData[sortIndex].bestEntry;
                  orderedRes[sortIndex]['compoundTitle'] = pivotResCardData.pivotData[sortIndex].compoundTitle;
                  orderedRes[sortIndex]['proteinTitle'] = pivotResCardData.pivotData[sortIndex].proteinTitle;
                  orderedRes[sortIndex]['otherEntries'] = pivotResCardData.pivotData[sortIndex].otherEntries;
                });
              }

              this.tabAttributes[this.activeTabIndex].resultCardData.entriesData = orderedRes;

              this.tabAttributes[this.activeTabIndex].filterUpdated = false;

              setTimeout(() => {
                this.displayLoading(false);
                this.cd.detectChanges(); //Trigger change detection
              }, this.loaderPauseTime);
            } else {
              const pivotManager = this.solrManagerRef[res['managerName']];
              const pivotResultKey = pivotManager.store.values('facet.pivot')[0];

              //Pivot query result
              const pivotResultArray = res.facet_counts.facet_pivot[pivotResultKey];

              // const entriesQuery = 'q=';
              const pivotData: any[] = [];
              const sortOrder: any[] = [];
              const entriesQueryArr: any[] = [];
              pivotResultArray.forEach((pivotResult: any, pivotRecIndex: any) => {
                const pivotRecTemplate = {
                  compoundTitle: '',
                  proteinTitle: '',
                  bestEntry: '',
                  otherEntries: [],
                };

                const pivotRec: any[] = [];

                //Save title
                const pivotEntryData = [];
                if (res['managerName'] == 'macroMoleculesManager') {
                  pivotRec.push(pivotRecTemplate);
                  pivotRec[0].proteinTitle = pivotResult.value;
                  pivotEntryData[0] = pivotResult.pivot;
                } else {
                  const totPivots = pivotResult.pivot.length;

                  for (let pi = 0; pi < totPivots; pi++) {
                    pivotRec.push(Object.assign({}, pivotRecTemplate));
                    pivotRec[pi].compoundTitle = pivotResult.value;
                    pivotRec[pi].proteinTitle = pivotResult.pivot[pi].value;
                    pivotEntryData[pi] = pivotResult.pivot[pi].pivot;
                  }
                }

                //Iterate over pivot array to get pdb ids
                pivotEntryData.forEach((pivotDataRec, pivotDataIndex) => {
                  pivotRec[pivotDataIndex].otherEntries = pivotRec[pivotDataIndex].otherEntries.slice();
                  pivotDataRec.forEach((pivotVal: { pivot: any[] }, pivotValIndex: number) => {
                    // if(pivotValIndex == 0){
                    //   pivotRec[pivotDataIndex].bestEntry = pivotVal.pivot[0].value;
                    // }else{
                    //   pivotRec[pivotDataIndex].otherEntries.push(pivotVal.pivot[0].value);
                    // }

                    //Iterate over inner pivotval
                    pivotVal.pivot.forEach((pivotEntryData, pivotEntryDataIndex) => {
                      if (pivotValIndex == 0 && pivotEntryDataIndex == 0) {
                        pivotRec[pivotDataIndex].bestEntry = pivotEntryData.value;
                      } else {
                        pivotRec[pivotDataIndex].otherEntries.push(pivotEntryData.value);
                      }
                    });
                  });

                  //Add value in the array for sort order
                  sortOrder.push(pivotRec[pivotDataIndex].bestEntry);

                  //Add value to entriesQuery
                  // entriesQueryArr.push('entry_entity:'+pivotRec[pivotDataIndex].bestEntry)
                  entriesQueryArr.push(pivotRec[pivotDataIndex].bestEntry);
                  // entriesQuery == 'q=' ? entriesQuery += 'entry_entity:'+pivotRec[pivotDataIndex].bestEntry : entriesQuery += ' OR entry_entity:'+pivotRec[pivotDataIndex].bestEntry;

                  //Add the pivot record to pivot data object
                  pivotData.push(pivotRec[pivotDataIndex]);
                });
              });

              this.tabAttributes[this.activeTabIndex].resultCardData = {
                pivotData: pivotData,
                entriesData: [],
                sortOrder: sortOrder,
              };

              if (sortOrder.length > 0) {
                // console.log(entriesQuery);
                // console.log(entriesQueryArr);

                // if(entriesQueryArr.length > 100){
                //   let entriesArrAplit = this.arrayChunk(entriesQueryArr, 100);
                //   entriesArrAplit.forEach(arrChunck => {
                //     this.doSolrRequest (['pivotEntriesManager'], '', 'q='+arrChunck.join(' OR '), '');
                //   });
                // }else{
                //   this.doSolrRequest (['pivotEntriesManager'], '', 'q='+entriesQueryArr.join(' OR '), '');
                // }

                // this.doSolrRequest (['pivotEntriesManager'], '', 'q='+entriesQueryArr.join(' OR '), '');
                this.doSolrRequest(['pivotEntriesManager'], '', 'q=*:*', 'fq=entry_entity:(' + entriesQueryArr.join(' or ') + ')');
              } else {
                this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].emptyResultMsg;
                setTimeout(() => {
                  this.displayLoading(false);
                  this.cd.detectChanges(); //Trigger change detection
                }, this.loaderPauseTime);
              }
            }
          },
          (error) => {
            if (
              typeof error.managarName != 'undefined' &&
              (error.managarName == 'entriesManager' ||
                error.managarName == 'compoundsManager' ||
                error.managarName == 'proteinFamiliesManager' ||
                error.managarName == 'macroMoleculesManager' ||
                error.managarName == 'compoundsForLatestChemManager')
            ) {
              this.tabAttributes[this.activeTabIndex].resultCardData = undefined;
              this.tabAttributes[this.activeTabIndex].currentMessage = error.error;
              this.displayLoading(false);
              this.cd.detectChanges(); //Trigger change detection
            }
          }
        );
    });
  }

  visiblePageNumbers() {
    const innerWindow = 1;
    const outerWindow = 0;
    let windowFrom = this.tabAttributes[this.activeTabIndex].pagination.currentPage - innerWindow;
    let windowTo = this.tabAttributes[this.activeTabIndex].pagination.currentPage + innerWindow;

    // If the window is truncated on one side, make the other side longer
    if (windowTo > this.tabAttributes[this.activeTabIndex].pagination.totalPages) {
      windowFrom = Math.max(0, windowFrom - (windowTo - this.tabAttributes[this.activeTabIndex].pagination.totalPages));
      windowTo = this.tabAttributes[this.activeTabIndex].pagination.totalPages;
    }
    if (windowFrom < 1) {
      windowTo = Math.min(this.tabAttributes[this.activeTabIndex].pagination.totalPages, windowTo + (1 - windowFrom));
      windowFrom = 1;
    }

    const visible = [];

    // Always show the first page
    visible.push(1);
    // Don't add inner window pages twice
    for (let i = 2; i <= Math.min(1 + outerWindow, windowFrom - 1); i++) {
      visible.push(i);
    }
    // If the gap is just one page, close the gap
    if (1 + outerWindow == windowFrom - 2) {
      visible.push(windowFrom - 1);
    }
    // Don't add the first or last page twice
    for (let i = Math.max(2, windowFrom); i <= Math.min(windowTo, this.tabAttributes[this.activeTabIndex].pagination.totalPages - 1); i++) {
      visible.push(i);
    }
    // If the gap is just one page, close the gap
    if (this.tabAttributes[this.activeTabIndex].pagination.totalPages - outerWindow == windowTo + 2) {
      visible.push(windowTo + 1);
    }
    // Don't add inner window pages twice
    for (
      let i = Math.max(this.tabAttributes[this.activeTabIndex].pagination.totalPages - outerWindow, windowTo + 1);
      i < this.tabAttributes[this.activeTabIndex].pagination.totalPages;
      i++
    ) {
      visible.push(i);
    }
    // Always show the last page, unless it's the first page
    if (this.tabAttributes[this.activeTabIndex].pagination.totalPages > 1) {
      visible.push(this.tabAttributes[this.activeTabIndex].pagination.totalPages);
    }

    const links = [];

    let prev = null;

    for (let i = 0, l = visible.length; i < l; i++) {
      if (prev && visible[i] > prev + 1) links.push(-1);
      links.push(visible[i]);
      prev = visible[i];
    }

    return links;
  }

  updateTabDetailsInUrl() {
    //Update route state with url params
    const paramKey = 'resultState';
    const tabParams: any = {
      tabIndex: this.activeTabIndex,
      paginationIndex: this.tabAttributes[this.activeTabIndex].pagination.currentPage,
      perPage: this.tabAttributes[this.activeTabIndex].pagination.perPage,
    };

    if (typeof this.tabAttributes[this.activeTabIndex].pagination.sort != 'undefined') {
      tabParams['sortBy'] = '"' + this.tabAttributes[this.activeTabIndex].pagination.sort.value + '"';
    }

    const routeParamObj = this.router.routerState.snapshot.root.queryParams;
    const params = Object.assign({}, routeParamObj);
    if (typeof params['searchParams'] != 'undefined') {
      const searchParamObj = JSON.parse(this.router.routerState.snapshot.root.queryParams['searchParams']);
      searchParamObj[paramKey] = tabParams;
      params['searchParams'] = JSON.stringify(searchParamObj);
    } else {
      params['searchParams'] = JSON.stringify({ paramKey: tabParams });
    }

    this.router.navigate([''], { queryParams: params });
  }

  paginateTo(paginate: { source: string; pageIndex: number }) {
    if (paginate.source == 'arrow') {
      if (paginate.pageIndex == -1 && this.tabAttributes[this.activeTabIndex].pagination.currentPage == 1) return;
      if (paginate.pageIndex == 1 && this.tabAttributes[this.activeTabIndex].pagination.currentPage == this.tabAttributes[this.activeTabIndex].pagination.totalPages)
        return;

      this.tabAttributes[this.activeTabIndex].pagination.currentPage = this.tabAttributes[this.activeTabIndex].pagination.currentPage + paginate.pageIndex;
    } else {
      if (this.tabAttributes[this.activeTabIndex].pagination.currentPage == paginate.pageIndex) return;
      this.tabAttributes[this.activeTabIndex].pagination.currentPage = paginate.pageIndex;
    }

    this.tabAttributes[this.activeTabIndex].pagination.pages = this.visiblePageNumbers();
    this.tabAttributes[this.activeTabIndex].pagination = Object.assign({}, this.tabAttributes[this.activeTabIndex].pagination);
    // this.cd.detectChanges();
    this.generateQuery([this.tabAttributes[this.activeTabIndex].manager]);
  }

  onTabChange(e: any) {
    const oldTabIndex = this.activeTabIndex;
    this.showTabLoader = true;
    this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].loadingMsg;
    this.activeTabIndex = e.index;

    if (this.tabAttributes[this.activeTabIndex].filterUpdated == true) {
      let queryManagerList = this.getManagerListForQuery(true);

      if ((oldTabIndex == 0 && this.activeTabIndex > 0) || (oldTabIndex > 0 && this.activeTabIndex == 0)) {
        queryManagerList = queryManagerList.concat(this.facetManagerList);
      }

      this.generateQuery(queryManagerList);
    } else {
      //Redo facet query if sequence clustering
      if (this.sequenceClustering) {
        if ((oldTabIndex == 0 && this.activeTabIndex > 0) || (oldTabIndex > 0 && this.activeTabIndex == 0)) {
          this.generateQuery(this.facetManagerList);
        }
      }

      //update url
      this.updateTabDetailsInUrl();

      setTimeout(() => {
        this.displayLoading(false);
        this.cd.detectChanges();
      }, this.loaderPauseTime);
    }
  }

  onTabFocus(e: { index: any }) {
    setTimeout(() => {
      const tabs = ['entries', 'macromolecules', 'compounds', 'protein_families'];
      gtag('event', 'tab_' + tabs[e.index] + '_selected');
    }, 100);
  }

  sortResultsBy(data: { sortByValue: any }) {
    this.showTabLoader = true;
    this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].loadingMsg;

    //reset to page 1
    this.tabAttributes[this.activeTabIndex].pagination.currentPage = 1;

    //Generate Query
    this.generateQuery([this.tabAttributes[this.activeTabIndex].manager], 'sortEvent');

    //Recalculate pagination for pivot tabs
    if (this.activeTabIndex > 0) {
      const facetCount = this.tabAttributes[this.activeTabIndex].pagination.totalRecords;
      this.tabAttributes[this.activeTabIndex].pagination.totalPages = Math.ceil(facetCount / parseInt(this.tabAttributes[this.activeTabIndex].pagination.perPage));
      this.tabAttributes[this.activeTabIndex].pagination.pages = this.visiblePageNumbers();
      this.tabAttributes[this.activeTabIndex].pagination = Object.assign({}, this.tabAttributes[this.activeTabIndex].pagination);
    }

    if (data.sortByValue === 1) {
      gtag('event', 'results_per_page_' + this.tabAttributes[this.activeTabIndex].pagination.perPage);
    } else {
      gtag('event', 'sort_by_' + data.sortByValue.split(' ').join('_'));
    }
  }

  reloadTab(onPageReload?: boolean) {
    this.showTabLoader = true;

    this.tabAttributes[this.activeTabIndex].currentMessage = this.tabAttributes[this.activeTabIndex].loadingMsg;

    this.cd.detectChanges();

    if (onPageReload != true) {
      for (let tabIndex = 0, tablen = this.tabAttributes.length; tabIndex < tablen; tabIndex++) {
        this.tabAttributes[tabIndex].filterUpdated = true;
        this.tabAttributes[tabIndex].pagination.currentPage = 1;
      }
    }

    let queryManagerList = [this.tabAttributes[this.activeTabIndex].manager];
    if (typeof this.tabAttributes[this.activeTabIndex].totalManager != 'undefined') {
      queryManagerList.push(this.tabAttributes[this.activeTabIndex].totalManager);
    }
    queryManagerList = queryManagerList.concat(this.facetManagerList);
    this.generateQuery(queryManagerList);
  }

  openOrcidDialog() {
    const dialogRef = this.dialog.open(OrcidClaimDialogComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      const newThorInfo = this.thorService.getThorInfo();
      this.thorInfo = Object.assign({}, newThorInfo);
      if (this.thorInfo.entriesToClaim.length == 0) {
        for (const selectEntryKey in this.tabAttributes[this.activeTabIndex].selectAllEntries) {
          this.tabAttributes[this.activeTabIndex].selectAllEntries[selectEntryKey] = false;
        }
        this.selectAllEntriesChange();
      }
      this.cd.detectChanges();
    });
  }

  openSearchForm() {
    const searchFormDialogRef = this.dialog.open(SearchFormDialogComponent, {
      disableClose: false,
      panelClass: 'searchFormDialog',
    });
    searchFormDialogRef.afterClosed().subscribe((action) => {
      if (action == 'submit') {
        this.facetData = {};
        this.activeFacetManager = '';
        //reload search params
        this.filtercards = this.searchService.getFilterCards();

        //Trigger change detection
        this.cd.markForCheck();

        //reload tab
        this.reloadTab();

        this.filtercards.forEach((c) => {
          // console.log(c.alias[0])
          // Capture Google Analytics event
          gtag('event', 'search_form_field_' + c.alias[0]);
        });
      }

      gtag('event', 'search_form_canceled');
    });

    gtag('event', 'search_form_opened');
  }

  openDownloadDialog() {
    this.dialog.open(DownloadResultDialogComponent, {
      disableClose: false,
      data: {
        solrQueryData: this.tabAttributes[this.activeTabIndex].recentQueryData,
        selectedEntries: this.thorService.getThorInfo()['entriesToClaim'],
      },
    });

    gtag('event', 'download_popup_open');
  }

  selectAllEntriesChange() {
    //Emit event for result cards
    const currentPage = this.tabAttributes[this.activeTabIndex].pagination.currentPage;
    this._eventBroker.emit<boolean>('select-all-entries-updated', this.tabAttributes[this.activeTabIndex].selectAllEntries[currentPage]);
  }

  //Function to add filter on facet selection
  onFacetSelect(selectedItem: {
    action: any;
    details: { facetManagerName: string; facetTitle: string };
    otherDetails: { field: string; isRange: boolean; facetTitle: string };
    label: string;
  }) {
    if (typeof selectedItem == 'undefined') {
      return;
    }
    if (typeof selectedItem.action != 'undefined') {
      this.loadMoreFacetData(selectedItem.details.facetManagerName);
      gtag('event', 'filters_more_for_' + selectedItem.details.facetTitle.toLowerCase().split(' ').join('_'));
    } else {
      //remove facet if new filter
      if (!this.checkFilterCardExist(selectedItem.otherDetails.field, selectedItem.label)) {
        this.facetData = Object.assign({}, {});
        this.activeFacetManager = '';
      }

      if (selectedItem.otherDetails.isRange == true) {
        this.addFacetFilterCard(selectedItem.otherDetails.field, selectedItem.label, 'AND', '= range');
      } else {
        let fcCondition = undefined;
        const facetCardObject = Object.assign({}, PDBe.SolrApp.searchFields[selectedItem.otherDetails.field]);

        if (facetCardObject.type == 'int' || facetCardObject.type == 'float' || facetCardObject.type == 'date') {
          fcCondition = '=';
        } else if (facetCardObject.type == 'string') {
          fcCondition = 'Equal to';
        }
        this.addFacetFilterCard(selectedItem.otherDetails.field, selectedItem.label, 'AND', fcCondition);
      }

      gtag('event', 'filters_clicked_' + selectedItem.otherDetails.facetTitle.toLowerCase().split(' ').join('_'));
    }
  }

  //Function to parse and load url params
  removeAllFilters(btnClicked?: boolean) {
    //reset search params
    this.searchService.resetFilterCards();
    this.filtercards = this.searchService.getFilterCards().slice();
    this.facetData = Object.assign({}, {});
    this.activeFacetManager = '';
    //Query Solr for initial load
    const queryManagerList = [this.tabAttributes[this.activeTabIndex].manager];
    this.generateQuery(queryManagerList);

    if (btnClicked) gtag('event', 'remove_all_filters_clicked');
  }

  //Function to get ORCiD claim information for entries found in search result
  getClaimsInfoForResultEntries(res: any) {
    //Get Orcid user ids who claimed the entries
    const identifiers: any[] = [];

    if (res.grouped && res.grouped.pdb_id && res.grouped.pdb_id.groups && res.grouped.pdb_id.groups.length > 0) {
      res.grouped.pdb_id.groups.forEach((entryData: { groupValue: any }, entryDataIndex: any) => {
        identifiers.push({
          workExternalIdentifiers: [
            {
              workExternalIdentifierType: 'pdb',
              workExternalIdentifierId: entryData.groupValue,
            },
          ],
        });
      });
    }

    if (identifiers.length > 0) {
      this.thorService.getClaimDataByIdentifier(identifiers).subscribe(
        (res) => {
          if (res.lstDatabaseClaims.length > 0) {
            this.thorClaimInfoById = {};
            const tempClaimInfo: any = {};
            res.lstDatabaseClaims.forEach((claimRec: any) => {
              const claimedPdbId = claimRec.workExternalIdentifiers[0].workExternalIdentifierId;
              if (typeof this.thorClaimInfoById[claimedPdbId] != 'undefined') {
                if (tempClaimInfo[claimedPdbId].indexOf(claimRec.orcId) == -1) {
                  this.thorClaimInfoById[claimedPdbId].push({
                    orcId: claimRec.orcId,
                    familyName: claimRec.familyName,
                    givenName: claimRec.givenName,
                  });

                  tempClaimInfo[claimedPdbId].push(claimRec.orcId);
                }
              } else {
                this.thorClaimInfoById[claimedPdbId] = [
                  {
                    orcId: claimRec.orcId,
                    familyName: claimRec.familyName,
                    givenName: claimRec.givenName,
                  },
                ];

                tempClaimInfo[claimedPdbId] = [claimRec.orcId];
              }
            });
            this.thorClaimInfoById = Object.assign({}, this.thorClaimInfoById);
            this.cd.markForCheck(); //Mark for change detection
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        (err) => {}
      );
    }
  }

  //Function to reset THOR data object
  resetThorData() {
    this.thorService.resetEntriesToClaim();
    const resetThorInfo = this.thorService.getThorInfo();
    this.thorInfo = Object.assign({}, resetThorInfo);
    if (this.tabAttributes[0].selectAllEntries[1]) {
      this.tabAttributes[0].selectAllEntries[1] = false;
      this.selectAllEntriesChange();
    }
  }

  onFilterCardDelete() {
    this.filtercards = this.searchService.getFilterCards().slice();
    this.reloadTab(false);
    gtag('event', 'filter_chip_removed');
  }

  onFilterChipsClick() {
    this.openSearchForm();
    gtag('event', 'filter_chip_clicked');
  }

  getFacetGroupHeading(groupIndex: any, groupingData: any) {
    if (Object.keys(this.facetData).length > 0 && typeof groupingData[groupIndex] != 'undefined') {
      const aKeys = Object.keys(this.facetData).join(' ');
      const regExpStr = groupingData[groupIndex].join('|');

      if (new RegExp(regExpStr, 'g').test(aKeys)) {
        return FacetGroups[groupIndex];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.autocompleteEventListener.ignore();
    this.facetMenuEventListener.ignore();
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
    this.urlSubscriber.unsubscribe();
    this.routeSubscriber.unsubscribe();
  }
}
