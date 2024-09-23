import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  public hasData: boolean = false;
  private cacheKey = 'transactionsCache';

  constructor(private http: HttpClient) { }

  /**
   * Fetch transactions with sorting, filtering, and pagination from the backend.
   * @param sortBy The column to sort by.
   * @param direction The sorting direction ('asc' or 'desc').
   * @param filter The filtering criteria.
   * @param page The page number for pagination.
   * @param size The number of items per page.
   */
  getTransactions(
    sortBy: string = 'date',
    direction: string = 'asc',
    filter: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<any[]> {
    const cachedData = this.getCachedTransactions();
    if (cachedData) {
      // TODO REMOVE LOGGING AFTER COMPLETION
      console.log('Using cached data:', cachedData);
      return of(cachedData);
    } else {
      const url = 'http://localhost:8080/api/transactions';
      let params = new HttpParams()
        .set('sort', sortBy)
        .set('direction', direction)
        .set('filter', filter)
        .set('page', page.toString())
        .set('size', size.toString());

      // extract `content` from the response json
      return this.http.get<any>(url, { params }).pipe(
        map(response => response.content)  
      );
    }
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
  updateTransaction(transaction: any): Observable<any> {
    const url = `http://localhost:8080/api/transactions/${transaction.transactions_id}`;
    return this.http.put(url, transaction);  // Perform PUT request
  }

  /**
   * Retrieve cached transactions from localStorage.
   * @returns Cached transactions or null if the cache is invalid.
   */
  getCachedTransactions(): any[] | null {
    const cached = localStorage.getItem(this.cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheDuration = 1000 * 60 * 10; // 10 minutes
      const isCacheValid = Date.now() - parsed.timestamp < cacheDuration;
      if (isCacheValid) {
        return parsed.data;
      } else {
        this.clearCache();
      }
    }
    return null;
  }

  /**
   * Clear the cached transactions.
   */
  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  /**
   * Check if there is data available (from cache or backend).
   */
  checkData() {
    this.getTransactions().subscribe(transactions => {
      if (transactions && transactions.length > 0) {
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }

  getData() {
    return this.hasData;
  }
}