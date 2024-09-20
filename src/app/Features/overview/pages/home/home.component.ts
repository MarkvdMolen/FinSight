import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Feature imports
import { GreetingsComponent } from "@features/overview/components/greetings/greetings.component";
import { DisplayCardComponent } from "@features/overview/components/display-card/display-card.component";

// Shared imports
import { ExpenseIncomeLineChartComponent } from "@features/overview/components/expense-income-line-chart/expense-income-line-chart.component";
import { MissingFilesComponent } from "@shared/components/missing-files/missing-files.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, GreetingsComponent, DisplayCardComponent, ExpenseIncomeLineChartComponent, MissingFilesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent {

  constructor() {}

}
