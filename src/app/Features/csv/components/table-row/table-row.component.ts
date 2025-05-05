import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '@shared/models/transaction.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FilterCategoriesPipe } from "../../pipes/filter-categories.pipe";

@Component({
    selector: 'app-table-row', 
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule, FilterCategoriesPipe],
    templateUrl: './table-row.component.html',
    styleUrl: './table-row.component.css',
    host: { 'style': 'display: table-row;' }
})
export class TableRowComponent {
    @Input() transaction!: Transaction;
    @Input() editingTransaction!: Transaction | null;
    @Input() classificationLabels: string[] = [];
    @Input() ruleBasedColoring: Record<number, boolean> = {};
    @Input() categoryControl = new FormControl('');
    @Input() classificationsCategories: Record<string, string[]> = {};

    @Output() edit = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    isEditing(): boolean {
        return !!this.editingTransaction && this.editingTransaction.transactionsId === this.transaction.transactionsId;
    }
}
