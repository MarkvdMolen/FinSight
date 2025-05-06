import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FilterCategoriesPipe } from '../../../../../../pipes/filter-categories.pipe';

@Component({
  selector: 'app-autocomplete-dropdown-cell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    FilterCategoriesPipe
  ],
  templateUrl: './autocomplete-dropdown-cell.component.html',
  styleUrl: './autocomplete-dropdown-cell.component.css'
})
export class AutocompleteDropdownCellComponent {
    @Input() categories: Record<string, string[]> = {};
    @Input() model: string | null = null;
    @Output() modelChange = new EventEmitter<string | null>();

    onModelChange(value: string) {
        this.model = value;
        this.modelChange.emit(value); 
    }
}
