import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription, tap, catchError, of } from 'rxjs';
// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';
import { TransactionResponse } from '@shared/models/transaction-response.model';
import { MatchResult } from '@shared/models/match-result.model';
import { ClassificationService } from '@shared/services/classification.service';
import { MatSort } from '@angular/material/sort';

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
      MatSelectModule
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
    ]; // Match Transaction Model to kv for display of table

    transactions: Transaction[] = [];
    editingTransaction: Transaction | null = null;
    isLoading = true;
    ruleBasedColoring: { [id: number]: boolean } = {}; // var to store two colors in
    sortDirection: 'asc' | 'desc' = 'asc';  
    sortedColumn: string = 'transactionsId'; 
    filterCriteria: string = '';  
    pageIndex: number = 0;  
    pageSize: number = 10;  
    totalRecords: number = 0;
    classifications: any;  // de JSON-structuur uit MongoDB
    classificationLabels = ['Unclassified','Manual','Rule‑based','ML'];
    totalItems: number = 0;

    // Voor paginering en sortering
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // Search parameters
    searchText: string = '';
    searchFields: string[] = ['recipient', 'description', 'category'];
    exactAmount: number | null = null;



    private transactionService = inject(TransactionService);
    private classificationService = inject(ClassificationService);
	private transactionSubscription: Subscription | undefined;

    ngOnInit() {
        this.fetchTransactions();
        this.classificationService.getClassifications().subscribe(data => {
            this.classifications = data; // Fetch JSON from DB
        }); 
    }

    ngAfterViewInit() {
        // Paginator binding (optioneel)
    }

	ngOnDestroy(): void {
		this.transactionSubscription?.unsubscribe();
	}

	/**
	 * Handler voor paginawijzigingen vanuit de Material paginator.
	 *
	 * @param event - Het paginagebeurtenis-object van Angular Material,
	 *                met informatie over de nieuwe `pageIndex` en `pageSize`.
	 */
    onPageChange(event: PageEvent): void {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		
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
        const sortBy = this.sort ? this.sort.active : 'date';
        const direction = this.sort ? this.sort.direction : 'asc';
    
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

    // 2) Recursieve helper: doorloop de tree, zoek een match in leaf-arrays
    private searchNode(node: any, path: string[], text: string): { path: string[]; match: string } | null {
        for (const key of Object.keys(node)) {
            const value = node[key];
            const newPath = [...path, key];

            if (Array.isArray(value)) {
                // we zitten op een leaf: een array van keywords
                for (const kw of value) {
                    if (text.includes(kw.toLowerCase())) {
                        return { path: newPath, match: kw };
                    }
                }
            } 
            else if (value && typeof value === 'object') {
                // geneste map: duik dieper
                const found = this.searchNode(value, newPath, text);
                if (found) {
                    return found;
                }
            }
            // anders: skip niet-array, niet-object (bv. string/number)
        }
        return null;
    }

    // 3) Pas ruleBasedMatch aan zodat het de structuur gebruikt
    ruleBasedMatch(description: string, recipient: string): MatchResult | null {
        if (!this.classifications) return null;  // nog niet ingeladen
       
        const text = `${description} ${recipient}`.toLowerCase();
        const result = this.searchNode(this.classifications, [], text);
       
        if (!result) { return null; }
        
        const { path, match } = result; // Match variables to return type of searchNode

        return {
          type: path[0],
          category: path[1] || path[0],
          subcategory: path[path.length - 1],
          match
        };
    }

    /**
     * Execute rule-based classification on all Transactions that dont have a category.
     */
    classifyAll(): void {
        for (const transaction of this.transactions) {
            if (!transaction.category?.trim()) {
                const match = this.ruleBasedMatch(transaction.description, transaction.recipient);
                if (match) {
                    transaction.category = match.subcategory; // Might want to edit
                    transaction.classificationSource = 2;
                    this.ruleBasedColoring[transaction.transactionsId] = true;
                }
            }
        }
    }

    /*
    * Function that will bulk save al currently edited fields
    */
    pushAllTransactions(): void {
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
    sortData(column: string): void {
        console.log(column)
        console.log(this.sortedColumn)
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
}