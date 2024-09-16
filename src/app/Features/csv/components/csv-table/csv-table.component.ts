import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-csv-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.css']
})
export class CsvTableComponent implements OnInit {

  transactions: any[] = [];
  private cacheKey = 'transactionsCache';  // De key voor localStorage
  editingTransaction: any = null;  // Huidige transactie die wordt bewerkt

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const cachedData = this.getCachedTransactions();
    if (cachedData) {
      // Als er data in de cache zit, gebruik deze dan
      console.log('Using cached data:', cachedData);
      this.transactions = cachedData;
    } else {
      // Zo niet, haal de data van de API en sla deze op in de cache
      this.getTransactions().subscribe((data: any[]) => {
        console.log('Fetched data from API:', data);
        this.transactions = data;
        this.cacheTransactions(data);  // Sla de data op in de cache
      });
    }
  }

  // Methode om de transacties op te halen van het API-endpoint
  getTransactions(): Observable<any[]> {
    const url = 'http://localhost:8080/api/transactions/all';  // Je API-endpoint
    return this.http.get<any[]>(url);
  }

  // Methode om een transactie te updaten
  updateTransaction(transaction: any): Observable<any> {
    const url = `http://localhost:8080/api/transactions/${transaction.transactions_id}`;
    return this.http.put(url, transaction);  // Voer de PUT-aanroep uit
  }

  // Bewerkingsfunctie
  editTransaction(transaction: any) {
    this.editingTransaction = { ...transaction };  // Maak een kopie van de te bewerken transactie
  }

  // Methode om de wijzigingen op te slaan
  saveTransaction() {
    this.updateTransaction(this.editingTransaction).subscribe((updatedTransaction) => {
      const index = this.transactions.findIndex(t => t.transactions_id === updatedTransaction.transactions_id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;  // Werk de transactie bij in de lijst
      }
      this.editingTransaction = null;  // Stop met bewerken
    });
  }

  cancelEdit() {
    this.editingTransaction = null;  // Annuleer het bewerken
  }

  // Functie om data op te slaan in localStorage
  cacheTransactions(transactions: any[]): void {
    const dataToCache = {
      data: transactions,
      timestamp: Date.now()
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(dataToCache));
  }

  // Functie om data op te halen uit de cache
  getCachedTransactions(): any[] | null {
    const cached = localStorage.getItem(this.cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheDuration = 1000 * 60 * 10;  // Cache geldigheid van 10 minuten
      const isCacheValid = Date.now() - parsed.timestamp < cacheDuration;
      if (isCacheValid) {
        return parsed.data;
      } else {
        this.clearCache();  // Invalideer de cache als deze verlopen is
      }
    }
    return null;  // Als er geen geldige cache is, retourneer null
  }

  // Functie om de cache te wissen
  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }
}