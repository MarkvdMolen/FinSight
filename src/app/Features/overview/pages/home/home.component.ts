/**
 * @fileoverview HomeComponent responsible for displaying the home page with financial data visualization.
 */

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/components/display-card/display-card.component";

// Shared imports
import { TransactionService } from '@shared/services/transaction.service';
import { DataMap } from '@shared/models/datamap.model';

/**
 * HomeComponent displays the home page, including greetings, display cards, and financial overview chart.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule, GreetingsComponent, DisplayCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit {
  /**
   * Array to store transaction data.
   * @type {any[]}
   */
  transactions: any[] = [];

  /**
   * Data formatted for the financial chart.
   * @type {any[]}
   */
  financialData: any[] = [];

  /**
   * Creates an instance of HomeComponent.
   *
   * @param {TransactionService} transactionService - Service to handle transaction data.
   */
  constructor(private transactionService: TransactionService) { }

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   * Fetches transactions and processes financial data on component initialization.
   */
  ngOnInit() {
    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;
      this.transactionService.cacheTransactions(data);
      this.processFinancialData();
    });
  }
  
  /**
   * Processes the transaction data to prepare it for the financial chart.
   * Aggregates transaction amounts by month.
   */
  processFinancialData() {
    const dataMap: DataMap = {};
  
    this.transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
  
      if (!dataMap[month]) {
        dataMap[month] = 0;
      }
      dataMap[month] += transaction.amount;
    });
  
    this.financialData = Object.keys(dataMap).map((month) => ({
      name: month,
      value: dataMap[month],
    }));
  }
}
