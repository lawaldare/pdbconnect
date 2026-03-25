import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OpenApiDocument, OpenApiParameterSearchItem, OpenApiPathSearchItem } from '../models/openapi.model';
import { normalizeText } from '../helpers/search-helpers';
import { RawFieldDocsResponse, RawSearchFieldDoc, SearchFieldDoc } from '../models/search-field.model';

@Injectable({
  providedIn: 'root',
})
export class FetchDocsService {
  private readonly http = inject(HttpClient);

  async fetchAndParseOpenApi(url: string): Promise<OpenApiPathSearchItem[]> {
    const openApiDoc = await firstValueFrom(this.http.get<OpenApiDocument>(url));
    return this.parseOpenApiDocument(openApiDoc);
  }

  parseOpenApiDocument(doc: OpenApiDocument): OpenApiPathSearchItem[] {
    if (!doc?.paths) return [];

    const results: OpenApiPathSearchItem[] = [];

    for (const [path, pathItem] of Object.entries(doc.paths)) {
      if (!pathItem) continue;

      for (const [method, operation] of Object.entries(pathItem)) {
        if (!operation || typeof operation !== 'object') continue;

        const normalizedMethod = method.toUpperCase();
        const operationId = operation.operationId;

        const tags = operation.tags || [];
        for (const tag of tags) {
          const parameters: OpenApiParameterSearchItem[] = (operation.parameters ?? []).map((param) => ({
            name: param.name ?? '',
            title: param.schema?.title ?? '',
            description: param.description ?? param.schema?.description ?? '',
            in: param.in,
            required: param.required,
          }));

          const item: OpenApiPathSearchItem = {
            id: `operations-${tag}-${operationId}`,
            path,
            method: normalizedMethod,
            tags: operation.tags ?? [],
            summary: operation.summary ?? '',
            description: operation.description ?? '',
            operationId: operation.operationId,
            parameters,
            searchText: this.buildOpenApiSearchText({
              path,
              method: normalizedMethod,
              tags: operation.tags ?? [],
              summary: operation.summary ?? '',
              description: operation.description ?? '',
              operationId: operation.operationId,
              parameters,
            }),
          };

          results.push(item);
        }
      }
    }

    return results;
  }

  private buildOpenApiSearchText(entry: {
    path: string;
    method: string;
    tags: string[];
    summary: string;
    description: string;
    operationId?: string;
    parameters: OpenApiParameterSearchItem[];
  }): string {
    const parameterText = entry.parameters
      .map((param) => [param.name, param.title, param.description, param.in, param.required ? 'required' : 'optional'].filter(Boolean).join(' '))
      .join(' ');

    return normalizeText([entry.path, entry.method, entry.summary, entry.description, entry.operationId ?? '', ...entry.tags, parameterText].join(' '));
  }

  async getFieldDocs(url: string): Promise<SearchFieldDoc[]> {
    const fieldDocs = await firstValueFrom(this.http.get<RawFieldDocsResponse>(url));
    return this.parseFieldDocs(fieldDocs);
  }

  parseFieldDocs(response: RawFieldDocsResponse): SearchFieldDoc[] {
    return Object.entries(response.fields ?? {}).map(([key, value]) => ({
      key,
      datatype: value.datatype ?? '',
      description: value.description ?? '',
      category: value.category ?? '',
      possibleValues: value.possible_values ?? [],
      examples: value.examples ?? [],
      searchText: this.buildSolrSearchText(key, value),
    }));
  }

  private buildSolrSearchText(key: string, value: RawSearchFieldDoc): string {
    return [key, value.datatype ?? '', value.description ?? '', value.category ?? '', ...(value.possible_values ?? []), ...(value.examples ?? [])]
      .join(' ')
      .toLowerCase();
  }
}
