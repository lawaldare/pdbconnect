/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';

import { CifEditorService } from '../../services/cif-editor.service';
import { CifMonacoService } from '../../services/cif-monaco.service';
import { CifClickedToken, CifDictionaryHelpItem } from '../../models';
import { CifFileStoreService } from '../../services/cif-file-store.service';

@Component({
  selector: 'cif-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './cif-editor.html',
  styleUrl: './cif-editor.scss',
})
export class CifEditorComponent implements OnInit {
  private readonly cifEditorService = inject(CifEditorService);
  private readonly cifMonacoService = inject(CifMonacoService);
  private readonly fileStoreService = inject(CifFileStoreService);

  private editorInstance?: monaco.editor.IStandaloneCodeEditor;
  private editorModel?: monaco.editor.ITextModel;

  public cifFileName = '';
  public cifFileText = '';

  readonly selectedToken = signal<CifClickedToken | null>(null);
  readonly helpItem = signal<CifDictionaryHelpItem | null>(null);
  readonly editorReady = signal(false);

  readonly lineCount = computed(() => this.cifFileText.split('\n').length);

  public readonly editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: 'cifTheme',
    language: 'cif',
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    wordWrap: 'off',
    tabSize: 2,
    renderWhitespace: 'selection',
    glyphMargin: true,
  };

  async ngOnInit(): Promise<void> {
    this.cifMonacoService.initLanguage();

    const stored = await this.fileStoreService.get('current-cif');

    if (stored) {
      this.cifFileName = stored.fileName;
      this.cifFileText = stored.cifText;
    }
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editorInstance = editor;
    this.editorModel = editor.getModel() ?? undefined;
    this.editorReady.set(true);

    if (this.editorModel) {
      this.editorModel.setValue(this.cifFileText || '');
    }

    editor.onMouseDown((event) => {
      const position = event.target.position;
      if (!position || !this.editorModel) return;

      const clicked = this.cifEditorService.extractClickedToken(this.editorModel, position);

      this.selectedToken.set(clicked);
      this.helpItem.set(clicked ? this.cifEditorService.getHelp(clicked.token) : null);
    });
  }

  applyDemoMarkers(): void {
    if (!this.editorModel) return;

    const result = this.cifEditorService.buildDemoValidationResult();
    this.cifEditorService.applyValidationMarkers(this.editorModel, result);
  }

  clearMarkers(): void {
    if (!this.editorModel) return;
    this.cifEditorService.clearValidationMarkers(this.editorModel);
  }

  formatLightly(): void {
    if (!this.editorInstance || !this.editorModel) return;

    const lines = this.editorModel.getLinesContent().map((line) => line.trimEnd());
    const formatted = lines.join('\n');

    this.editorInstance.executeEdits('cif-format', [
      {
        range: this.editorModel.getFullModelRange(),
        text: formatted,
      },
    ]);

    this.cifFileText = formatted;
  }

  downloadCif(): void {
    const latestText = this.editorModel?.getValue() ?? this.cifFileText;

    const blob = new Blob([latestText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.cif';
    a.click();

    URL.revokeObjectURL(url);
  }
}
