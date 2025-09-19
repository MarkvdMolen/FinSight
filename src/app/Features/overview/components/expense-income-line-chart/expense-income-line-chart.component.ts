import { Component, OnInit } from '@angular/core';
import { FinancialService } from '@shared/services/financial.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-expense-income-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './expense-income-line-chart.component.html',
  styleUrl: './expense-income-line-chart.component.css'
})
export class ExpenseIncomeLineChartComponent implements OnInit {

    // Ngx-charts Options
    view: [number, number] = [700, 400];
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Month';
    yAxisLabel: string = 'Amount (€)';
    timeline: boolean = true;
  
    colorScheme: Color = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#019b98', '#dd0025']
    };
  
    gradient: boolean = true;
    autoScale: boolean = true;
    curve: any = shape.curveBumpX

    monthlySummary$!: Observable<any>;
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
     * Retrieves the monthly transaction summary for the given year and transforms
     * the raw API response into chart-ready data using `calculateMonthlySummary`.
     *
     * @param {number} year - The year for which the summary should be calculated.
     * @returns {Observable<any>} An observable that emits processed data formatted 
     *   for charting (e.g., income vs. expenses per month).
     */
    public getMonthlySummary(year: number): Observable<any> {
        return this.financialService.getMonthlyIncomeAndOutcome(year).pipe(
            map(data => this.calculateMonthlySummary(data))
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
