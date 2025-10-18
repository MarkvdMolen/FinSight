import { Routes } from '@angular/router';
import { AnalyticsPageComponent } from 'app/Pages/analytics-page/analytics-page.component';
import { TransactionOverviewPageComponent } from '@features/transaction-overview/transaction-overview-page.component';
import { ClassificationViewerComponent } from '@features/classification-viewer/classification-viewer.component';
import { BankRecieptUploadPageComponent } from 'app/Pages/bank-reciept-upload-page/bank-reciept-upload-page.component';

export const routes: Routes = [
  { path: '', component: AnalyticsPageComponent },
  { path: 'home', component: AnalyticsPageComponent },
  { path: 'transactions', component: TransactionOverviewPageComponent },
  { path: 'upload', component: BankRecieptUploadPageComponent },
  { path: 'classification-viewer', component: ClassificationViewerComponent },
];
