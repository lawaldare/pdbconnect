export interface ValidationErrorItem {
  line: number;
  item: string;
  message: string;
  severity: 'error' | 'warning';
  column?: number;
  start_char?: number;
  end_char?: number;
}

export interface Summary {
  errors: number;
  warnings: number;
}

export interface MetadataCompleteness {
  percentage: number;
  filled_count: number;
  total_count: number;
  method_detected: string;
  message: string | null;
  missing_categories: string[];
  missing_items: MissingItem[];
}

export interface MissingItem {
  category: string;
  item: string;
  row_index?: number;
  row_key?: string;
  has_validation_error?: boolean;
}

export interface ValidationResult {
  errors: ValidationErrorItem[];
  metadata_completeness: MetadataCompleteness;
  valid: boolean;
  summary: Summary;
}

export interface GroupedIssue {
  key: string;
  item: string;
  severity: 'error' | 'warning';
  message: string;
  count: number;
  samples: ValidationErrorItem[];
  suggestion?: string;
}

export interface CifDictionaryItem {
  name: string;
  category: string | null;
  type: string | null;
  description: string;
}

export interface CifClickedToken {
  token: string;
  lineNumber: number;
  column: number;
  lineContent: string;
}

export interface ValidationError {
  line: number;
  item?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CifValidationIssue {
  severity: 'error' | 'warning';
  message: string;
  line?: number;
  startColumn?: number;
  endColumn?: number;
}

export interface CifEditorValidationResult {
  valid: boolean;
  issues: CifValidationIssue[];
}
