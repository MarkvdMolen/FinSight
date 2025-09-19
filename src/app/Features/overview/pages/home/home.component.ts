import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/components/display-card/display-card.component";

// Shared imports
import { ExpenseIncomeLineChartComponent } from "@features/overview/components/expense-income-line-chart/expense-income-line-chart.component";
import { SummaryTableComponent } from '@shared/components/tables/summary-table/summary-table.component';
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, GreetingsComponent, DisplayCardComponent, ExpenseIncomeLineChartComponent, MissingFilesComponent, SummaryTableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {

  chartHasData = false;
  
  constructor() {}

}
