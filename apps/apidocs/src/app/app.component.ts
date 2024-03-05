import { Component, Input } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PdbeSwaggerDocsComponent } from '@pdbe-lib/swagger-docs';
import { ConfigService } from './config.service';

@Component({
  standalone: true,
  imports: [PdbeHeaderLogoMenuComponent, VfEbiFooterComponent, PdbeSwaggerDocsComponent],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'PDBe RESTful API Documentation';
  @Input() url = '';

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.url = this.configService.getConfig().openApiJsonUrl;
  }
}
