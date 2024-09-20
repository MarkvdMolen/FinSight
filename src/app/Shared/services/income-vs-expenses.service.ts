import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '@shared/services/transaction.service'; 
import { Transaction } from '@shared/models/transaction.model'

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor(private transactionService: TransactionService) {}

  /**
   * Fetches transactions and processes them into monthly summary for income and expenses.
   */
  getMonthlySummary(): Observable<any> {
    return this.transactionService.getTransactions().pipe(
      map((transactions: Transaction[]) => this.calculateMonthlySummary(transactions))
    );
  }

  /**
   * Processes the transaction data to prepare it for the financial chart.
   * Aggregates transaction amounts by month.
   */
  private calculateMonthlySummary(transactions: Transaction[]): any {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const summary: any = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth(); // Get the month index (0 for Jan, 11 for Dec)

      if (!summary[month]) {
        summary[month] = { income: 0, expenses: 0 };
      }

      if (transaction.amount >= 0) {
        summary[month].income += transaction.amount;
      } else {
        summary[month].expenses += Math.abs(transaction.amount); // Convert expenses to positive
      }
    });

    // Create the series for "Income" and "Expenses" categories
    const incomeSeries = {
      name: 'Income',
      series: Object.keys(summary).map(monthIndex => {
        const numericMonthIndex = parseInt(monthIndex, 10);
        return {
          name: monthNames[numericMonthIndex], 
          value: summary[numericMonthIndex].income,
        };
      }),
    };

    const expenseSeries = {
      name: 'Expenses',
      series: Object.keys(summary).map(monthIndex => {
        const numericMonthIndex = parseInt(monthIndex, 10);
        return {
          name: monthNames[numericMonthIndex],
          value: summary[numericMonthIndex].expenses,
        };
      }),
    };

    // Combine the two categories into the final summary
    return [incomeSeries, expenseSeries];
  }
}