import { Routes } from '@angular/router';
import { HomeComponent } from '@features/overview/pages/home/home.component';
import { TransactionOverviewPageComponent } from '@features/csv/transaction-overview-page.component';
import { ClassificationViewerComponent } from '@features/classification-viewer/classification-viewer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'csv', component: TransactionOverviewPageComponent },
  { path: 'classification-viewer', component: ClassificationViewerComponent },
];
