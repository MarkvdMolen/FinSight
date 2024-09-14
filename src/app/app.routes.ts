import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CsvPageComponent } from './csv-page/csv-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'csv', component: CsvPageComponent },
];
