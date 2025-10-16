import { Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/views/overview-view/components/display-card/display-card.component";

// Shared imports
import { ExpenseIncomeLineChartComponent } from "@features/overview/views/overview-view/components/expense-income-line-chart/expense-income-line-chart.component";
import { SummaryTableComponent } from '@shared/components/tables/summary-table/summary-table.component';
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { CommonModule } from '@angular/common';

import { map, Observable} from 'rxjs';
import { FinancialService } from '@shared/services/financial.service';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '@shared/services/analytics.service';
import { OverviewSummaryDTO, MonthlyTrendDTO, CategoryTotalDTO, AverageMonthlyDTO } from '@shared/models/analytics_dtos/analytics.model';
import { Tablist } from '@features/overview/components/tablist/tablist.component';

import { ExpensesView } from '@features/overview/views/expenses-view/expenses-view.component';
import { IncomeView } from '@features/overview/views/income-view/income-view.component';
import { OverviewView } from '@features/overview/views/overview-view/overview-view.component';

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
    Tablist, 
    Dropdown
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
