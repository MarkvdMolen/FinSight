import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FinancialService } from '@shared/services/financial.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { filter, map, shareReplay, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-expense-income-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './expense-income-line-chart.component.html',
  styleUrl: './expense-income-line-chart.component.css'
})
export class ExpenseIncomeLineChartComponent {

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

    @Input() data!: any;

    constructor() {}

}
