import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';
import rawClassifications from '../../../../../../public/classifications.json'

type Classifications = {
    [hoofdtype: string]: {
      [categorie: string]: {
        [subcategorie: string]: string[]
      }
    }
  };
  
const classifications: Classifications = rawClassifications;

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
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' }
  ];

  transactions: Transaction[] = [];
  editingTransaction: Transaction | null = null;
  isLoading = true;
  
  ruleBasedColoring: { [id: number]: boolean } = {}; // bijhouden wie geel moet worden

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
        this.transactionService.getTransactions(this.sortedColumn, this.sortDirection, this.filterCriteria, this.currentPage, this.pageSize).subscribe((data: Transaction[]) => {
            this.transactions = data;
            this.isLoading = false;
        }, error => {
            console.error('Error fetching transactions', error);
            this.isLoading = false;
        });
    }

    ruleBasedMatch(description: string, recipient: string) {
        const tekst = `${description} ${recipient}`.toLowerCase();

        for (const hoofdtype in classifications) {
            const categorieën = classifications[hoofdtype];
        for (const categorie in categorieën) {
            const subcategorieën = categorieën[categorie];
            for (const subcategorie in subcategorieën) {
            const trefwoorden: string[] = subcategorieën[subcategorie];
            for (const trefwoord of trefwoorden) {
                if (tekst.includes(trefwoord.toLowerCase())) {
                return {
                    soort: hoofdtype,
                    categorie,
                    subcategorie,
                    match: trefwoord
                };
                }
            }
            }
        }
        }
        return null;
      }

    classifyAll() {
        for (let t of this.transactions) {
            if (!t.category || t.category.trim() === '') {
                const match = this.ruleBasedMatch(t.description, t.recipient);
                if (match) {
                    t.category = match.subcategorie;
                    this.ruleBasedColoring[t.transactions_id] = true;
                }
            }
        }
    }

    pushAllTransactions() {
        this.transactionService.pushAllTransactions(this.transactions).subscribe({
            next: () => {
                alert('Transacties succesvol opgeslagen!');
            },
            error: (err) => {
                alert('Fout bij het opslaan van transacties.');
            }
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