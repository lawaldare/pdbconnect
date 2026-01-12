import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HeaderComponent } from '../header/header.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { PartnersMapComponent } from '../partners-map/partners-map.component';
import { PartnersPlotsComponent } from '../partners-plots/partners-plots.component';
import { ScriptLoaderService } from '@pdbc/core';

@Component({
  selector: 'pdbc-partners-page',
  templateUrl: './partners-page.component.html',
  styleUrls: ['./partners-page.component.scss'],
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent, PartnersMapComponent, PartnersPlotsComponent],
})
export class PartnersPageComponent implements OnInit {
  private _partnersURL = 'assets/corporate-page/data/partners_descriptions.json';
  constructor(private http: HttpClient) {}
  public partners_data: any;
  public partners_categories: Array<string> = [];
  public partners_categories_ids: Array<string> = [];

  async ngOnInit() {
    this.getPartnersData();
  }

  getPartnersData() {
    this.getPartnersJSON().subscribe((partners_data) => {
      this.partners_data = partners_data;
      this.partners_categories = Object.keys(this.partners_data);
      this.partners_categories_ids = Object.keys(this.partners_data).map((each_category) => {
        return each_category.replace(/ /g, '_').toLowerCase();
      });
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollById(elId: string) {
    console.log('elId');
    console.log(elId);
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public getPartnersJSON(): Observable<any> {
    return this.http.get(this._partnersURL);
  }
}
