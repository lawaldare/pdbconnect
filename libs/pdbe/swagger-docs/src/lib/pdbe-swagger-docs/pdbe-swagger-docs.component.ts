import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import { SwaggerUIStandalonePreset } from 'swagger-ui-dist';

@Component({
  selector: 'pdbc-pdbe-swagger-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-swagger-docs.component.html',
  styleUrls: ['./pdbe-swagger-docs.component.scss'],
})
export class PdbeSwaggerDocsComponent implements OnInit {
  @Input() jsonUrl = '';
  @Input() apiKeyValue?: string = undefined;

  ngOnInit(): void {
    function HideInfoUrlPlugin() {
      return {
        components: {
          InfoUrl: function () {
            return null;
          },
        },
      };
    }

    SwaggerUIBundle({
      url: this.jsonUrl,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle['presets'].apis, SwaggerUIStandalonePreset],
      syntaxHighlight: {
        activate: true,
        theme: 'nord',
      },
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      plugins: [SwaggerUIBundle['plugins'].DownloadUrl, HideInfoUrlPlugin],
      layout: 'BaseLayout',
      requestInterceptor: (req) => {
        if ('method' in req) {
          const [urlPath, urlParams] = req.url.split('?');
          const apiUrl = urlParams ? `${urlPath}?${urlParams}` : urlPath;

          const queryParams = new URLSearchParams(urlParams);
          let newParams = undefined;
          if (this.apiKeyValue) {
            queryParams.set('key', this.apiKeyValue);

            newParams = queryParams.toString();
          }

          req.url = newParams ? `${apiUrl}?${newParams}` : apiUrl;
        }
        return req;
      },
    });
  }
}
