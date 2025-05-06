import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '@shared/models/transaction.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { AutocompleteDropdownCellComponent } from "./components/autocomplete-dropdown-cell/autocomplete-dropdown-cell.component";
import { ClassificationLabelCellComponent } from "./components/classification-label-cell/classification-label-cell.component";

@Component({
    selector: 'app-table-row', 
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule, AutocompleteDropdownCellComponent, ClassificationLabelCellComponent],
    templateUrl: './table-row.component.html',
    styleUrl: './table-row.component.css',
    host: { 'style': 'display: table-row;' }
})
export class TableRowComponent {
    @Input() transaction!: Transaction;
    @Input() editingTransaction: Transaction | null = null;
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
