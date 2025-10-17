import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CategoryTotalDTO } from '@shared/models/analytics_dtos/analytics.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
    selector: 'app-bar-chart',
    standalone: true,
    imports: [NgxChartsModule],
    templateUrl: './bar-chart.component.html',
    styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {
    
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
    private resizeObserver!: ResizeObserver;
    @Input() data!: CategoryTotalDTO[];
    chartData: Array<{ name: string; value: number }> = [];

    // Ngx-charts Options
    view: [number, number] = [0, 900];
    gradient: boolean = true;
    showXAxis = true;
    showYAxis = true;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Categorie';
    showYAxisLabel = true;
    yAxisLabel = 'Euro';
  
    colorScheme: Color = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#019b98', '#dd0025']
    };
  
    autoScale: boolean = true;
    curve: any = shape.curveBumpX
    // End of Ngx-charts Options

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

    /**
     * Lifecycle hook that is called whenever any data-bound @Input property changes.
     * 
     * Specifically, this method listens for changes to the `data` input and updates
     * the `chartData` property with a transformed version suitable for the chart library.
     *
     * @param {SimpleChanges} changes - An object of changed input properties, keyed by property name.
     * Each property contains the previous and current values, as well as a flag indicating
     * if it’s the first change.
     *
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data) {
            this.chartData = this.transformData(this.data);
        }
    }

    /**
     * Transforms the api data into the format expected by the ngx-chart library.
     *
     * Converts an array of objects with `{ category, total }` properties into an array of
     * objects with `{ name, value }` properties.
     *
     * @param data - The input data array received from the parent component.
     * @returns {Array<{ name: string; value: number }>} A new array formatted for chart consumption.
     */
    private transformData(data: CategoryTotalDTO[]) {
        return data.map(item => ({
            name: item.category,
            value: item.total,
        }));
    }
}
