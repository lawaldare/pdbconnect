import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';

@Injectable({ providedIn: 'root' })
export class CifMonacoService {
  private initialized = false;

  initLanguage(): void {
    if (this.initialized) return;

    monaco.languages.register({ id: 'cif' });

    monaco.languages.setMonarchTokensProvider('cif', {
      tokenizer: {
        root: [
          [/^data_.*/, 'keyword'],
          [/^loop_/, 'keyword'],
          [/^_[a-zA-Z_][a-zA-Z0-9_.]*/, 'type'],
          [/#.*$/, 'comment'],
          [/'[^']*'/, 'string'],
          [/"[^"]*"/, 'string'],
          [/;[\s\S]*?^;/m, 'string'],
          [/\d+\.?\d*/, 'number'],
        ],
      },
    });

    monaco.editor.defineTheme('cifTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'AF00DB', fontStyle: 'bold' },
        { token: 'variable', foreground: '008080' },
        { token: 'type.identifier', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'number.float', foreground: '098658' },
      ],
      colors: {},
    });

    this.initialized = true;
  }
}
