import { Component, inject, signal} from '@angular/core';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";

// Shared imports
import { CommonModule } from '@angular/common';

import { Observable} from 'rxjs';
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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
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
    start = signal<string>('2025-01-01');
    end   = signal<string>('2025-08-02');
    excludes = signal<string[]>(['Overboeken', 'Betaalverzoek']);

    summary$: Observable<OverviewSummaryDTO> = this.analytics.getSummary(this.start(), this.end(), this.excludes());
    trend$: Observable<MonthlyTrendDTO[]>   = this.analytics.getMonthlyTrend(this.start(), this.end(), this.excludes());
    
    expCat$: Observable<CategoryTotalDTO[]> = this.analytics.getExpensesByCategory(this.start(), this.end(), this.excludes());
    incCat$: Observable<CategoryTotalDTO[]>  = this.analytics.getIncomeByCategory(this.start(), this.end(), this.excludes());
    avg$: Observable<AverageMonthlyDTO> = this.analytics.getAverageMonthly(this.start(), this.end(), this.excludes());    
}
