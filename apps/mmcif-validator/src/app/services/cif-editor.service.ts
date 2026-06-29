import type * as Monaco from 'monaco-editor';
declare const monaco: typeof import('monaco-editor');

import { Injectable, signal } from '@angular/core';
// import * as monaco from 'monaco-editor';
import { CifClickedToken, ValidationError, ValidationErrorItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CifEditorService {
  private _editorInstance = signal<Monaco.editor.IStandaloneCodeEditor | null>(null);
  public editorInstance = this._editorInstance.asReadonly();

  public setEditorInstance(editor: Monaco.editor.IStandaloneCodeEditor | null): void {
    this._editorInstance.set(editor);
  }
  public extractClickedToken(model: Monaco.editor.ITextModel, position: Monaco.Position): CifClickedToken | null {
    const lineContent = model.getLineContent(position.lineNumber);

    const clickOffset = position.column - 1;
    const lineUpToClick = lineContent.substring(0, clickOffset);
    const lineFromClick = lineContent.substring(clickOffset);

    const beforeMatch = lineUpToClick.match(/_[a-zA-Z0-9_.]*$/);
    const afterMatch = lineFromClick.match(/^[a-zA-Z0-9_.]*/);

    if (!beforeMatch && !afterMatch) {
      return null;
    }

    const fullItem = `${beforeMatch?.[0] || ''}${afterMatch?.[0] || ''}`;

    if (!fullItem.startsWith('_')) {
      return null;
    }

    return {
      token: fullItem,
      lineNumber: position.lineNumber,
      column: position.column,
      lineContent,
    };
  }

  public buildMarkers(model: Monaco.editor.ITextModel, errors: ValidationError[]): Monaco.editor.IMarkerData[] {
    return errors.map((error) => ({
      startLineNumber: error.line,
      endLineNumber: error.line,
      startColumn: 1,
      endColumn: model.getLineMaxColumn(error.line),
      message: error.message,
      severity: error.severity === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
    }));
  }

  public buildDecorations(monacoNs: typeof monaco, errors: ValidationError[], selectedIssue: ValidationErrorItem | null): Monaco.editor.IModelDeltaDecoration[] {
    const decorations: Monaco.editor.IModelDeltaDecoration[] = errors.map((error) => ({
      range: new monacoNs.Range(error.line, 1, error.line, 1000),
      options: {
        isWholeLine: true,
        className: error.severity === 'error' ? 'cif-line-error' : 'cif-line-warning',
        glyphMarginClassName: error.severity === 'error' ? 'cif-glyph-error' : 'cif-glyph-warning',
        glyphMarginHoverMessage: {
          value: `**${error.item || 'Validation issue'}**\n\n${error.message}`,
        },
        minimap: {
          color: error.severity === 'error' ? '#ef4444' : '#eab308',
          position: monacoNs.editor.MinimapPosition.Inline,
        },
      },
    }));

    // if (highlightedLine !== null) {
    //   decorations.push({
    //     range: new monacoNs.Range(highlightedLine, 1, highlightedLine, 1000),
    //     options: {
    //       isWholeLine: true,
    //       className: 'cif-line-highlight',
    //       glyphMarginClassName: 'cif-glyph-highlight',
    //     },
    //   });
    // }

    if (selectedIssue) {
      decorations.push({
        range: new monacoNs.Range(selectedIssue.line, 1, selectedIssue.line, 1000),
        options: {
          isWholeLine: true,
          className: selectedIssue.severity === 'error' ? 'cif-line-error-selected' : 'cif-line-warning-selected',
          glyphMarginClassName: selectedIssue.severity === 'error' ? 'cif-glyph-error-selected' : 'cif-glyph-warning-selected',
        },
      });
    }

    return decorations;
  }
}
