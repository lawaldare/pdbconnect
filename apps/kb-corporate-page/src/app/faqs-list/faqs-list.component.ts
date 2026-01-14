import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-faqs-list',
  templateUrl: './faqs-list.component.html',
  styleUrls: ['./faqs-list.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class FaqsListComponent {}
