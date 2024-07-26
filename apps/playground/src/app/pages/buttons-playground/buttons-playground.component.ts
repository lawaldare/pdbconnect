import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbe-buttons-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons-playground.component.html',
  styleUrl: './buttons-playground.component.scss',
})
export class ButtonsPlaygroundComponent {
  PrimarySolid = '<button class="vf-button vf-button--primary">PrimaryLight</button>';
  PrimarySolidSmall = '<button class="vf-button vf-button--primary vf-button--sm">PrimaryLight</button>';
  SearchPDBE = '<button class="vf-button vf-button--search-pdbe">PDBe Search</button>';
  SearchPDBEKB = '<button class="vf-button vf-button--search-pdbe-kb">PDBe-KB Search</button>';
  SecondaryPDBE = '<button class="vf-button vf-button--secondary-pdbe">PDBe Search</button>';
  SecondaryPDBEKB = '<button class="vf-button vf-button--secondary-pdbe-kb">PDBe-KB Search</button>';
}
