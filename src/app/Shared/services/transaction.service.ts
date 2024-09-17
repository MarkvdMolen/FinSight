import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private cacheKey = 'transactionsCache';

  constructor(private http: HttpClient) { }

  // Fetch transactions from the API
  getTransactions(): Observable<any[]> {
    const cachedData = this.getCachedTransactions();
    if (cachedData) {
      console.log('Using cached data:', cachedData);
      return of(cachedData);
    } else {
      const url = 'http://localhost:8080/api/transactions/all';
      return this.http.get<any[]>(url);
    }
  }

  // Cache transactions in localStorage
  cacheTransactions(transactions: any[]): void {
    const dataToCache = {
      data: transactions,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(dataToCache));
  }

  // Methode om een transactie te updaten
  updateTransaction(transaction: any): Observable<any> {
    const url = `http://localhost:8080/api/transactions/${transaction.transactions_id}`;
    return this.http.put(url, transaction);  // Voer de PUT-aanroep uit
  }

  // Retrieve cached transactions
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

  // Clear the cache
  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }
}