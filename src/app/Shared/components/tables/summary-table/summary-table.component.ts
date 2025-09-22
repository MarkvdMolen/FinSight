import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

    @Input() data!: any;
    totalIncome = 0;
    totalExpenses = 0;
    totalNet = 0;

    ngOnInit(): void {
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
