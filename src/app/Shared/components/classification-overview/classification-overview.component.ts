import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClassificationObject } from '@shared/models/classification-object.model';
import { TransactionService } from '@shared/services/transaction.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-classification-overview',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './classification-overview.component.html',
  styleUrl: './classification-overview.component.css'
})
export class ClassificationOverviewComponent implements OnInit {
  
    transactions!: Observable<ClassificationObject>;
  
    constructor(private transactionService: TransactionService) {}
  
    ngOnInit(): void {
        this.transactions = this.transactionService.getCategorizedCount();
    }
}
