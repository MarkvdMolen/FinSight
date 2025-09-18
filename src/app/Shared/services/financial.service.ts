import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '@shared/services/transaction.service'; 
import { Transaction } from '@shared/models/transaction.model'
import { TransactionResponse } from '@shared/models/transaction-response.model';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {

    private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    private summary = Array.from({ length: 12 }, () => ({ income: 0, expenses: 0 }));

    private monthMap: Record<string, number> = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    constructor(private transactionService: TransactionService) {}

  /**
   * Fetches transactions and processes them into monthly summary for income and expenses.
   */
  getMonthlySummary(): Observable<any> {
    // return this.transactionService.getTransactions().pipe(
    //   map((response: TransactionResponse) =>
    //     this.calculateMonthlySummary(response.content)
    //   )
    // );
      return of(this.calculateMonthlySummary(data));
  }

    /**
    * Aggregates raw transaction data into a monthly summary for chart rendering.
    *
    * Each transaction is expected to contain at least:
    * - `month`   → full month name as string (e.g., "January", "March")
    * - `income`  → income amount for that transaction (number, optional)
    * - `expense` → expense amount for that transaction (number, optional)
    *
    * The function:
    *  1. Normalizes month strings into month indices.
    *  2. Aggregates income and expenses per month.
    *  3. Returns two series objects (Income and Expenses) in ngx-charts format.
    * 
    * @param {Array<any>} transactions - List of transaction objects containing
    *   `month`, `income`, and `expense` fields.
    *
    * @returns {Array<{name: string, series: {name: string, value: number}[]}>}
    *   An array with two objects: one for "Income" and one for "Expenses",
    *   each containing a `series` array with monthly values.
    */
    private calculateMonthlySummary(transactions: any[]): any {
        for (const transaction of transactions) {
            const monthIndex = this.monthMap[transaction.month.trim().toLowerCase()];
            if (monthIndex === undefined) continue;

            this.summary[monthIndex].income += transaction.income ?? 0;
            this.summary[monthIndex].expenses += transaction.expense ?? 0;
        }

        const buildSeries = (key: 'income' | 'expenses', label: string) => ({
            name: label,
            series: this.summary.map((val: any, idx: number) => ({
                name: this.monthNames[idx],
                value: val[key]
            }))
        });

        return [
            buildSeries('income', 'Income'),
            buildSeries('expenses', 'Expenses')
        ];
    }
}