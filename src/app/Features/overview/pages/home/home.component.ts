import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { GreetingsComponent } from "../../components/greetings/greetings.component";
import { DisplayCardComponent } from "../../components/display-card/display-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule, GreetingsComponent, DisplayCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'FinSight';
  colorScheme = {
    domain: ['#55ccc9', '#dd0025'],
  };

  financialData = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 6200 },
    { name: 'Mar', value: 4300 },
    { name: 'Apr', value: 5400 },
    { name: 'May', value: 7000 },
    { name: 'Jun', value: 6700 },
  ];
}
