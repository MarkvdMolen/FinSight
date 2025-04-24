import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { CsvUploadComponent } from "@features/csv/components/csv-upload/csv-upload.component";
import { CsvTableComponent } from "@features/csv/components/csv-table/csv-table.component";
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { TransactionService } from '@shared/services/transaction.service';
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { ClassificationOverviewComponent } from "@shared/components/classification-overview/classification-overview.component";

@Component({
  selector: 'app-csv-page',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent, CsvUploadComponent, CsvTableComponent, MissingFilesComponent, SearchBarComponent, ClassificationOverviewComponent], 
  templateUrl: './csv-page.component.html',
  styleUrls: ['./csv-page.component.css']
})
export class CsvPageComponent {

  activeSection: string = 'overview';

  constructor(private transactionService: TransactionService) { }

  // Functie om de sectie te wijzigen
  setActiveSection(section: string) {
    this.activeSection = section;
    this.transactionService.checkData()
  }

  getData() {
    // console.log(this.transactionService.hasData)
    return this.transactionService.getData()
  }

  @ViewChild('csvTable') csvTable!: CsvTableComponent;

  onSearch(searchTerm: string): void {
    this.csvTable.searchText = searchTerm;
    this.csvTable.paginator.firstPage(); // reset naar pagina 0
    this.csvTable.fetchTransactions();
  }
}
