import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTableComponent } from "@features/transaction-overview/components/transaction-table/transaction-table.component";
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { TransactionService } from '@shared/services/transaction.service';
import { SearchBarComponent } from "@shared/components/search_components/search-bar/search-bar.component";
import { ClassificationOverviewComponent } from "@shared/components/classification-overview/classification-overview.component";

@Component({
  selector: 'app-transaction-overview-page',
  standalone: true,
  imports: [CommonModule, TransactionTableComponent, MissingFilesComponent, SearchBarComponent, ClassificationOverviewComponent], 
  templateUrl: './transaction-overview-page.component.html',
  styleUrls: ['./transaction-overview-page.component.css']
})
export class TransactionOverviewPageComponent implements OnInit {

    hasData = false;
    isLoading = true;
    @ViewChild('csvTable') csvTable!: TransactionTableComponent;

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
