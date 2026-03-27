import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './result-page.html',
})
export class ResultsPageComponent {
  result = JSON.parse(sessionStorage.getItem('validationResult') || '{}');
}
