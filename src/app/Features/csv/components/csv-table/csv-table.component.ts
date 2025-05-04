import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';
import { TransactionResponse } from '@shared/models/transaction-response.model';
import { ClassificationService } from '@shared/services/classification.service';
import { ClassificationLogicService } from '../../services/classification-logic.service';
import { TxActionsComponent } from "../tx-actions/tx-actions.component";
import { TableHeaderComponent } from "../table-header/table-header.component";
import { TableRowComponent } from '../table-row/table-row.component';
import { TransactionFilterOptions } from '@shared/models/transaction-filter-options.model';

@Component({
    selector: 'app-csv-table',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    TxActionsComponent,
    TableHeaderComponent,
    TableRowComponent
],
    templateUrl: './csv-table.component.html',
    styleUrls: ['./csv-table.component.css']
})
export class CsvTableComponent implements OnInit {
    headers = [
        { key: 'transactionsId', label: 'ID' },
        { key: 'account', label: 'Account' },
        { key: 'recipient', label: 'Recipient' },
        { key: 'description', label: 'Description' },
        { key: 'classificationSource', label: 'Classification Type' },
        { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount' },
        { key: 'date', label: 'Date' }
    ]; 

    transactions: Transaction[] = [];
    editingTransaction: Transaction | null = null;
    isLoading = true;
    ruleBasedColoring: { [id: number]: boolean } = {}; // var to store two colors in
    
    sortDirection: 'asc' | 'desc' = 'asc';  
    sortedBy: string = 'transactionsId'; 
    filterCriteria: string = '';  
    
    classifications: any;  // de JSON-structuur uit MongoDB
    
    classificationsCategories: Record<string, string[]> = {};
    filteredCategories$!: Observable<string[]>;  // Async observable voor filtering
    categoryControl = new FormControl('');  // FormControl voor binding

    classificationLabels = ['Unclassified','Manual','Rule‑based','ML'];
    totalItems: number = 0;

    // Voor paginering en sortering
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search parameters
    searchText: string = '';
    searchFields: string[] = ['recipient', 'description', 'category'];
    exactAmount: number | null = null;

    private transactionService = inject(TransactionService);
    private classificationService = inject(ClassificationService);
    private classificationLogicService = inject(ClassificationLogicService);
	private transactionSubscription: Subscription | undefined;

    ngOnInit() {
        this.fetchTransactions();
        this.getListOfClassificationsCategories();

        this.classificationService.getClassifications().subscribe(data => {
            this.classifications = data; // Fetch JSON from DB
        }); 

        // Initilaize Observable on Form with every change execute
        this.filteredCategories$ = this.categoryControl.valueChanges.pipe( 
            startWith(''),  // Begin direct met lege input
            map(value => this._filterCategories(value || ''))   //
        );
    }

	ngOnDestroy(): void {
		this.transactionSubscription?.unsubscribe();
	}

    private _filterCategories(value: string): string[] {
        const filterValue = value.toLowerCase();
        return Object.keys(this.classificationsCategories).filter(option =>
          option.toLowerCase().includes(filterValue)
        );
    }  

	/**
	 * Handler voor paginawijzigingen vanuit de Material paginator.
	 *
	 * @param event - Het paginagebeurtenis-object van Angular Material,
	 *                met informatie over de nieuwe `pageIndex` en `pageSize`.
	 */
    onPageChange(event: PageEvent): void {
        const sizeChanged = event.pageSize !== this.paginator.pageSize;
        this.paginator.pageSize = event.pageSize;
      
        if (sizeChanged) {
          this.paginator.pageIndex = 0; // reset to first page
        }

        this.fetchTransactions()
    }

    /**
     * Fetches transactions using filter, sort and pagination settings.
     * Uses the `TransactionService.fetchTransactionsWithFilters` method and updates the local transaction state.
     * A loading spinner is shown only if the request takes longer than 2 seconds.
     */
    fetchTransactions(): void {
        this.transactionSubscription?.unsubscribe();
        this.ruleBasedColoring = {};

        let showSpinner = true;
        const loadingDelay = setTimeout(() => {
            if (showSpinner) this.isLoading = true;
        }, 2000);
      
        const filters: TransactionFilterOptions = {
            searchText: this.searchText,
            searchFields: this.searchFields,
            exactAmount: this.exactAmount,
            sortBy: this.sortedBy || 'date',
            direction: this.sortDirection || 'asc',
            page: this.paginator?.pageIndex ?? 0,
            size: this.paginator?.pageSize ?? 10
        };

        // Subscribe to the backend response
        this.transactionSubscription = this.transactionService
            .fetchTransactionsWithFilters(filters)
            .subscribe({
                next: (response) => {
                    clearTimeout(loadingDelay);
                    showSpinner = false;
                    this.transactions = response.content;
                    this.totalItems = response.totalElements;
                    this.isLoading = false;
                },
                error: (err) => {
                    clearTimeout(loadingDelay);
                    showSpinner = false;
                    console.error('Failed to fetch transactions:', err);
                    this.isLoading = false;
                }
        });
    }
      
 
    /**
     * Fetches the list of classification categories from the backend and assigns them to the component state.
     */
    getListOfClassificationsCategories(){
        this.classificationService.getCategories().subscribe(data => {
            this.classificationsCategories = data;
        });
    }

    /**
     * Classifies all unclassified transactions using rule-based keyword matching.
     * Updates the category and classificationSource if a match is found.
     */
    classifyAllTransactions() {
        const updated = this.classificationLogicService.classify(this.transactions, this.classificationsCategories);
        this.transactions = updated;
        // Pas visuele kleurmarkering toe
        for (const tx of updated) {
            if (tx.classificationSource === 2) {
                this.ruleBasedColoring[tx.transactionsId] = true;
            }
        }
    }

    /**
     * Pushes all current transactions to the backend to be saved in bulk.
     * Shows an alert on success or failure.
     */
    pushAllTransactions(): void {
        this.transactionService.pushAllTransactions(this.transactions).subscribe({
            next: () => {
                alert('Transacties succesvol opgeslagen!');
                this.fetchTransactions(); // Refresh
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
    sortData(column: string): void {
        if (this.sortedBy === column) { 
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Toggle sorting direction if the same column is clicked again
        } else {
            // Set new column to sort by and default to ascending
            this.sortedBy = column;
            this._resetPageIndex();
            this.sortDirection = 'asc';
        }
        this.fetchTransactions();  // Re-fetch sorted data
    }

    private _resetPageIndex(): void {
        this.paginator.pageIndex = 0; 
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
    saveTransaction(): void {
        if (!this.editingTransaction) return;   // Guard Clause
    
        this.editingTransaction.classificationSource = 1; // Set to Manually edited
    
        this.transactionService.updateTransaction(this.editingTransaction).subscribe({
            next: (updatedTransaction: Transaction) => {
                console.log('API response:', updatedTransaction);

                const index = this.transactions.findIndex(
                    t => t.transactionsId === updatedTransaction.transactionsId
                );

                if (index !== -1) {
                    this.transactions[index] = updatedTransaction;
                } 
                else {
                    console.warn(`Kon transactie met ID ${updatedTransaction.transactionsId} niet vinden in de bestaande lijst.`);
                }

                this.editingTransaction = null;
                this.transactionService.cacheTransactions(this.transactions);
            },
            error: err => {
                console.error('Kon niet opslaan', err);
            }
        });
    }
  
    /**
     * Cancels the editing process.
     */
    cancelEdit() {
        this.editingTransaction = null;
    }

    isEditing(transaction: Transaction): boolean {
        return this.editingTransaction?.transactionsId === transaction.transactionsId;
    }

    /**
     * Tracks items in the transaction list by their unique transaction ID.
     * Helps Angular optimize DOM updates by preventing full re-renders on list changes.
     * @param index The index of the current item.
     * @param item The transaction item.
     * @returns The transaction ID used for tracking.
     */
    trackById(index: number, item: Transaction): number {
        return item.transactionsId;
    }
}