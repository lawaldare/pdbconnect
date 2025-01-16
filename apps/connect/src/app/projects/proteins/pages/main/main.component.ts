import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class ProteinsMainPageComponent {
  entryId: string | undefined;

  public headerLogoMenuConfig = {
    backgroundColor: '#085F5C',
    logoType: 'PDBe-KB',
    urls: [
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation', openInNewTab: true },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training', openInNewTab: true },
    ],
    menuHighlightColor: '#086C68',
  };

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
