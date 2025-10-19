import { Component, computed, inject, Signal, signal } from '@angular/core';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";

// Shared imports
import { CommonModule } from '@angular/common';

import { Observable, shareReplay, switchMap, map } from 'rxjs';
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ClassificationService } from '@shared/services/classification.service';
import { CategorySelectorComponent } from "@shared/components/category-selector/category-selector.component";

type CategoriesMap = Record<string, string[]>;

interface Option {
  group: string; // bv. "Supermarkt"
  label: string; // bv. "jumbo"
  value: string; // hier gelijk aan label
}

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    GreetingsComponent,
    Tablist,
    DatePickerComponent,
    CategorySelectorComponent
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
  private categoriesService = inject(ClassificationService);

  monthlySummary$: Observable<DefaultSummary> = this.charts.getMonthlyIncomeAndOutcome(2025);

  // state (simpel)
  startDate = signal<string>('2025-01-01');
  endDate   = signal<string>('2025-08-02');

  // === Excludes die megaan naar endpoints ===
  excludes = signal<string[]>(['Overboeken', 'Betaalverzoek']);

  // Params voor endpoints
  private params = computed(() => ({
    start: this.startDate(),
    end: this.endDate(),
    exc: this.excludes()
  }));
  private params$ = toObservable(this.params);

  // Endpoints (reageren automatisch op params)
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

  // === Categories ophalen (Record<string,string[]>) ===
  categories$: Observable<CategoriesMap> =
    this.categoriesService.getCategories().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

  // === FLAT opties maken en als signal beschikbaar maken ===
  private options$ = this.categories$.pipe(
    map(obj =>
      Object.entries(obj).flatMap(([group, items]) =>
        items.map(label => ({ group, label, value: label } as Option))
      )
    )
  );
  options = toSignal(this.options$, { initialValue: [] as Option[] }) as Signal<Option[]>;

  // === Dropdown state & helpers ===
  isOpen = signal(false);
  query  = signal('');

  private selectedSet = computed(() => new Set(this.excludes()));

  filteredOptions = computed(() => {
    const q = this.query().trim().toLowerCase();
    const opts = this.options();
    if (!q) return opts;
    return opts.filter(o =>
      o.label.toLowerCase().includes(q) || o.group.toLowerCase().includes(q)
    );
  });

  groups = computed(() => {
    const mapG = new Map<string, Option[]>();
    for (const o of this.filteredOptions()) {
      if (!mapG.has(o.group)) mapG.set(o.group, []);
      mapG.get(o.group)!.push(o);
    }
    return Array.from(mapG.entries()) as [string, Option[]][];
  });

  isSelected = (value: string) => this.selectedSet().has(value);

  toggle(value: string) {
    const set = new Set(this.excludes());
    set.has(value) ? set.delete(value) : set.add(value);
    this.excludes.set([...set]);
  }

  selectAllInGroup(group: string) {
    const set = new Set(this.excludes());
    const inGroup = this.options().filter(o => o.group === group).map(o => o.value);
    inGroup.forEach(v => set.add(v));
    this.excludes.set([...set]);
  }

  clearGroup(group: string) {
    const set = new Set(this.excludes());
    const inGroup = this.options().filter(o => o.group === group).map(o => o.value);
    inGroup.forEach(v => set.delete(v));
    this.excludes.set([...set]);
  }

  clearAll() {
    this.excludes.set([]);
  }
}
