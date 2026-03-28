import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';

@Component({
  imports: [RouterModule, HeaderComponent, VfEbiHeaderComponent, VfEbiFooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'mmcif-validator';
}
