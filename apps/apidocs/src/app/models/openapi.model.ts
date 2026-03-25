export interface OpenApiParameterSearchItem {
  name: string;
  title: string;
  description: string;
  in?: string;
  required?: boolean;
}

export interface OpenApiPathSearchItem {
  id: string;
  path: string;
  method: string;
  tags: string[];
  summary: string;
  description: string;
  operationId?: string;
  parameters: OpenApiParameterSearchItem[];
  searchText: string;
}

export interface OpenApiFilterResult {
  matchedPaths: OpenApiPathSearchItem[];
  matchedTags: string[];
}

interface OpenApiSchemaParameter {
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: {
    title?: string;
    description?: string;
  };
}

export interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: OpenApiSchemaParameter[];
}

export interface OpenApiDocument {
  paths?: Record<string, Record<string, OpenApiOperation>>;
}
