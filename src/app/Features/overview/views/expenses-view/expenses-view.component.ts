import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { DefaultSummary } from '@shared/models/data_views/default-summary.model';

import { BarChartComponent } from "@shared/components/charts/bar-chart/bar-chart.component";
import { PieChartComponent } from "@shared/components/charts/pie-chart/pie-chart.component";

@Component({
  selector: 'app-expenses-view',
  standalone: true,
  imports: [CommonModule, BarChartComponent, PieChartComponent],
  templateUrl: './expenses-view.component.html',
  styleUrl: './expenses-view.component.css'
})
export class ExpensesView {
    // Not needed
    @Input() monthlySummary$!: Observable<DefaultSummary[]>;
    @Input() avg$!: Observable<any>;
    // Needed
    @Input() expCat$!: Observable<any>;
}