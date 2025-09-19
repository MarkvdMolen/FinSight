import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

@Component({
  selector: 'app-summary-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-table.component.html',
  styleUrl: './summary-table.component.css'
})
export class SummaryTableComponent implements OnInit {
    monthlyData: MonthlyData[] = [];
    totalIncome = 0;
    totalExpenses = 0;
    totalNet = 0;

    ngOnInit(): void {
        // Demo data
        this.monthlyData = [
            { month: 'Januari', income: 4500, expenses: 3200 },
            { month: 'Februari', income: 4200, expenses: 3100 },
            { month: 'Maart', income: 4800, expenses: 3400 },
            { month: 'April', income: 4600, expenses: 3300 },
            { month: 'Mei', income: 5000, expenses: 3500 },
            { month: 'Juni', income: 4700, expenses: 3250 },
            { month: 'Juli', income: 4900, expenses: 5600 },
            { month: 'Augustus', income: 4800, expenses: 3450 },
            { month: 'September', income: 5200, expenses: 3700 },
            { month: 'Oktober', income: 4950, expenses: 3550 },
            { month: 'November', income: 5100, expenses: 3800 },
            { month: 'December', income: 5300, expenses: 4000 },
        ];

        this.totalIncome = this.monthlyData.reduce((s, d) => s + d.income, 0);
        this.totalExpenses = this.monthlyData.reduce((s, d) => s + d.expenses, 0);
        this.totalNet = this.totalIncome - this.totalExpenses;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
        }).format(amount);
    }
}
