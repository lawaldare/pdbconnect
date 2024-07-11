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
  PrimaryLight = '<button class="vf-button vf-button--primary-light">PrimaryLight</button>';
  PrimarySolid = '<button class="vf-button vf-button--primary-solid">PrimaryLight</button>';
  PrimarySolidSmall = '<button class="vf-button vf-button--primary-solid vf-button--sm">PrimaryLight</button>';
  ButtonText = '<button class="vf-button vf-button--text">ButtonLink</button>';
}
