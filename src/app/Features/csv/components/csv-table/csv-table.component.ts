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
    pageIndex: number = 0;  // Pagination - current page
    pageSize: number = 10;  // Pagination - page size
    totalRecords: number = 0;


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
    onPageChange(event: PageEvent) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		
        this.fetchTransactions()
    }

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
	fetchTransactions() {
		this.isLoading = true;
		this.transactionSubscription?.unsubscribe();

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
    ruleBasedMatch(description: string, recipient: string) {
        const tekst = `${description} ${recipient}`.toLowerCase();

        for (const type in classifications) {
            const categorieën = classifications[type];
        for (const categorie in categorieën) {
            const subcategorieën = categorieën[categorie];
            for (const subcategorie in subcategorieën) {
            const trefwoorden: string[] = subcategorieën[subcategorie];
            for (const trefwoord of trefwoorden) {
                if (tekst.includes(trefwoord.toLowerCase())) {
                return {
                    soort: type,
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


    /**
     * Voert rule-based classificatie uit op alle transacties zonder bestaande categorie.
     */
    classifyAll(): void {
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
    // this.fetchTransactions();  // Re-fetch sorted data
  }

  /**
   * Applies a filter and fetches the filtered data.
   * @param criteria The filtering criteria to apply.
   */
  applyFilter(criteria: string) {
    this.filterCriteria = criteria;
    // this.fetchTransactions();  // Re-fetch filtered data
  }

  /**
   * Handles pagination change.
   * @param page The new page to navigate to.
   */
  changePage(page: number) {
    // this.currentPage = page;
    // this.fetchTransactions();  // Re-fetch paginated data
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