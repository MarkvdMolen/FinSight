import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';

const BASE_URL = 'http://localhost:8080/api/summary';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {

    constructor(
        private http: HttpClient
    ) {}


    /**
     * Retrieves the raw monthly transaction summary grouped by category 
     * for the given year from the backend API.
     *
     * @param {number} year - The year for which the summary should be fetched.
     * @returns {Observable<any>} An observable that emits the raw API response 
     *   containing the monthly breakdown per category.
     */
    public getMonthlySummaryByCategory(year: number): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/byCategory/${year}`);
    }

    //TODO add comments, pipe added to not trigger call multiple times for table/graph
    public getMonthlyIncomeAndOutcome(year: number): Observable<DefaultSummary> {
        return this.http.get<any>(`${BASE_URL}/${year}`).pipe(shareReplay(1));;
    }
}