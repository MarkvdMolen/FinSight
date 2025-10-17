import { Component, Input, SimpleChanges } from '@angular/core';
import { CategoryTotalDTO } from '@shared/models/analytics_dtos/analytics.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
    selector: 'app-pie-chart',
    standalone: true,
    imports: [NgxChartsModule],
    templateUrl: './pie-chart.component.html',
    styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {
    // Ngx-charts Options
    view: [number, number] = [700, 400];

    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
  
    colorScheme: Color = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#019b98', '#dd0025']
    };
  
    autoScale: boolean = true;
    curve: any = shape.curveBumpX
    // End of Ngx-charts Options

    @Input() data!: CategoryTotalDTO[];
    chartData: Array<{ name: string; value: number }> = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data) {
            this.chartData = this.transformData(this.data);
        }
    }

    private transformData(data: Array<{ category: string; total: number }>) {
        return data.map(item => ({
            name: item.category,
            value: item.total,
        }));
    }

}
