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

import { map, Observable} from 'rxjs';
import { FinancialService } from '@shared/services/financial.service';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule, 
    CommonModule, 
    GreetingsComponent, 
    DisplayCardComponent, 
    ExpenseIncomeLineChartComponent, 
    MissingFilesComponent, 
    SummaryTableComponent, 
    Dropdown
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {
    years: number[] = [2023, 2024, 2025];
    selectedYear = new Date().getFullYear(); 

    monthlySummary$!: Observable<any>;
    monthlyChartSummary$!: Observable<any>;
  
    constructor(private financialService: FinancialService) {}

    ngOnInit(): void {
        this.loadData(this.selectedYear);
    }

    onYearChange(year: number): void {
        this.selectedYear = year;
        this.loadData(year);
    }

    private loadData(year: number): void {
        this.monthlySummary$ = this.financialService.getMonthlyIncomeAndOutcome(year);
        this.monthlyChartSummary$ = this.buildChartSummary(this.monthlySummary$);
    }


    /**
     * Transforms a stream of `DefaultSummary[]` into a chart-friendly structure
     * for use with ngx-charts.
     *
     * Each `DefaultSummary` item is mapped into two series:
     *  - **Income**: values from the `income` property
     *  - **Expenses**: values from the `expense` property
     *
     * @param source$ Observable emitting arrays of `DefaultSummary` objects.
     * @returns Observable emitting a chart data array, where each entry has:
     *   - `name`: the label of the series ("Income" or "Expenses")
     *   - `series`: an array of `{ name: string, value: number }` points
     */
    private buildChartSummary(source$: Observable<DefaultSummary[]>): Observable<any[]> {
        return source$.pipe(
            map(data => [
                this.buildSeries('Income', data, item => item.income),
                this.buildSeries('Expenses', data, item => item.expense)
            ])
        );
    }

    /**
     * Builds a single chart series object for use with ngx-charts.
     *
     * Iterates over an array of `DefaultSummary` objects and transforms
     * each entry into a `{ name, value }` point, where:
     *  - `name` is the month label from the `DefaultSummary`
     *  - `value` is derived by applying the provided `selector` function
     *
     * @param name - The label of the chart series (e.g. "Income", "Expenses").
     * @param data - The list of `DefaultSummary` items to transform.
     * @param selector - A function that extracts the numeric value from
     *   each `DefaultSummary` (e.g. `item => item.income`).
     *
     * @returns An object with:
     *   - `name`: the series label
     *   - `series`: an array of `{ name: string, value: number }` points
     */
    private buildSeries(name: string, data: DefaultSummary[], selector: (item: DefaultSummary) => number) {
        return {
            name,
            series: data.map(item => ({
                name: item.month,
                value: selector(item)
            }))
        };
    }
    
}
