import { Component, Input } from '@angular/core';
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
export class PdbeSwaggerDocsComponent {
  @Input() openApiURL: string = '';
  @Input() hostname: string = '';
  @Input() apiKeyValue: string = '';


  ngOnInit(): void {
    // const hostname = this.openApiURL.split("/").slice(0, -1).join("/");
    // const apiKeyValue: string = 'AIzaSyCeurAJz7ZGjPQUtEaerUkBZ3TaBkXrY94';

    function HideInfoUrlPlugin() {
      return {
        components: {
          InfoUrl: function() { return null }
        }
      }
    }

    const ui = SwaggerUIBundle({
      url: this.openApiURL,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle['presets'].apis,
        SwaggerUIStandalonePreset,
      ],
      syntaxHighlight: {
        activate: true,
        theme: "nord"
      },
      plugins: [
        SwaggerUIBundle['plugins'].DownloadUrl,
        HideInfoUrlPlugin
      ],
      layout: "BaseLayout",
      requestInterceptor: (req: any) => { // type should be Request but with url not as readonly
        if ('method' in req) {
          const [urlPath, urlParams] = req.url.split('?');
          const apiUrl = urlPath.replace(this.hostname, `${ this.hostname }/api`);
          const queryParams = new URLSearchParams(urlParams);
          queryParams.set('key', this.apiKeyValue);

          const newParams = queryParams.toString();

          // req.url = newParams ? `${apiUrl}?${newParams}` : apiUrl;
          req.url =`${apiUrl}?${newParams}`;
        }
        return req;
      },
    });
  }
}
