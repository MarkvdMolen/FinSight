import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';


@Component({
  selector: 'app-expense-income-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './expense-income-line-chart.component.html',
  styleUrl: './expense-income-line-chart.component.css'
})
export class ExpenseIncomeLineChartComponent {

    // Ngx-charts Options
    view: [number, number] = [0, 500];
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

    @Input() data!: DefaultSummary[];

    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
    private resizeObserver!: ResizeObserver;

    ngAfterViewInit(): void {
        this.resizeObserver = new ResizeObserver(entries => {
            const rect = entries[0].contentRect;
            this.view = [rect.width, rect.height];
        });
        this.resizeObserver.observe(this.chartContainer.nativeElement);
    }

    ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

}
