import { Routes } from '@angular/router';
import { HomeComponent } from '@features/overview/pages/home/home.component';
import { CsvPageComponent } from '@features/csv/pages/csv-page/csv-page.component';
import { ClassificationViewerComponent } from '@features/classification-viewer/classification-viewer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'csv', component: CsvPageComponent },
  { path: 'classification-viewer', component: ClassificationViewerComponent },
];
