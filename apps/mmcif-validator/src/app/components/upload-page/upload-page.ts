import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CifValidationService } from '../../services/cif-validation.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload-page.html',
  imports: [CommonModule],
})
export class UploadPageComponent {
  private readonly cifValidationService = inject(CifValidationService);
  private readonly router = inject(Router);
  isLoading = false;
  error = '';

  async onFile(event: Event) {
    this.error = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      this.isLoading = true;
      const text = await file.text();
      const result = await this.cifValidationService.validate(text);

      sessionStorage.setItem('validationResult', JSON.stringify(result));
      this.router.navigate(['/results']);
    } catch (e: any) {
      this.error = e?.message || String(e);
    } finally {
      this.isLoading = false;
    }
  }
}
