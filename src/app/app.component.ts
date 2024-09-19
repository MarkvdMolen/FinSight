import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; 
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { SidebarComponent } from "./Core/sidebar/sidebar.component";
import { NavbarComponent } from "./Core/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, 
    RouterOutlet,
    SidebarComponent,
    NgxChartsModule,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})

export class AppComponent {
  title = 'FinSight';
}
