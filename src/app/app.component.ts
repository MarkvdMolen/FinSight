import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Importeer RouterModule
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { GreetingsComponent } from "./greetings/greetings.component";
import { DisplayCardComponent } from "./display-card/display-card.component";
import { HomeComponent } from "./home/home.component";

import { routes } from './app.routes'; // Routes importeren

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, 
    RouterOutlet,
    SidebarComponent,
    NgxChartsModule,
    NavbarComponent,
    GreetingsComponent,
    DisplayCardComponent,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})

export class AppComponent {
  title = 'FinSight';
}
