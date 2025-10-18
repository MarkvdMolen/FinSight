import { Routes } from '@angular/router';
import { AnalyticsPageComponent } from 'app/Pages/analytics-page/analytics-page.component';
import { TransactionOverviewPageComponent } from '@features/transaction-overview/transaction-overview-page.component';
import { ClassificationViewerComponent } from '@features/classification-viewer/classification-viewer.component';
import { CsvUploadComponent } from 'app/Pages/csv-upload/csv-upload.component';

export const routes: Routes = [
  { path: '', component: AnalyticsPageComponent },
  { path: 'home', component: AnalyticsPageComponent },
  { path: 'transactions', component: TransactionOverviewPageComponent },
  { path: 'upload', component: CsvUploadComponent },
  { path: 'classification-viewer', component: ClassificationViewerComponent },
];
