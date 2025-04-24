import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
    private apiUrl = 'http://localhost:3000/api'; // Gebruik proxy of pas aan indien nodig

    constructor(private http: HttpClient) {}

    /**
     * Haalt de classificatiestructuur op vanuit de backend
     */
    getClassifications(): Observable<any> {
        return this.http.get<any>(this.apiUrl+ '/classifications');
    }

    /**
     * Slaat de classificatiestructuur op naar de backend
     * @param data De JSON-structuur om op te slaan
     */
    saveClassifications(data: any): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(this.apiUrl + '/classifications', data);
    }

    getCategories(): Observable<Record<string, string[]>> {
        return this.http.get<Record<string, string[]>>(this.apiUrl + '/categories');
    }  
}
