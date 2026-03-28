import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CifValidationService } from '../../services/cif-validation.service';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPageComponent {
  private readonly cifValidationService = inject(CifValidationService);
  private readonly router = inject(Router);
  public isLoading = signal(false);
  public error = signal('');

  @ViewChild('dropArea') dropArea!: ElementRef<HTMLElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // async onFile(event: Event) {
  //   this.error = '';

  //   const input = event.target as HTMLInputElement;
  //   const file = input.files?.[0];
  //   if (!file) return;

  //   try {
  //     this.isLoading = true;
  //     const text = await file.text();
  //     const result = await this.cifValidationService.validate(text);

  //     console.log('Validation result:', result);

  //     sessionStorage.setItem('validationResult', JSON.stringify(result));
  //     this.router.navigate(['/results']);
  //   } catch (e: any) {
  //     this.error = e?.message || String(e);
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  /** Browse file button */
  public onBrowseClick(): void {
    this.fileInput.nativeElement.click();
  }

  /** File input change */
  public async onFileChange(event: Event): Promise<void> {
    // sessionStorage.setItem('uploadFile', 'true');
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      await this.processFile(input.files[0]);
    }
  }

  /** Drag & drop events */
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropArea.nativeElement.style.borderColor = '#2196f3';
    this.dropArea.nativeElement.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
  }

  public onDragLeave(): void {
    this.resetDropAreaStyle();
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }

    this.resetDropAreaStyle();
  }

  private resetDropAreaStyle(): void {
    this.dropArea.nativeElement.style.borderColor = '#454545';
    this.dropArea.nativeElement.style.backgroundColor = 'transparent';
  }

  /** File processing */
  private async processFile(file: File): Promise<void> {
    const lowerName = file.name.toLowerCase();
    const isCif = lowerName.endsWith('.cif') || lowerName.endsWith('.bcif');
    if (!isCif) {
      // this.facade.showError('File format is not supported. Please try again with a .cif, .bcif, .pdb or .ent file.');
      // return;
    }

    try {
      this.isLoading.set(true);
      const text = await file.text();
      const result = await this.cifValidationService.validate(text);

      console.log('Validation result:', result);

      sessionStorage.setItem('validationResult', JSON.stringify(result));
      this.router.navigate(['/results']);
    } catch (e: any) {
      this.error.set(e?.message || String(e));
    } finally {
      this.isLoading.set(false);
    }
  }
}
