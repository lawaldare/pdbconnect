import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-domains-tab',
  imports: [CommonModule],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent implements OnInit {
  ngOnInit(): void {
    console.log('DomainsTabComponent initialized');
  }
}
