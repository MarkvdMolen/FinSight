import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DisplayCardComponent } from '@features/overview/views/overview-view/components/display-card/display-card.component';
import { ExpenseIncomeLineChartComponent } from '@features/overview/views/overview-view/components/expense-income-line-chart/expense-income-line-chart.component';
import { MissingFilesComponent } from '@shared/components/missing-files/missing-files.component';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { FinancialService } from '@shared/services/financial.service';
import { map, Observable, tap } from 'rxjs';

export interface TabItem {
	label: string;
	route: string;
}

@Component({
	selector: 'app-overview-view',
	standalone: true,
	imports: [
		CommonModule,
		DisplayCardComponent,
		MissingFilesComponent,
		ExpenseIncomeLineChartComponent
	],
	templateUrl: './overview-view.component.html',
	styleUrl: './overview-view.component.css'
})
export class OverviewView implements OnInit {

	@Input({ required: true }) monthlySummary$!: Observable<DefaultSummary[]>;
	@Input({ required: true }) avg$!: Observable<any>;

	@Input() incCat$!: Observable<any>;
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