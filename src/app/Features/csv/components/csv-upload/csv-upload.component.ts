import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { ErrorMessageComponent } from "app/error-message/error-message.component";

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent, ErrorMessageComponent],
  templateUrl: './csv-upload.component.html',  
  styleUrls: ['./csv-upload.component.css']    
})
export class CsvUploadComponent {
  uploadedFiles: File[] = [];
  errorMessage: string | null = null;
  isDragging: boolean = false;

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (this.isCSVFile(file)) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          this.uploadedFiles.push(file); 
        } else {
          this.errorMessage = `File too large: ${file.name}`;
        }
      } else {
        this.errorMessage = `Only CSV files are allowed.`;
      }
    });
  }

  isCSVFile(file: File): boolean {
    return file.name.endsWith('.csv') || file.type === 'text/csv';
  }

  removeFile(file: File): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  uploadFiles(): void {
    const formData = new FormData();

    if (this.uploadedFiles.length === 0) {
      return; 
    }

    this.uploadedFiles.forEach(file => {
      formData.append('file', file, file.name);  
    });

    this.http.post('http://localhost:8080/api/transactions/upload', formData).subscribe({
      next: (response) => {
        console.log('Upload success:', response);
        this.errorMessage = null;
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Failed to upload the file. Please check the format and try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }
}