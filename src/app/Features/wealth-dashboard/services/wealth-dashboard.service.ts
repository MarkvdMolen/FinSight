import { Injectable } from '@angular/core';
import { WealthDashboard } from '../models/wealth-dashboard.model';

@Injectable({ providedIn: 'root' })
export class WealthDashboardService {
  getDashboard(): WealthDashboard {
    return {
      asOf: '31 oktober 2026',
      monthLabel: 'Oktober 2026',
      income: 3850,
      expenses: 2240,
      accounts: [
        { id: 'rabobank', institution: 'Rabobank', name: 'Betaal- en spaarrekening', cash: 12450, investments: 0, color: '#ec761a' },
        { id: 'revolut', institution: 'Revolut', name: 'Betaalrekening', cash: 1850, investments: 0, color: '#7261c9' },
        { id: 'trade-republic', institution: 'Trade Republic', name: 'Cash en beleggingen', cash: 8000, investments: 16400, color: '#253b38' },
        { id: 'degiro', institution: 'DEGIRO', name: 'Beleggingsrekening', cash: 300, investments: 25750, color: '#3264ac' },
      ],
      history: [
        { month: '2025-11', label: 'Nov', value: 49200 },
        { month: '2025-12', label: 'Dec', value: 50750 },
        { month: '2026-01', label: 'Jan', value: 52100 },
        { month: '2026-02', label: 'Feb', value: 51400 },
        { month: '2026-03', label: 'Mrt', value: 54300 },
        { month: '2026-04', label: 'Apr', value: 55900 },
        { month: '2026-05', label: 'Mei', value: 55200 },
        { month: '2026-06', label: 'Jun', value: 58250 },
        { month: '2026-07', label: 'Jul', value: 60100 },
        { month: '2026-08', label: 'Aug', value: 61700 },
        { month: '2026-09', label: 'Sep', value: 62800 },
        { month: '2026-10', label: 'Okt', value: 64750 },
      ],
    };
  }
}
