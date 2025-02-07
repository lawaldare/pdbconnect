import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-assemblies-tab',
  imports: [CommonModule],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent implements OnInit {
  ngOnInit(): void {
    console.log('AssembliesTabComponent initialized');
  }
}
