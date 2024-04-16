import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, PdbeNavMenuComponent, PdbeButtonComponent, PdbeDropdownComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent {
  entryId: string | undefined;
  @ViewChild('viewDropdown') viewDropdown!: PdbeDropdownComponent;
  @ViewChild('dwlDropdown') downloadDropdown!: PdbeDropdownComponent;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'];
    });
  }

  closeOtherDropdowns(dropdownId: string) {
    if (dropdownId === 'view-btn') {
      this.downloadDropdown.closeDropdown();
    } else {
      this.viewDropdown.closeDropdown();
    }
  }
}
