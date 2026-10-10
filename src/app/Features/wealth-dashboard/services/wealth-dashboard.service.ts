import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WealthDashboard } from '../models/wealth-dashboard.model';

@Injectable({ providedIn: 'root' })
export class WealthDashboardService {
  private readonly http = inject(HttpClient);

  getDashboard(month?: string): Observable<WealthDashboard> {
    return this.http.get<WealthDashboard>('http://localhost:8080/api/wealth/dashboard', {
      params: month ? { month } : {},
    });
  }
}
