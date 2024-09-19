import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/components/display-card/display-card.component";

// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { Transaction } from '@shared/models/transaction.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule, GreetingsComponent, DisplayCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit {

  transactions: Transaction[] = [];
  monthlySummary: any = {};

  /**
   * Creates an instance of HomeComponent.
   *
   * @param {TransactionService} transactionService - Service to handle transaction data.
   */
  constructor(private transactionService: TransactionService) {}

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   * Fetches transactions and processes financial data on component initialization.
   */
  ngOnInit() {
    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;
      this.transactionService.cacheTransactions(data);
      this.calculateMonthlySummary();
    });
  }
  
  /**
   * Processes the transaction data to prepare it for the financial chart.
   * Aggregates transaction amounts by month.
   */
  calculateMonthlySummary() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const summary: any = {};
  
    // Group transactions by month and calculate total income/expenses for each month
    this.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth(); // Get the month index (0 for Jan, 11 for Dec)
  
      if (!summary[month]) {
        summary[month] = { income: 0, expenses: 0 };
      }
  
      if (transaction.amount >= 0) {
        summary[month].income += transaction.amount;
      } else {
        summary[month].expenses += Math.abs(transaction.amount); // Convert expenses to positive
      }
    });
  
    // Create the series for "Income" and "Expenses" categories
    const incomeSeries = {
      name: "Income",
      series: Object.keys(summary).map(monthIndex => {
        const numericMonthIndex = parseInt(monthIndex, 10);
        return {
          name: monthNames[numericMonthIndex], // e.g., "Jan", "Feb"
          value: summary[numericMonthIndex].income
        };
      })
    };
  
    const expenseSeries = {
      name: "Expenses",
      series: Object.keys(summary).map(monthIndex => {
        const numericMonthIndex = parseInt(monthIndex, 10);
        return {
          name: monthNames[numericMonthIndex],
          value: summary[numericMonthIndex].expenses
        };
      })
    };
  
    // Combine the two categories into the final summary
    this.monthlySummary = [incomeSeries, expenseSeries];
  
    console.log(this.monthlySummary); // For debugging
  }
  
  

  view: [number, number] = [700, 400];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Amount (€)';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#019b98', '#dd0025']
  };

  gradient: boolean = true;
  autoScale: boolean = true;
  curve: any = shape.curveBasis

}
