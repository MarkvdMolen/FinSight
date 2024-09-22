import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { ErrorMessageComponent } from "@shared/components/messages/error-message/error-message.component";

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent, ErrorMessageComponent],
  templateUrl: './csv-upload.component.html',  
  styleUrls: ['./csv-upload.component.css']    
})
export class CsvUploadComponent {
  uploadedFiles: File[] = [];
  isDragging: boolean = false;

  status: 'success' | 'error' = 'error';
  img_path: string = ''
  title: string = ''
  errorMessage: string | null = null;

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
    const errors: string[] = [];
  
    Array.from(files).forEach(file => {
      if (this.isCSVFile(file)) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          this.uploadedFiles.push(file); 
        } else {
          errors.push(`File too large: ${file.name}`);
        }
      } else {
        errors.push(`Invalid file type: ${file.name}`);
      }
    });
  
    if (errors.length > 0) {
      this.status = 'error';
      this.title = 'File Upload Error';
      this.errorMessage = errors.join('\n');
    }
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
  
    this.http.post('http://localhost:8080/api/transactions/upload', formData, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.status = 'success';
        this.img_path = 'mappy_happy_1.png'
        this.title = 'Upload Successful';
        this.errorMessage = 'Succes';
        // Optionally, clear uploaded files or keep them as per your requirement
      },
      error: (error) => {
        this.status = 'error';
        if (error.status === 0) {
          this.img_path = 'mappy_sad_2.png'
          this.title = 'Connection Error';
          this.errorMessage = 'Could not connect to the server. Ensure the backend is running or reachable.';
        }  
        else if (error.status === 400) {
          this.img_path = 'mappy_sad_1.png'
          this.title = 'Upload Failed';
          this.errorMessage = 'Failed to upload the file. Please check the format and try again.';
        } 
        else {
          this.img_path = 'mappy_sad_1.png'
          this.title = 'Unexpected Error';
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      },
      complete: () => {
        console.log('Upload complete');
      }
    });
  }

  resetError() {
    this.errorMessage = null;
  }
}