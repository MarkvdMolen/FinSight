import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { CsvTableComponent } from "@features/csv/components/csv-table/csv-table.component";
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { TransactionService } from '@shared/services/transaction.service';
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { ClassificationOverviewComponent } from "@shared/components/classification-overview/classification-overview.component";

@Component({
  selector: 'app-csv-page',
  standalone: true,
  imports: [CommonModule, CsvTableComponent, MissingFilesComponent, SearchBarComponent, ClassificationOverviewComponent], 
  templateUrl: './csv-page.component.html',
  styleUrls: ['./csv-page.component.css']
})
export class CsvPageComponent implements OnInit {

    hasData = false;
    isLoading = true;
    @ViewChild('csvTable') csvTable!: CsvTableComponent;

    constructor(private transactionService: TransactionService) { }
    
    ngOnInit(): void {
        this.checkIfHasData();
    }

    checkIfHasData(): void {
        this.isLoading = true;

        this.transactionService.getTransactions().subscribe({
          next: (data) => {
            this.hasData = data.content.length > 0;
            this.isLoading = false;
          },
          error: () => {
            this.hasData = false;
            this.isLoading = false;
          }
        });
    }

    onSearch(searchTerm: string): void {
        this.csvTable.searchText = searchTerm;
        this.csvTable.paginator.firstPage();
        this.csvTable.fetchTransactions();
    }
}
