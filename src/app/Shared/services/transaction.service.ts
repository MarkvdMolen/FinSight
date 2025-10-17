import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Transaction } from '@shared/models/transaction.model';
import { TransactionResponse } from '@shared/models/transaction-response.model';
import { ClassificationObject } from '@shared/models/classification-object.model';
import { TransactionFilterOptions } from '@shared/models/transaction-filter-options.model';

const BASE_URL = 'http://localhost:8080/api/transactions';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {

  public hasData: boolean = false;
  private cacheKey = 'transactionsCache';
  private cachedTransactions: TransactionResponse | undefined;
  

  constructor(private http: HttpClient) { }

    /**
     * Haal transacties op met zoekcriteria, paginering en sortering.
     * @param searchText Vrij zoeken in recipient, description, category
     * @param searchFields Kolommen waarop gezocht wordt (bv ["recipient", "description"])
     * @param exactAmount Exact bedrag zoeken (optioneel)
     * @param sortBy Veld waarop gesorteerd wordt
     * @param direction Richting van sortering ('asc' of 'desc')
     * @param page Paginanummer
     * @param size Aantal items per pagina
     */
    getTransactions(
        searchText: string = '',
        searchFields: string[] = ['recipient', 'description', 'category'],
        exactAmount: number | null = null,
        sortBy: string = 'date',
        direction: string = 'asc',
        page: number = 0,
        size: number = 10
    ): Observable<TransactionResponse> {
        let params = new HttpParams()
            .set('searchText', searchText)
            .set('searchFields', searchFields.join(','))
            .set('sort', sortBy)
            .set('direction', direction)
            .set('page', page.toString())
            .set('size', size.toString());

        if (exactAmount !== null) {
            params = params.set('exactAmount', exactAmount.toString());
        }

        return this.http.get<TransactionResponse>(BASE_URL, { params });
    }

    /**
     * Fetches transactions based on provided filter, sort and pagination options.
     *
     * @param filters - An object containing query parameters for filtering, sorting and paging.
     * @returns An observable of paginated transaction results.
     *
     * @example
     * transactionService.fetchTransactionsWithFilters({
     *   searchText: 'supermarkt',
     *   searchFields: ['description', 'recipient'],
     *   exactAmount: null,
     *   sortBy: 'date',
     *   direction: 'asc',
     *   page: 0,
     *   size: 10
     * }).subscribe(res => this.transactions = res.content);
     */
    fetchTransactionsWithFilters(filters: TransactionFilterOptions): Observable<TransactionResponse> {
        return this.getTransactions(
            filters.searchText,
            filters.searchFields,
            filters.exactAmount,
            filters.sortBy,
            filters.direction,
            filters.page,
            filters.size
        );
    }

    /**
     * Bulk update multiple transactions.
     */
    pushAllTransactions(transactions: Transaction[]): Observable<any> {
    	return this.http.put<Transaction[]>(`${BASE_URL}/bulk-update`, transactions);
    }

    /**
    * Count all categorized transactions.
    */
    getCategorizedCount(): Observable<ClassificationObject> {
        return this.http.get<ClassificationObject>(`${BASE_URL}/count-categorized`);
    }
      
    





  /**
   * Cache transactions in localStorage.
   * @param transactions The transactions to cache.
   */
  cacheTransactions(transactions: any[]): void {
    const dataToCache = {
      data: transactions,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(dataToCache));
  }

    /**
     * Update a specific transaction via PUT request.
     * @param transaction The transaction to update.
     */
    updateTransaction(transaction: Transaction): Observable<Transaction> {
        const url = `${BASE_URL}/${transaction.transactionsId}`;
        return this.http.put<Transaction>(url, transaction);
    }
      

  /**
   * Retrieve cached transactions from localStorage.
   * @returns Cached transactions or null if the cache is invalid.
   */
  // getCachedTransactions(): TransactionResponse | undefined {
  //   const cached = localStorage.getItem(this.cacheKey);
  //   if (cached) {
  //     const parsed = JSON.parse(cached);
  //     const cacheDuration = 1000 * 60 * 10; // 10 minutes
  //     const isCacheValid = Date.now() - parsed.timestamp < cacheDuration;
  //     if (isCacheValid) {
  //       return parsed.data;
  //     } else {
  //       this.clearCache();
  //     }
  //   }
  //   return this.cachedTransactions;
  // }

  /**
   * Clear the cached transactions.
   */
  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  /**
   * Check if there is data available (from cache or backend).
   */
  // checkData() {
  //   this.getTransactions().subscribe(transactions => {
  //     if (transactions && transactions.content.length > 0) {
  //       this.hasData = true;
  //     } else {
  //       this.hasData = false;
  //     }
  //   });
  // }

  getData() {
    return this.hasData;
  }
}