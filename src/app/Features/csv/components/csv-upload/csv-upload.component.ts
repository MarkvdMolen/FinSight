import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent],
  templateUrl: './csv-upload.component.html',  
  styleUrls: ['./csv-upload.component.css']    
})
export class CsvUploadComponent {
  uploadedFiles: File[] = [];  

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
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
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        this.uploadedFiles.push(file); // Opslaan als 'File' object in plaats van 'UploadedFile'
      } else {
        console.error('File too large:', file.name);
        // Hier kun je een foutmelding tonen aan de gebruiker
      }
    });
  }

  removeFile(file: File): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  uploadFiles(): void {
    const formData = new FormData();
    this.uploadedFiles.forEach(file => {
      formData.append('file', file, file.name);  // Voeg elk bestand toe aan de FormData
    });
    console.log(formData)
    // API-aanroep om het bestand naar de backend te sturen
    this.http.post('http://localhost:8080/api/transactions/upload', formData)
      .subscribe(response => {
        console.log('Upload success:', response);
      }, error => {
        console.error('Upload failed:', error);
      });
  }
}
