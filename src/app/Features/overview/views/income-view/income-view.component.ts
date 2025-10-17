import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from '@shared/components/charts/pie-chart/pie-chart.component';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector: 'app-income-view',
    standalone: true,
    imports: [CommonModule, PieChartComponent, BarChartComponent],
    templateUrl: './income-view.component.html',
    styleUrl: './income-view.component.css'
})
export class IncomeView {
    // Not needed
    @Input() monthlySummary$!: Observable<DefaultSummary[]>;
    @Input() avg$!: Observable<any>;
    @Input() expCat$!: Observable<any>;
    // Needed
    @Input() incCat$!: Observable<any>;

}