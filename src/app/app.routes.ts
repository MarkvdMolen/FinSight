import { Routes } from '@angular/router';
import { HomeComponent } from './Features/overview/pages/home/home.component';
import { CsvPageComponent } from './Features/csv/pages/csv-page/csv-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'csv', component: CsvPageComponent },
];
