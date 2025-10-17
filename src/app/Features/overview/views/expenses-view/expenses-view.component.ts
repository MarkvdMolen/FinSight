import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expenses-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenses-view.component.html',
  styleUrl: './expenses-view.component.css'
})
export class ExpensesView {
    // Not needed
    @Input() monthlySummary$!: Observable<DefaultSummary[]>;
    @Input() avg$!: Observable<any>;
}