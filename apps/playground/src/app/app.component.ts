import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { CoreModule } from '@pdbc/core';

@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule, CoreModule],
  selector: 'pdbe-connect-playground',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'playground';
}
