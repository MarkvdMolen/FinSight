import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class Dropdown {
    @Input() categories: Record<string, string[]> = {};
    @Input() model: string | null = null;
    @Output() modelChange = new EventEmitter<string | null>();

    onModelChange(value: string) {
        this.model = value;
        this.modelChange.emit(value); 
    }
}

