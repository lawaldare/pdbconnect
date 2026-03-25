import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfigService } from '@pdbe-lib/shared-services';
import { SwaggerDocsComponent } from '../../components/swagger-docs/swagger-docs.component';
import { PdbeSearchSolrDocs } from '../../components/search-solr-docs/search-solr-docs.component';
import { FetchDocsService } from '../../services/fetch-docs.service';
import { firstValueFrom } from 'rxjs';
import { SearchFieldDoc } from '../../models/search-field.model';

@Component({
  standalone: true,
  imports: [SwaggerDocsComponent, PdbeSearchSolrDocs],
  selector: 'pdbc-search-solr-docs-page',
  templateUrl: './pdbe-search-solr-page.component.html',
  styleUrls: ['./pdbe-search-solr-page.component.scss'],
})
export class PdbeSearchSolrPage implements OnInit {
  title = 'PDBe Search API Documentation';
  url = '/assets/search-openapi.json';
  fieldDocs: SearchFieldDoc[] = [];

  private fetchDocsService = inject(FetchDocsService);
  private configService = inject(ConfigService);

  async ngOnInit() {
    this.fieldDocs = await this.fetchDocsService.getFieldDocs(this.configService.getConfig().searchSchemaUrl);
  }
}
