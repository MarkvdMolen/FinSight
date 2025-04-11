import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './json-editor.component.html',
  styleUrl: './json-editor.component.css'
})

export class JsonEditorComponent {

    @Input() json: any;

    /**
     * Utility method to determine if a value is a non-array object.
     * 
     * @param value - The value to check.
     * @returns True if the value is a plain object (not an array), otherwise false.
     */
    isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Returns the enumerable property keys of the given object.
     * 
     * @param obj - The object to extract keys from.
     * @returns An array of keys from the object.
     */
    keys(obj: any): string[] {
        return Object.keys(obj);
    }
}
