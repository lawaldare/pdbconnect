import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  Inject,
} from "@angular/core";
import { FilterCardsComponent } from "../filter-cards/filter-cards.component";
import { SearchService } from "../common/search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgOption } from "@ng-select/ng-select";

declare let PDBe: any;
declare var gtag: any;

@Component({
    selector: "search-form-dialog",
    templateUrl: "./search-form-dialog.component.html",
    styleUrls: ["./search-form-dialog.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SearchFormDialogComponent implements OnInit {
  @ViewChild("bottom") bottom;
  @ViewChild("submitBtn") submitBtn;
  advFiltercards = [];
  solrManagerRef: any;

  filterSelectBoxData: any[];
  searchFields: any;
  filterSelectGroups: any[];

  searchForm: FormGroup;
  validForm: boolean;
  sequenceClusteringIndex: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchFormDialogComponent>,
    private advancedSearchService: SearchService
  ) {
    this.filterSelectGroups = PDBe.SolrApp.fieldGroups;
    this.searchFields = PDBe.SolrApp.searchFields;
    this.sequenceClusteringIndex = -1;
    this.filterSelectBoxData = this.groupSearchField(this.searchFields);

    this.validForm = true;
  }

  groupSearchField(obj) {
    let sortable = [];
    let sortableNew = [];
    for (let key in obj) {
      // console.log(obj[key]);
      // if(key == 'q_seq_100_cluster_number') continue; //remove sequence clustering option
      let optionRec = {
        label: obj[key].label,
        field: key,
        groupName: this.filterSelectGroups[obj[key].groupingIndex],
      };

      sortableNew.push(optionRec);
      /*if (obj.hasOwnProperty(key)) {
              //sortable.push([key, obj[key]]);
            let index = obj[key].groupingIndex;
            if(typeof sortable[index] == 'undefined'){
                sortable[index] = [key];
            }else{
              sortable[index].push(key);
            }

          }*/
    }
    // console.log(sortableNew)
    return sortableNew;
  }

  ngOnInit() {
    //Get filterCards from service
    let filterCardsInService = this.advancedSearchService
      .getFilterCards()
      .slice(0);

    //Clone filtercards to avoid change by ref
    this.advFiltercards = []; // create empty array to hold copy
    for (var i = 0, len = filterCardsInService.length; i < len; i++) {
      this.advFiltercards[i] = {}; // empty object to hold properties added below
      if (
        filterCardsInService[i].alias.indexOf("q_seq_100_cluster_number") > -1
      )
        this.sequenceClusteringIndex = i;
      for (var prop in filterCardsInService[i]) {
        this.advFiltercards[i][prop] = filterCardsInService[i][prop]; // copy properties from arObj to ar2
      }
    }

    //Dropdown selected value
    // this.searchCriteriaField = null;

    this.searchForm = this.fb.group({
      searchCriteriaField: null,
    });
  }

  //Function to add new filter card on selectbox filter select
  addCard(event) {
    let selectedField = event.field;

    if (selectedField == null) return;

    let selectedCard = this.searchFields[selectedField];

    let newCard = Object.assign({}, selectedCard);

    if (typeof newCard.alias != "undefined") {
      newCard.alias.unshift(selectedField);
    } else {
      newCard.alias = [selectedField];
    }

    if (typeof newCard["condition"] == "undefined")
      newCard["condition"] = "AND";
    if (typeof newCard["relation"] == "undefined")
      newCard["relation"] = "Contains";

    if (newCard.submitFilter == "processAssemblyType") {
      newCard["relation"] = "=";
    } else {
      if (
        newCard.type == "int" ||
        newCard.type == "float" ||
        newCard.type == "date"
      ) {
        newCard["relation"] = "= range";
      }
    }

    if (typeof newCard.value != "undefined") {
      newCard["relation"] = "Equal to";
    }

    if (selectedField == "q_seq_100_cluster_number") {
      if (this.sequenceClusteringIndex > -1) {
        this.advFiltercards.splice(this.sequenceClusteringIndex, 1);
      }
      this.sequenceClusteringIndex = this.advFiltercards.length;
    }

    this.advFiltercards.push(newCard);
    this.advFiltercards = this.advFiltercards.slice();

    //reset dropdown value
    // this.searchCriteriaField = null;
    this.searchForm.get("searchCriteriaField").patchValue(null);

    //scroll to the button area
    setTimeout((_) => {
      this.bottom.nativeElement.scrollIntoView(false);
    });

    this.submitBtn._elementRef.nativeElement.focus();
  }

  submitSearch(action?: string): void {
    this.validForm = true;

    //Validate Phmmer Field
    this.advFiltercards.forEach((fieldData, fcCardIndex) => {
      // if(fieldData.valueType == 'phmmerSequence' && typeof fieldData.selectedValue != 'undefined' && (fieldData.selectedValue.trim().length < 11 || fieldData.selectedValue.trim().length > 1000)){
      //   this.validForm = false;
      // }

      if (
        (fieldData.valueType == "fastaSequence" ||
          fieldData.valueType == "phmmerSequence") &&
        typeof fieldData.selectedValue != "undefined" &&
        (fieldData.selectedValue.trim().length < 11 ||
          fieldData.selectedValue.trim().length > 1000)
      ) {
        this.validForm = false;
      }
    });

    //Submit if valid
    if (this.validForm) {
      //reset search Params
      this.advancedSearchService.resetFilterCards();

      //Iterate filter card fields
      this.advFiltercards.forEach((fieldData, fcCardIndex) => {
        //Ignore card if value not defined or blank
        if (typeof fieldData.selectedValue == "undefined") return;

        //Trim / clean the selected value
        if (
          fieldData.type != "date" &&
          fieldData.type != "int" &&
          fieldData.type != "float"
        ) {
          fieldData.selectedValue = fieldData.selectedValue.trim();
        }

        if (fieldData.selectedValue.toString() == "") return;

        //Add filtercard to service form data
        this.advancedSearchService.addFilterCards(fieldData);
      });

      this.dialogRef.close("submit");
    }
  }

  closeDialog() {
    gtag("event", "search_form_closed");

    this.dialogRef.close("Close");
  }

  filtersCardsUpadated(cardIndex) {
    if (cardIndex) {
      cardIndex = +cardIndex;
      if (this.sequenceClusteringIndex == cardIndex)
        this.sequenceClusteringIndex = -1;
    }
  }
}
