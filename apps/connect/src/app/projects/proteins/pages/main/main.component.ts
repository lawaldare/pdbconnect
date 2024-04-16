import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class ProteinsMainPageComponent {
  entryId: string | undefined;

  constructor(private meta: Meta, private route: ActivatedRoute) {
    this.meta.addTags([
      { name: 'description', content: 'PDBe-KB Protein Pages' },
      { name: 'keywords', content: 'pdbe-kb, uniprot, protein, structure' },
      { name: 'author', content: 'PDBe-KB' },
    ]);
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'];
    });
  }
}
