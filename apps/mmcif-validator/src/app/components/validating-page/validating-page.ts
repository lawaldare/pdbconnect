/* eslint-disable @angular-eslint/component-selector */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CifFileStoreService, CifStoredData } from '../../services/cif-file-store.service';
import { CifValidationService } from '../../services/cif-validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'validating-page',
  imports: [CommonModule],
  templateUrl: './validating-page.html',
  styleUrls: ['./validating-page.scss'],
})
export class ValidatingPageComponent implements OnInit {
  private readonly fileStoreService = inject(CifFileStoreService);
  private readonly cifValidationService = inject(CifValidationService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    const file = await this.fileStoreService.get('current-file');
    const cifText = await this.fileStoreService.get('current-cif');

    if (file) {
      const text = await (file as File).text();
      await this.validateCifText(text, true, file as File);
    } else {
      await this.validateCifText((cifText as CifStoredData)?.cifText, false);
    }
  }

  private async validateCifText(cifText: string, saveCifText: boolean, file?: File): Promise<void> {
    try {
      const result = await this.cifValidationService.validate(cifText);

      if (saveCifText && file) {
        await this.fileStoreService.put('current-cif', {
          fileName: (file as File).name,
          cifText: cifText,
        });
      }

      sessionStorage.setItem('validationResult', JSON.stringify(result));
      this.fileStoreService.del('current-file');
      this.router.navigate(['/results']);
    } catch (e: any) {
      // this.error.set(e?.message || String(e));
    } finally {
      // this.isLoading.set(false);
    }
  }
}
