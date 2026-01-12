import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
declare var $; 

@Component({
    selector: 'app-partners-page',
    templateUrl: './partners-page.component.html',
    styleUrls: ['./partners-page.component.css'],
    standalone: false
})
export class PartnersPageComponent implements OnInit, AfterViewInit {
  private _partnersURL = "assets/data/partners_descriptions.json";
  constructor(private http: HttpClient) { }
  public partners_data: any;
  public partners_categories: Array<String> = [];
  public partners_categories_ids: Array<String> = [];

  ngOnInit(): void {
    this.getPartnersData();
  }

  getPartnersData() {
    this.getPartnersJSON().subscribe((partners_data) => {
      this.partners_data = partners_data;
      this.partners_categories = Object.keys(this.partners_data);
      this.partners_categories_ids = Object.keys(this.partners_data).map((each_category) => {
        return each_category.replace(/ /g, "_").toLowerCase();
      });
    })
  }
  
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  scrollById(elId: string) {
    console.log("elId");
    console.log(elId);
    const el = document.getElementById(elId);
    if(el != null){
      el.scrollIntoView({behavior: 'smooth'});
    }
   }

  public getPartnersJSON(): Observable<any> {
    return this.http.get(this._partnersURL);
  }



  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }

}
