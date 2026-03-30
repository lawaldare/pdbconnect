import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface ValidationErrorItem {
  line: number;
  item: string;
  message: string;
  severity: 'error' | 'warning';
  column?: number;
  start_char?: number;
  end_char?: number;
}

interface MissingItem {
  category: string;
  item: string;
  row_index?: number;
  row_key?: string;
  has_validation_error?: boolean;
}

interface ValidationResult {
  errors: ValidationErrorItem[];
  metadata_completeness: {
    percentage: number;
    filled_count: number;
    total_count: number;
    method_detected: string;
    message: string | null;
    missing_categories: string[];
    missing_items: MissingItem[];
  };
  valid: boolean;
  summary: {
    errors: number;
    warnings: number;
  };
}

interface GroupedIssue {
  key: string;
  item: string;
  severity: 'error' | 'warning';
  message: string;
  count: number;
  samples: ValidationErrorItem[];
  suggestion?: string;
}

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result-page.html',
  styleUrls: ['./result-page.scss'],
})
export class ResultPageComponent {
  fileName = '2DN2.cif';

  result = JSON.parse(sessionStorage.getItem('validationResult') || '{}');

  showAllMissingItems = false;

  groupedIssues = computed(() => {
    const groups = new Map<string, GroupedIssue>();

    for (const err of this.result.errors) {
      const key = `${err.item}__${err.message}`;
      const existing = groups.get(key);

      if (existing) {
        existing.count += 1;
        if (existing.samples.length < 5) {
          existing.samples.push(err);
        }
      } else {
        groups.set(key, {
          key,
          item: err.item,
          severity: err.severity,
          message: err.message,
          count: 1,
          samples: [err],
          suggestion: this.getSuggestion(err.item, err.message),
        });
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  });

  displayedMissingItems = computed(() => {
    const items = this.result.metadata_completeness.missing_items;
    return this.showAllMissingItems ? items : items.slice(0, 10);
  });

  get statusLabel(): string {
    return this.result.valid ? 'Passed validation' : 'Failed validation';
  }

  get methodLabel(): string {
    const method = this.result.metadata_completeness.method_detected || 'unknown';
    return method === 'xray' ? 'X-ray' : this.toTitleCase(method);
  }

  get completenessWidth(): string {
    return `${this.result.metadata_completeness.percentage}%`;
  }

  toggleMissingItems(): void {
    this.showAllMissingItems = !this.showAllMissingItems;
  }

  uploadAnotherFile(): void {
    console.log('Upload another file');
  }

  downloadReport(): void {
    console.log('Download report');
  }

  trackByGroup(_: number, group: GroupedIssue): string {
    return group.key;
  }

  trackByMissingItem(_: number, item: MissingItem): string {
    return `${item.category}-${item.item}-${item.row_key ?? ''}`;
  }

  private getSuggestion(item: string, message: string): string | undefined {
    if (item === '_chem_comp_bond.value_order') {
      return 'Use dictionary-compliant lowercase bond order values, for example: SING → sing, DOUB → doub.';
    }

    if (item === '_pdbx_sifts_xref_db.observed') {
      return 'Use uppercase controlled values: y → Y or n → N.';
    }

    if (item === '_struct_keywords.pdbx_keywords') {
      return 'Replace the keyword with a valid controlled vocabulary term such as OXYGEN STORAGE or OXYGEN TRANSPORT.';
    }

    if (message.includes('enumeration examples')) {
      return 'Check the allowed controlled vocabulary values and normalize the field to a valid dictionary entry.';
    }

    return undefined;
  }

  private toTitleCase(value: string): string {
    return value
      .split(/[\s_-]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
