import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DefaultSummary } from '@shared/models/data_views/default-summary.model';

import { BarChartComponent } from "@shared/components/charts/bar-chart/bar-chart.component";
import { PieChartComponent } from "@shared/components/charts/pie-chart/pie-chart.component";
import { DisplayCardComponent } from '../overview-view/components/display-card/display-card.component';
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { ExpenseIncomeLineChartComponent } from "../overview-view/components/expense-income-line-chart/expense-income-line-chart.component";

@Component({
  selector: 'app-expenses-view',
  standalone: true,
  imports: [CommonModule, BarChartComponent, PieChartComponent, DisplayCardComponent, MissingFilesComponent, ExpenseIncomeLineChartComponent],
  templateUrl: './expenses-view.component.html',
  styleUrl: './expenses-view.component.css'
})
export class ExpensesView {
    // Not needed
    @Input() monthlySummary$!: Observable<DefaultSummary[]>;
    @Input() avg$!: Observable<any>;
    @Input() incCat$!: Observable<any>;
    // Needed
    @Input() expCat$!: Observable<any>;

      monthlyChartSummary$!: Observable<DefaultSummary[]>;
    
      ngOnInit(): void {
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