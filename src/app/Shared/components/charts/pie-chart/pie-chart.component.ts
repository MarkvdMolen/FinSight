import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
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
    view: [number, number] = [300, 300];
    total = 0;

    gradient: boolean = true;
    isDoughnut: boolean = false;
  
    colorScheme: Color = {
        name: 'appPalette',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: [
            '#019B98', // primary-200 – teal
            '#DD0025', // accent-100 – rood
            '#267E4F', // money green
            '#017573', // dark teal
            '#BA8400', // warm geel/bruin
            '#3F7A8D', // staalblauw / text
            '#55CCC9', // licht teal
            '#FFBFAB', // zacht oranje
            '#014E60', // diepblauw
            '#81D9D7', // licht aqua
            '#A64B00', // warm bruin (contrast)
            '#009688', // neutraal groenblauw
            '#D64550', // roodachtig contrast
            '#4CAF50', // groen
            '#9C27B0', // paars
            '#FFC107', // goudgeel
            '#00BCD4', // cyaan
            '#E91E63', // roze accent
            '#795548', // bruin/grijs
            '#607D8B'  // blauwgrijs
        ]
    };
  
    autoScale: boolean = true;
    curve: any = shape.curveBumpX
    // End of Ngx-charts Options

    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
    private resizeObserver!: ResizeObserver;
    @Input() data!: CategoryTotalDTO[];
    chartData: Array<{ name: string; value: number }> = [];

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
            this.total = this.chartData.reduce((sum, d) => sum + d.value, 0);
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
