import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

    public getMonthlyIncomeAndOutcome(year: number): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/${year}`);
    }
}