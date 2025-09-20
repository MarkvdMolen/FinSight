import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/components/display-card/display-card.component";

// Shared imports
import { ExpenseIncomeLineChartComponent } from "@features/overview/components/expense-income-line-chart/expense-income-line-chart.component";
import { SummaryTableComponent } from '@shared/components/tables/summary-table/summary-table.component';
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { CommonModule } from '@angular/common';

import { filter, map, Observable, shareReplay, tap } from 'rxjs';
import { FinancialService } from '@shared/services/financial.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, GreetingsComponent, DisplayCardComponent, ExpenseIncomeLineChartComponent, MissingFilesComponent, SummaryTableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {

    chartHasData = false;
    
    monthlySummary$!: Observable<any>;
    // hasData = new EventEmitter<boolean>();

    private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    private monthMap: Record<string, number> = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    private summary = Array.from({ length: 12 }, () => ({ income: 0, expenses: 0 }));
  
    constructor(private financialService: FinancialService) {}

    ngOnInit() {
        this.monthlySummary$ = this.getMonthlySummary(2025);
    }
    
  /**
     * Retrieves the monthly income and expense summary for a given year.
     *
     * This method fetches raw transaction summary data from the financial service
     * (`getMonthlyIncomeAndOutcome`), filters out empty results, transforms the data
     * into a chart-ready format using `calculateMonthlySummary`, and ensures the
     * resulting observable is shared and replayed across multiple subscribers.
     *
     * Processing steps:
     *  1. Calls the API to fetch income/expense data per month.
     *  2. Filters out empty arrays to avoid generating default values.
     *  3. Maps the raw response to the ngx-charts compatible format.
     *  4. Uses `shareReplay(1)` to cache the result, preventing multiple API calls
     *     when used with multiple subscribers or async pipes.
     *
     * @param {number} year - The year for which the monthly summary should be retrieved.
     * @returns {Observable<any>} An observable that emits chart-ready data for income
     *   and expenses per month, or completes without emitting if the response is empty.
     */
    public getMonthlySummary(year: number): Observable<any> {
        return this.financialService.getMonthlyIncomeAndOutcome(year).pipe(
            filter(data => Array.isArray(data) && data.length > 0),
            map(data => this.calculateMonthlySummary(data)),
            shareReplay(1)
        );
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
