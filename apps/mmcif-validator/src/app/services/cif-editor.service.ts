import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { CifClickedToken, CifDictionaryHelpItem, CifEditorValidationResult } from '../models';

@Injectable({ providedIn: 'root' })
export class CifEditorService {
  private readonly helpMap = new Map<string, CifDictionaryHelpItem>([
    [
      '_entry.id',
      {
        name: '_entry.id',
        category: 'entry',
        description: 'Unique identifier for the entry.',
        example: '7YDZ',
      },
    ],
    [
      '_audit_conform.dict_name',
      {
        name: '_audit_conform.dict_name',
        category: 'audit_conform',
        description: 'Name of the dictionary used to describe the data file.',
        example: 'mmcif_pdbx.dic',
      },
    ],
    [
      '_cell.length_a',
      {
        name: '_cell.length_a',
        category: 'cell',
        description: 'Length of unit cell edge a.',
        example: '105.123',
      },
    ],
    [
      '_cell.length_b',
      {
        name: '_cell.length_b',
        category: 'cell',
        description: 'Length of unit cell edge b.',
        example: '105.123',
      },
    ],
    [
      '_cell.length_c',
      {
        name: '_cell.length_c',
        category: 'cell',
        description: 'Length of unit cell edge c.',
        example: '105.123',
      },
    ],
    [
      '_cell.angle_alpha',
      {
        name: '_cell.angle_alpha',
        category: 'cell',
        description: 'Angle alpha of the unit cell.',
        example: '90.000',
      },
    ],
    [
      '_cell.angle_beta',
      {
        name: '_cell.angle_beta',
        category: 'cell',
        description: 'Angle beta of the unit cell.',
        example: '90.000',
      },
    ],
    [
      '_cell.angle_gamma',
      {
        name: '_cell.angle_gamma',
        category: 'cell',
        description: 'Angle gamma of the unit cell.',
        example: '90.000',
      },
    ],
  ]);

  extractClickedToken(model: monaco.editor.ITextModel, position: monaco.Position): CifClickedToken | null {
    const lineContent = model.getLineContent(position.lineNumber);

    const tokenRegex = /_[A-Za-z0-9][A-Za-z0-9_.-]*/g;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(lineContent)) !== null) {
      const start = match.index + 1;
      const end = start + match[0].length - 1;

      if (position.column >= start && position.column <= end) {
        return {
          token: match[0],
          lineNumber: position.lineNumber,
          column: position.column,
          lineContent,
        };
      }
    }

    return null;
  }

  getHelp(token: string): CifDictionaryHelpItem | null {
    return this.helpMap.get(token) ?? null;
  }

  applyValidationMarkers(model: monaco.editor.ITextModel, validation: CifEditorValidationResult): void {
    const markers: monaco.editor.IMarkerData[] = validation.issues
      .filter((issue: any) => typeof issue.line === 'number')
      .map((issue: any) => ({
        startLineNumber: issue.line,
        endLineNumber: issue.line,
        startColumn: issue.startColumn ?? 1,
        endColumn: issue.endColumn ?? model.getLineMaxColumn(issue.line),
        message: issue.message,
        severity: issue.severity === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      }));

    monaco.editor.setModelMarkers(model, 'cif-validator', markers);
  }

  clearValidationMarkers(model: monaco.editor.ITextModel): void {
    monaco.editor.setModelMarkers(model, 'cif-validator', []);
  }

  buildDemoValidationResult(): CifEditorValidationResult {
    return {
      valid: false,
      issues: [
        {
          severity: 'warning',
          message: 'Missing recommended metadata item.',
          line: 25,
          startColumn: 1,
          endColumn: 15,
        },
        {
          severity: 'error',
          message: 'Invalid value format for CIF item.',
          line: 31,
          startColumn: 1,
          endColumn: 20,
        },
      ],
    };
  }
}
