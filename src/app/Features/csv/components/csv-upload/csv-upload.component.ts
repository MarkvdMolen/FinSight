import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-upload.component.html',  // Verwijst naar het HTML-bestand
  styleUrls: ['./csv-upload.component.css']    // Verwijst naar het CSS-bestand
})
export class CsvUploadComponent {
  uploadedFiles: UploadedFile[] = [];

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
        this.uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type
        });
      } else {
        console.error('File too large:', file.name);
        // Hier kun je een foutmelding tonen aan de gebruiker
      }
    });
  }

  removeFile(file: UploadedFile): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }
}