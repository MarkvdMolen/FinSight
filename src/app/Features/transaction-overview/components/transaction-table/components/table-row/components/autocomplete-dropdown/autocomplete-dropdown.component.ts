import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FilterCategoriesPipe } from '../../../../../../pipes/filter-categories.pipe';

@Component({
  selector: 'app-autocomplete-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    FilterCategoriesPipe
  ],
  templateUrl: './autocomplete-dropdown.component.html',
  styleUrl: './autocomplete-dropdown.component.css'
})
export class AutocompleteDropdownComponent {
    @Input() categories: Record<string, string[]> = {};
    @Input() model: string | null = null;
    @Output() modelChange = new EventEmitter<string | null>();

    onModelChange(value: string) {
        this.model = value;
        this.modelChange.emit(value); 
    }
}
