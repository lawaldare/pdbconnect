import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { faqs } from '../../../ligand.constant';

@Component({
  selector: 'pdbc-faqs',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FaqsComponent {
  public readonly faqs = signal<{ title: string; content: string }[]>(faqs);
}
