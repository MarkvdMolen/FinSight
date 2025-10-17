import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DefaultSummary } from '@shared/models/data_views/default-summary.model';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector: 'app-income-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './income-view.component.html',
    styleUrl: './income-view.component.css'
})
export class IncomeView {
    // Not needed
    @Input() monthlySummary$!: Observable<DefaultSummary[]>;
    @Input() avg$!: Observable<any>;

}