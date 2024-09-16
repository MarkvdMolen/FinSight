import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { CsvUploadComponent } from "@features/csv/components/csv-upload/csv-upload.component";
import { CsvTableComponent } from "@features/csv/components/csv-table/csv-table.component";

@Component({
  selector: 'app-csv-page',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent, CsvUploadComponent, CsvTableComponent], // Import CommonModule
  templateUrl: './csv-page.component.html',
  styleUrls: ['./csv-page.component.css']
})
export class CsvPageComponent {

  // Houdt bij welk deel van de pagina moet worden weergegeven
  activeSection: string = 'overview';

  // Functie om de sectie te wijzigen
  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
