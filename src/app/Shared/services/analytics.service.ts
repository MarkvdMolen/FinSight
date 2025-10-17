import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../Enviroments/enviroment';
import { OverviewSummaryDTO, MonthlyTrendDTO, CategoryTotalDTO, AverageMonthlyDTO } from '@shared/models/analytics_dtos/analytics.model';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {

    private http = inject(HttpClient);
    private base = `${environment.apiUrl}/analytics`;

    private buildParams(start?: string, end?: string, excludeCategories?: string[]): HttpParams {
        let params = new HttpParams();
        if (start) params = params.set('start', start);
        if (end) params = params.set('end', end);
        if (excludeCategories && excludeCategories.length) {
            excludeCategories.forEach(cat => { params = params.append('excludeCategories', cat); });
        }
        return params;
    }

    getSummary(start?: string, end?: string, excludeCategories?: string[]) {
        const params = this.buildParams(start, end, excludeCategories);
        return this.http.get<OverviewSummaryDTO>(`${this.base}/summary`, { params });
    }

    getMonthlyTrend(start?: string, end?: string, excludeCategories?: string[]) {
        const params = this.buildParams(start, end, excludeCategories);
        return this.http.get<MonthlyTrendDTO[]>(`${this.base}/trend/monthly`, { params });
    }

    getExpensesByCategory(start?: string, end?: string, excludeCategories?: string[]) {
        const params = this.buildParams(start, end, excludeCategories);
        return this.http.get<CategoryTotalDTO[]>(`${this.base}/expenses/by-category`, { params });
    }

    getIncomeByCategory(start?: string, end?: string, excludeCategories?: string[]) {
        const params = this.buildParams(start, end, excludeCategories);
        return this.http.get<CategoryTotalDTO[]>(`${this.base}/income/by-category`, { params });
    }

    getAverageMonthly(start?: string, end?: string, excludeCategories?: string[]) {
        const params = this.buildParams(start, end, excludeCategories);
        return this.http.get<AverageMonthlyDTO>(`${this.base}/average/monthly`, { params });
    }
}