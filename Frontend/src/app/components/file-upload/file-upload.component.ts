import { Component, EventEmitter, Output } from '@angular/core';
import {FileUploadService} from '../../services/file-upload.service'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @Output() uploadComplete = new EventEmitter<string>();

  file: File | null = null;
  uploading: boolean = false;
  progress: number = 0;
  error: string | null = null;

  constructor(private fileUploadService:FileUploadService) {}

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        this.error = 'Only PDF files are allowed';
        this.file = null;
        return;
      }
      this.file = selectedFile;
      this.error = null;
    }
  }

  click() {
    document.getElementById('file-upload')?.click();
  }

  handleUpload(): void {
    if (!this.file) return;

    this.uploading = true;
    this.progress = 0;

    this.fileUploadService.uploadFile(this.file).subscribe({
      next: ({ progress, response }) => {
        this.progress = progress;
        if (response) {
          if (response.status === 200) {
            this.showToast(
              'default',
              'Upload Complete',
              `${this.file!.name} has been successfully uploaded and processed.`
            );
            this.uploadComplete.emit(this.file!.name);
          } else {
            this.error = response.message || 'Upload failed';
            this.showToast('destructive', 'Upload Failed', this.error);
          }
          this.uploading = false;
          this.file = null;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload file. Please try again.';
        this.showToast('destructive', 'Upload Failed', this.error);
        this.uploading = false;
      },
      complete: () => {
        // Optional: Handle completion if needed
      },
    });
  }

  private showToast(variant: 'default' | 'destructive', title: string, description: string): void {
    console.log(`Toast: ${variant} - ${title}: ${description}`);
    // Replace with actual toast service when implemented
  }
}