import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';

@Component({
  selector: 'app-csv-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.css']
})
export class CsvTableComponent implements OnInit {
  headers = [
    { key: 'transactions_id', label: 'ID' },
    { key: 'account', label: 'Account' },
    { key: 'recipient', label: 'Recipient' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' }
  ];

  transactions: Transaction[] = [];
  editingTransaction: Transaction | null = null;
  isLoading = true;

  // For sorting, filtering, and pagination
  sortDirection: 'asc' | 'desc' = 'asc';  // Default sorting direction
  sortedColumn: string = 'date';  // Default sorted column
  filterCriteria: string = '';  // Default filter criteria
  currentPage: number = 0;  // Pagination - current page
  pageSize: number = 10;  // Pagination - page size

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.fetchTransactions();
  }

  /**
   * Fetches transactions from the server with sorting, filtering, and pagination.
   */
  fetchTransactions() {
    this.isLoading = true;
    
    // Fetch transactions from the service, passing sorting, filtering, and pagination params
    this.transactionService.getTransactions(this.sortedColumn, this.sortDirection, this.filterCriteria, this.currentPage, this.pageSize)
      .subscribe((data: Transaction[]) => {
        this.transactions = data;
        this.isLoading = false;
      }, error => {
        console.error('Error fetching transactions', error);
        this.isLoading = false;
      });
  }

  /**
   * Sorts data based on the clicked column.
   * @param column The column to sort by.
   */
  sortData(column: string) {
    if (this.sortedColumn === column) {
      // Toggle sorting direction if the same column is clicked again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column to sort by and default to ascending
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }
    this.fetchTransactions();  // Re-fetch sorted data
  }

  /**
   * Applies a filter and fetches the filtered data.
   * @param criteria The filtering criteria to apply.
   */
  applyFilter(criteria: string) {
    this.filterCriteria = criteria;
    this.fetchTransactions();  // Re-fetch filtered data
  }

  /**
   * Handles pagination change.
   * @param page The new page to navigate to.
   */
  changePage(page: number) {
    this.currentPage = page;
    this.fetchTransactions();  // Re-fetch paginated data
  }

  /**
   * Initiates editing of a transaction.
   * @param {Transaction} transaction - The transaction to edit.
   */
  editTransaction(transaction: Transaction) {
    this.editingTransaction = { ...transaction };  // Deep copy to avoid mutating the original object before saving
  }

  /**
   * Saves the edited transaction.
   * Updates the transaction via the service and refreshes the local data.
   */
  saveTransaction() {
    if (this.editingTransaction) {
      this.transactionService.updateTransaction(this.editingTransaction).subscribe((updatedTransaction: Transaction) => {
        const index = this.transactions.findIndex(t => t.transactions_id === updatedTransaction.transactions_id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
        this.editingTransaction = null;

        // Update the cache with the modified transactions
        this.transactionService.cacheTransactions(this.transactions);
      });
    }
  }

  /**
   * Cancels the editing process.
   */
  cancelEdit() {
    this.editingTransaction = null;
  }
}