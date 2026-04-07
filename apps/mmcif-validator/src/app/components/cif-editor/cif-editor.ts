/* eslint-disable @angular-eslint/component-selector */

import type * as Monaco from 'monaco-editor';
declare const monaco: typeof import('monaco-editor');

import { Component, OnInit, signal, inject, SimpleChanges, OnChanges, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { CifEditorService } from '../../services/cif-editor.service';
import { CifMonacoService } from '../../services/cif-monaco.service';
import { CifClickedToken, CifDictionaryItem, ValidationError, ValidationErrorItem } from '../../models';
import { CifFileStoreService, CifStoredData } from '../../services/cif-file-store.service';
import { CifDictionaryService } from '../../services/cif-dictionary.service';

@Component({
  selector: 'cif-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './cif-editor.html',
  styleUrl: './cif-editor.scss',
})
export class CifEditorComponent implements OnInit, OnChanges {
  private readonly cifEditorService = inject(CifEditorService);
  private readonly cifMonacoService = inject(CifMonacoService);
  private readonly fileStoreService = inject(CifFileStoreService);
  private readonly cifDictionaryService = inject(CifDictionaryService);

  private editorInstance?: Monaco.editor.IStandaloneCodeEditor;
  private editorModel?: Monaco.editor.ITextModel;
  private decorations: string[] = [];

  public content = input<string>('');
  public errors = input<ValidationError[]>([]);
  public highlightedLine = input<number | null>(null);
  public selectedIssue = input<ValidationErrorItem | null>(null);

  public cifFileText = '';
  private cifFileName = '';

  // public contentChange = output<string>();
  public itemClick = output<string>();

  readonly selectedToken = signal<CifClickedToken | null>(null);
  readonly helpItem = signal<CifDictionaryItem | null>(null);
  readonly editorReady = signal(false);

  public readonly editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: 'cifTheme',
    language: 'cif',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 4,
    renderLineHighlight: 'all',
    automaticLayout: true,
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  };

  async ngOnInit(): Promise<void> {
    const stored = await this.fileStoreService.get('current-cif');
    if (stored) {
      this.cifFileText = (stored as CifStoredData).cifText;
      this.cifFileName = (stored as CifStoredData).fileName;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editorInstance || !this.editorModel) return;

    if (changes['errors'] || changes['selectedIssue']) {
      this.applyMarkersAndDecorations();
    }

    if (changes['highlightedLine'] && this.highlightedLine() !== null) {
      this.revealHighlightedLine();
    }

    if (changes['selectedIssue'] && this.selectedIssue()) {
      this.revealSelectedIssue();
    }
  }

  get lineCount(): number {
    return (this.content() || '').split('\n').length;
  }

  private revealSelectedIssue(): void {
    const issue = this.selectedIssue();
    if (!issue || !this.editorInstance) return;

    this.editorInstance.revealLineInCenter(issue.line);
    this.editorInstance.setPosition({ lineNumber: issue.line, column: 1 });
  }

  onEditorInit(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editorInstance = editor;
    this.cifEditorService.setEditorInstance(editor);
    this.editorReady.set(true);

    this.cifMonacoService.initLanguage(monaco);
    this.cifMonacoService.applyLanguageAndTheme(editor, monaco);

    const applyModelSetup = () => {
      const model = editor.getModel();
      if (!model) return;

      this.editorModel = model;

      monaco.editor.setModelLanguage(model, 'cif');
      monaco.editor.setTheme('cifTheme');

      this.applyMarkersAndDecorations();
    };

    applyModelSetup();

    editor.onDidChangeModel(() => {
      applyModelSetup();
    });

    // editor.onDidChangeModelContent(() => {
    //   const value = editor.getValue();
    //   this.contentChange.emit(value);
    // });

    editor.onMouseDown((event) => {
      const position = event.target.position;
      const model = editor.getModel();
      if (!position || !model) return;

      const clicked = this.cifEditorService.extractClickedToken(model, position);
      const helpItem = this.cifDictionaryService.getItem(clicked?.token || '');

      if (helpItem) this.helpItem.set(helpItem);

      this.selectedToken.set(clicked);
      if (clicked) {
        this.itemClick.emit(clicked.token);
      }
    });
  }

  private applyMarkersAndDecorations(): void {
    if (!this.editorModel || !this.editorInstance) return;

    const markers = this.cifEditorService.buildMarkers(this.editorModel, this.errors());

    monaco.editor.setModelMarkers(this.editorModel, 'cif-validator', markers);

    const decorations = this.cifEditorService.buildDecorations(monaco, this.errors(), this.selectedIssue());

    this.decorations = this.editorInstance.deltaDecorations(this.decorations, decorations);
  }

  private revealHighlightedLine(): void {
    const line = this.highlightedLine();
    if (line === null || !this.editorInstance) return;

    this.editorInstance.revealLineInCenter(line);
    this.editorInstance.setPosition({ lineNumber: line, column: 1 });
  }

  downloadCif(): void {
    const latestText = this.editorModel?.getValue() ?? this.cifFileText;

    const blob = new Blob([latestText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.cifFileName.split('.')[0]}_edited.cif`;
    a.click();

    URL.revokeObjectURL(url);
  }

  public closeHelp(): void {
    this.helpItem.set(null);
  }
  public viewMMCIFDictionary(): void {
    const match = this.helpItem()?.name.match(/^_([^.]+)\.(.+)$/);
    if (match) {
      const [, category, field] = match;
      const link = `https://mmcif.wwpdb.org/dictionaries/mmcif_pdbx.dic/Items/_${category}.${field}.html`;
      window.open(link, '_blank');
      return;
    }
    // Category only
    const categoryMatch = this.helpItem()?.name.match(/^_([^.]+)$/);
    if (categoryMatch) {
      const link = `https://mmcif.wwpdb.org/dictionaries/mmcif_pdbx.dic/Categories/${this.helpItem()?.name}.html`;
      window.open(link, '_blank');
      return;
    }
    window.open('https://mmcif.wwpdb.org/dictionaries/mmcif_pdbx.dic/', '_blank');
  }

  public openDictionaryExplorer(): void {
    window.open('https://deborahharrus.github.io/mmcif-dictionary-explorer/app/', '_blank');
  }
}
