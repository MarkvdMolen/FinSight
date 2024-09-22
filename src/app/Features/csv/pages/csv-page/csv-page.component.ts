import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { CsvUploadComponent } from "@features/csv/components/csv-upload/csv-upload.component";
import { CsvTableComponent } from "@features/csv/components/csv-table/csv-table.component";
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { TransactionService } from '@shared/services/transaction.service';
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";

@Component({
  selector: 'app-csv-page',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent, CsvUploadComponent, CsvTableComponent, MissingFilesComponent, SearchBarComponent], // Import CommonModule
  templateUrl: './csv-page.component.html',
  styleUrls: ['./csv-page.component.css']
})
export class CsvPageComponent {

  // Houdt bij welk deel van de pagina moet worden weergegeven
  activeSection: string = 'overview';

  constructor(private transactionService: TransactionService) { }

  // Functie om de sectie te wijzigen
  setActiveSection(section: string) {
    this.activeSection = section;
    this.transactionService.checkData()
  }

  getData() {
    return this.transactionService.hasData
  }
}
