import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {}
