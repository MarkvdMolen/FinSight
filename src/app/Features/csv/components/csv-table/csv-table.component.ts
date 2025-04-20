import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
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
import rawClassifications from '../../../../../../public/classifications.json'
import { TransactionResponse } from '@shared/models/transaction-response.model';
import { MatchResult } from '@shared/models/match-result.model';

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
    classificationLabels = ['Ongeclassificeerd','Manueel','Rule‑based','ML'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    private transactionService = inject(TransactionService);
	private transactionSubscription: Subscription | undefined;

    ngOnInit() {
        this.fetchTransactions();
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

		this.transactionSubscription = this.transactionService.getTransactions(
			this.sortedColumn,
			this.sortDirection,
			this.filterCriteria,
			this.pageIndex,
			this.pageSize
		).pipe(
			tap((data: TransactionResponse) => {
				this.transactions = data.content; 
				this.totalRecords = data.totalElements;
				this.isLoading = false;
			}),
			catchError(error => {
				console.error('Error fetching transactions', error);
				this.isLoading = false;
				return of([]); 
			})
		).subscribe();
	}

    /**
     * Doorzoekt de classificatieregels op basis van tekst in de transactie-omschrijving
     * en tegenpartij, en retourneert de eerste match.
     *
     * - Combineert `description` en `recipient` tot één zoekbare tekststring.
     * - Vergelijkt deze tekst met alle trefwoorden in de JSON-classificatiestructuur.
     * - Doorloopt de hiërarchie: hoofdtype → categorie → subcategorie → trefwoord.
     * - Zodra een trefwoord voorkomt in de tekst, retourneert het matchresultaat.
     * - Als er geen match is, retourneert de functie `null`.
     * 
     * MAP GEBRUIKEN? KIJKEN OF DE NESTED FOR LOOP ER UIT KAN
     *
     * @param description - De omschrijving van de transactie (bijv. uit de bankregel).
     * @param recipient - De tegenpartij of ontvanger van de transactie.
     * @returns Een object met de gevonden match { soort, categorie, subcategorie, match }
     *          of `null` als er geen match is gevonden.
     */
    ruleBasedMatch(description: string, recipient: string): MatchResult | null {
        const transaction_data = `${description} ${recipient}`.toLowerCase();

        for (const type in classifications) {
            for (const category in classifications[type]) {
                for (const subcategory in classifications[type][category]) {
                    for (const trefwoord of classifications[type][category][subcategory]) {
                        if (transaction_data.includes(trefwoord.toLowerCase())) {
                            return {
                                type: type,
                                category,
                                subcategory,
                                match: trefwoord
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Execute rule-based classification on all Transactions that dont have a category.
     */
    classifyAll(): void {
        for (let t of this.transactions) {
            if (!t.category || t.category.trim() === '') { // If Category is Empty then
                const match = this.ruleBasedMatch(t.description, t.recipient); // Check if there is a match
                if(match) { // If there is a match then
                    t.category = match.subcategory; // Replace the empty value with a category
                    t.classificationSource = 2;
                    this.ruleBasedColoring[t.transactionsId] = true; // and set Color
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