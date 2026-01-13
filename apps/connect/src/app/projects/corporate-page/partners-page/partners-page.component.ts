import { Component, computed, inject, OnInit } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { CorporatePagesApiService } from '../services/corporate-pages-api.service';

@Component({
  selector: 'pdbc-partners-page',
  templateUrl: './partners-page.component.html',
  styleUrls: ['./partners-page.component.scss'],
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent, PartnersMapComponent, PartnersPlotsComponent],
})
export class PartnersPageComponent {
  private readonly cpApiService = inject(CorporatePagesApiService);
  public readonly partnersData = toSignal(this.cpApiService.getPartnersDescriptionData(), { initialValue: {} });
  public partnersCategories = computed(() => {
    const data = this.partnersData();
    return Object.keys(data);
  });
  public partnersCategoriesId = computed(() => {
    const data = this.partnersData();
    return Object.keys(data).map((each_category) => {
      return each_category.replace(/ /g, '_').toLowerCase();
    });
  });

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
}
