import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@pdbc/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pdbe-navigation-bar',
  standalone: true,
  imports: [CommonModule, CoreModule, RouterModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {}
