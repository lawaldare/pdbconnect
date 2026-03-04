import { Component } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-header-jumbotron',
  templateUrl: './header-jumbotron.component.html',
  imports: [CommonModule, HeaderSearchComponent],
  styleUrls: ['./header-jumbotron.component.scss'],
})
export class HeaderJumbotronComponent {}
