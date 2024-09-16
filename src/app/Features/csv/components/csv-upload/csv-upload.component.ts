import { Component } from '@angular/core';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [],
  // templateUrl: './csv-upload.component.html',
  template: `
  <div class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Upload Files</h2>
    
    <!-- Drag & Drop Area -->
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
      (click)="fileInput.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p class="mt-2 text-sm text-gray-600">Drag & drop or click to choose files</p>
      <p class="mt-1 text-xs text-gray-500">Max file size: 10 MB</p>
    </div>

    <!-- Hidden File Input -->
    <input 
      #fileInput
      type="file" 
      class="hidden" 
      (change)="onFileSelected($event)"
      multiple
    >

    <!-- Uploaded File List -->
    <div *ngFor="let file of uploadedFiles" class="bg-gray-50 rounded-lg p-3 mb-2 flex items-center justify-between">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <div>
          <p class="text-sm font-medium">{{ file.name }}</p>
          <p class="text-xs text-gray-500">{{ file.type }} | {{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
      </div>
      <div>
        <button class="text-gray-400 hover:text-gray-500 mr-2">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button class="text-gray-400 hover:text-gray-500" (click)="removeFile(file)">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Remove File Download Option -->
    <div *ngIf="uploadedFiles.length > 0" class="mt-4 flex items-center text-sm text-gray-600">
      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Remove file download from this task
    </div>
  </div>
`,
  styleUrl: './csv-upload.component.css'
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
        // You might want to show an error message to the user here
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