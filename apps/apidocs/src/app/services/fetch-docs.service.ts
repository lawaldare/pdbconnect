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
    const allSchemas = doc?.components?.schemas ?? {};

    for (const [path, pathItem] of Object.entries(doc.paths)) {
      if (!pathItem) continue;

      for (const [method, operation] of Object.entries(pathItem)) {
        if (!operation || typeof operation !== 'object') continue;

        const normalizedMethod = method.toUpperCase();
        const operationId = operation.operationId;

        const responseSchemaText = this.extractResponseSchemaSearchText(operation, allSchemas);

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
              responseSchemaText,
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
    responseSchemaText?: string;
  }): string {
    const parameterText = entry.parameters
      .map((param) => [param.name, param.title, param.description, param.in, param.required ? 'required' : 'optional'].filter(Boolean).join(' '))
      .join(' ');

    return normalizeText(
      [entry.path, entry.method, entry.summary, entry.description, entry.operationId ?? '', ...entry.tags, parameterText, entry.responseSchemaText ?? ''].join(' ')
    );
  }

  private extractResponseSchemaSearchText(operation: any, allSchemas: Record<string, any>): string {
    const parts: string[] = [];

    const responses = operation.responses ?? {};

    for (const response of Object.values<any>(responses)) {
      const content = response?.content ?? {};

      for (const mediaType of Object.values<any>(content)) {
        const schema = mediaType?.schema;
        if (!schema) continue;

        parts.push(this.buildSchemaSearchText(schema, allSchemas));
      }
    }

    return normalizeText(parts.filter(Boolean).join(' '));
  }

  private buildSchemaSearchText(schema: any, allSchemas: Record<string, any>, visited = new Set<string>()): string {
    if (!schema || typeof schema !== 'object') {
      return '';
    }

    const parts: string[] = [];

    if (schema.title) parts.push(schema.title);
    if (schema.description) parts.push(schema.description);

    if (Array.isArray(schema.enum)) {
      parts.push(...schema.enum.map((value: unknown) => String(value)));
    }

    if (schema.type) {
      parts.push(String(schema.type));
    }

    if (Array.isArray(schema.required)) {
      parts.push(...schema.required);
    }

    if (schema.properties && typeof schema.properties === 'object') {
      for (const [propertyName, propertySchema] of Object.entries<any>(schema.properties)) {
        parts.push(propertyName);

        if (propertySchema?.title) parts.push(propertySchema.title);
        if (propertySchema?.description) parts.push(propertySchema.description);
        if (propertySchema?.type) parts.push(propertySchema.type);

        if (Array.isArray(propertySchema?.enum)) {
          parts.push(...propertySchema.enum.map((value: unknown) => String(value)));
        }

        if (propertySchema?.$ref) {
          parts.push(this.resolveSchemaRefText(propertySchema.$ref, allSchemas, visited));
        }

        if (propertySchema?.items) {
          parts.push(this.buildSchemaSearchText(propertySchema.items, allSchemas, visited));
        }

        if (Array.isArray(propertySchema?.allOf)) {
          for (const item of propertySchema.allOf) {
            parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
          }
        }

        if (Array.isArray(propertySchema?.anyOf)) {
          for (const item of propertySchema.anyOf) {
            parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
          }
        }

        if (Array.isArray(propertySchema?.oneOf)) {
          for (const item of propertySchema.oneOf) {
            parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
          }
        }
      }
    }

    if (schema.items) {
      parts.push(this.buildSchemaSearchText(schema.items, allSchemas, visited));
    }

    if (Array.isArray(schema.allOf)) {
      for (const item of schema.allOf) {
        parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
      }
    }

    if (Array.isArray(schema.anyOf)) {
      for (const item of schema.anyOf) {
        parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
      }
    }

    if (Array.isArray(schema.oneOf)) {
      for (const item of schema.oneOf) {
        parts.push(this.buildSchemaSearchText(item, allSchemas, visited));
      }
    }

    if (schema.$ref) {
      parts.push(this.resolveSchemaRefText(schema.$ref, allSchemas, visited));
    }

    return normalizeText(parts.filter(Boolean).join(' '));
  }

  private resolveSchemaRefText(ref: string, allSchemas: Record<string, any>, visited: Set<string>): string {
    const prefix = '#/components/schemas/';
    if (!ref.startsWith(prefix)) {
      return '';
    }

    const schemaName = ref.slice(prefix.length);

    if (!schemaName || visited.has(schemaName)) {
      return '';
    }

    const referencedSchema = allSchemas[schemaName];
    if (!referencedSchema) {
      return '';
    }

    const nextVisited = new Set(visited);
    nextVisited.add(schemaName);

    return this.buildSchemaSearchText(referencedSchema, allSchemas, nextVisited);
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
