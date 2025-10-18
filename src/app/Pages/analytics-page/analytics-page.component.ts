import { Component, computed, inject, signal} from '@angular/core';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";

// Shared imports
import { CommonModule } from '@angular/common';

import { Observable, shareReplay, switchMap} from 'rxjs';
import { FinancialService } from '@shared/services/financial.service';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '@shared/services/analytics.service';
import { OverviewSummaryDTO, MonthlyTrendDTO, CategoryTotalDTO, AverageMonthlyDTO } from '@shared/models/analytics_dtos/analytics.model';
import { Tablist } from '@features/overview/components/tablist/tablist.component';

import { ExpensesView } from '@features/overview/views/expenses-view/expenses-view.component';
import { IncomeView } from '@features/overview/views/income-view/income-view.component';
import { OverviewView } from '@features/overview/views/overview-view/overview-view.component';
import { DatePickerComponent } from "@shared/components/date-picker/date-picker.component";
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    GreetingsComponent,
    Tablist,
    DatePickerComponent
],
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css'] 
})
export class AnalyticsPageComponent {
    tabs = [
        { label: 'Overview', component: OverviewView },
        { label: 'Expenses', component: ExpensesView },
        { label: 'Income', component: IncomeView },
    ];

    selectedIndex = 0;
  
    private analytics = inject(AnalyticsService);
    private charts = inject(FinancialService);

    monthlySummary$: Observable<DefaultSummary> = this.charts.getMonthlyIncomeAndOutcome(2025);

    // state (simpele variant)
    startDate = signal<string>('2025-01-01');
    endDate   = signal<string>('2025-08-02');
    excludes = signal<string[]>(['Overboeken', 'Betaalverzoek']);

    // Use Computed works as a Singal but when values change it will automaticlly update it self
    private params = computed(() => ({
        start: this.startDate(),
        end: this.endDate(),
        exc: this.excludes()
    }));

    // toObservable will change a computed or signal into a Observable
    private params$ = toObservable(this.params);

    // pipe Obersable method to do other actions such as SwitchMap, Map, Filter etc
    // SwitchMap will start a new obeservable and will cancle the older request
    summary$: Observable<OverviewSummaryDTO> = this.params$.pipe(
        switchMap(p => this.analytics.getSummary(p.start, p.end, p.exc)),
        shareReplay(1)
    );

    trend$: Observable<MonthlyTrendDTO[]> = this.params$.pipe(
        switchMap(p => this.analytics.getMonthlyTrend(p.start, p.end, p.exc)),
        shareReplay(1)
    );

    expCat$: Observable<CategoryTotalDTO[]> = this.params$.pipe(
        switchMap(p => this.analytics.getExpensesByCategory(p.start, p.end, p.exc)),
        shareReplay(1)
    );

    incCat$: Observable<CategoryTotalDTO[]> = this.params$.pipe(
        switchMap(p => this.analytics.getIncomeByCategory(p.start, p.end, p.exc)),
        shareReplay(1)
    );

    avg$: Observable<AverageMonthlyDTO> = this.params$.pipe(
        switchMap(p => this.analytics.getAverageMonthly(p.start, p.end, p.exc)),
        shareReplay(1)
    );  
}
