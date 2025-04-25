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
import { TxActionsComponent } from "../tx-actions/tx-actions.component";

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
    TxActionsComponent
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

    ngAfterViewInit() {
        // Paginator binding (optioneel)
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

    // TODO ONLY APPLY LOADING IF IT TAKES MORE THAN 2 Seconds
	/**
	 * Haalt transacties op van de backend met de huidige filter-, sorteer- en paginatie-instellingen.
	 *
	 * 1. Zet de `isLoading` vlag aan om een laadindicator te tonen.
	 * 2. Unsubscribet van een eerdere subscription (indien aanwezig) om memory leaks te voorkomen.
	 * 3. Roept `TransactionService.getTransactions(...)` aan met de huidige sorteer- en paginatieconfiguratie.
	 * 4. Zodra de data binnenkomt:
	 *    - Wordt de `transactions` lijst bijgewerkt.
	 *    - Wordt de `isLoading` vlag uitgezet.
	 * 5. Bij een fout:
	 *    - Wordt de fout gelogd.
	 *    - De `isLoading` vlag wordt alsnog uitgezet.
	 *    - Er wordt een lege lijst teruggegeven als fallback.
	 */
	fetchTransactions(): void {
        this.isLoading = true;
        this.ruleBasedColoring = {};
		this.ngOnDestroy();

        const page = this.paginator ? this.paginator.pageIndex : 0;
        const size = this.paginator ? this.paginator.pageSize : 10;
        const sortBy = this.sortedBy || 'date';
        const direction = this.sortDirection || 'asc';
    
        this.transactionService.getTransactions(
            this.searchText,
            this.searchFields,
            this.exactAmount,
            sortBy,
            direction,
            page,
            size
        ).subscribe({
            next: (response: TransactionResponse) => {
                this.transactions = response.content;
                this.totalItems = response.totalElements;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Fout bij laden transacties', err);
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
     * Attempts to match a given text to a category based on given classifications for a category.
     * @param text The combined description and recipient string to match.
     * @returns The matched category name, or null if no match is found.
     */
    private _matchCategory(text: string): string | null {
        const lowerText = text.toLowerCase();
        const categories = this.classificationsCategories;

        for (const [category, tags] of Object.entries(categories)) {
            for (const tag of tags) {
                if (lowerText.includes(tag.toLowerCase())) {
                    return category;
                }
            }
        }
        return null;
    }   

    /**
     * Classifies all unclassified transactions using rule-based keyword matching.
     * Updates the category and classificationSource if a match is found.
     */
    classifyAllTransactions() {
        for (const tx of this.transactions) {
            if (tx.classificationSource !== 0) { return } // Don't classify if its already classified

            const text = `${tx.description} ${tx.recipient}`;
            const matchedCategory = this._matchCategory(text);

            if (matchedCategory) {
                tx.category = matchedCategory;
                tx.classificationSource = 2;
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