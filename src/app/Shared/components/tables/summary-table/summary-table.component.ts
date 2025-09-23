import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';

@Component({
  selector: 'app-summary-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-table.component.html',
  styleUrl: './summary-table.component.css'
})
export class SummaryTableComponent implements OnInit {
    @Input() data: DefaultSummary[] = [];
    totalIncome = 0;
    totalExpenses = 0;
    totalNet = 0;

    ngOnInit(): void {
        //TODO Make it more readable
        this.totalIncome = this.data.reduce((s, d) => s + d.income, 0);
        this.totalExpenses = this.data.reduce((s, d) => s + d.expense, 0);
        this.totalNet = this.totalIncome - this.totalExpenses;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
}
