/**
 * @fileoverview CsvTableComponent displays and allows editing of transaction data in a table format.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';

@Component({
  selector: 'app-csv-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.css']
})
export class CsvTableComponent implements OnInit {

    /**
     * Array to store transaction data.
     * @type {Transaction[]}
     */
    transactions: Transaction[] = [];

    /**
     * Current transaction being edited.
     * @type {Transaction | null}
     */
    editingTransaction: Transaction | null = null;

    /**
     * Creates an instance of CsvTableComponent.
     *
     * @param {TransactionService} transactionService - Service to handle transaction data.
     */
    constructor(private transactionService: TransactionService) { }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     * Fetches transactions on component initialization.
     */
    ngOnInit() {
      this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
        this.transactions = data;
      });
    }

    /**
     * Initiates editing of a transaction.
     * @param {Transaction} transaction - The transaction to edit.
     */
    editTransaction(transaction: Transaction) {
      // Make a deep copy to avoid mutating the original object before saving
      this.editingTransaction = { ...transaction };
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




















  // // Bewerkingsfunctie
  // editTransaction(transaction: any) {
  //   this.editingTransaction = { ...transaction };  // Maak een kopie van de te bewerken transactie
  // }

  // // Methode om de wijzigingen op te slaan
  // saveTransaction() {
  //   this.updateTransaction(this.editingTransaction).subscribe((updatedTransaction) => {
  //     const index = this.transactions.findIndex(t => t.transactions_id === updatedTransaction.transactions_id);
  //     if (index !== -1) {
  //       this.transactions[index] = updatedTransaction;  // Werk de transactie bij in de lijst
  //     }
  //     this.editingTransaction = null;  // Stop met bewerken
  //   });
  //   this.clearCache();
  // }

  // cancelEdit() {
  //   this.editingTransaction = null;  // Annuleer het bewerken
  // }





