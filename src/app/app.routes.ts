import { Routes } from '@angular/router';
import { HomeComponent } from '@features/overview/pages/home/home.component';
import { TransactionOverviewPageComponent } from '@features/transaction-overview/transaction-overview-page.component';
import { ClassificationViewerComponent } from '@features/classification-viewer/classification-viewer.component';
import { CsvUploadComponent } from '@features/upload/csv-upload/csv-upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'transactions', component: TransactionOverviewPageComponent },
  { path: 'upload', component: CsvUploadComponent },
  { path: 'classification-viewer', component: ClassificationViewerComponent },
];
