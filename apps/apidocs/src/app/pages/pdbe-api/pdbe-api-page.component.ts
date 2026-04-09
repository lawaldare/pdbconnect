import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '@pdbe-lib/shared-services';
import { SwaggerDocsComponent } from '../../components/swagger-docs/swagger-docs.component';

@Component({
  standalone: true,
  imports: [SwaggerDocsComponent],
  selector: 'pdbc-api-docs-page',
  templateUrl: './pdbe-api-page.component.html',
  styleUrls: ['./pdbe-api-page.component.scss'],
})
export class PdbeApiPage implements OnInit {
  title = 'PDBe RESTful API Documentation';
  @Input() url = '';

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.url = this.configService.getConfig().openApiJsonUrl;
  }
}
