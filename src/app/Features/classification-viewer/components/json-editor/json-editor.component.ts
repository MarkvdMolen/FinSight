import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './json-editor.component.html',
  styleUrl: './json-editor.component.css'
})

export class JsonEditorComponent implements OnInit {
    @Input() json: any;
    collapsedKeys: { [path: string]: boolean } = {};

    ngOnInit() {
        this.autoCollapseObjects();
    }

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

    /**
     * Toggles the collapsed state of a specific key path.
     * If the path is currently expanded, it will be collapsed and vice versa.
     *
     * @param path - A string representing the unique key path to toggle.
     */
    toggleCollapse(path: string): void {
        this.collapsedKeys[path] = !this.collapsedKeys[path];
    }
    
    /**
     * Checks whether a specific key path is currently collapsed.
     *
     * @param path - A string representing the key path to check.
     * @returns True if the key path is collapsed, false otherwise.
     */
    isCollapsed(path: string): boolean {
        return this.collapsedKeys[path] === true;
    }

    /**
     * Auto-collapses objects that are nested to improve initial readability
     */
    autoCollapseObjects(): void {
        if (this.isObject(this.json)) { // If its an Object Then
            const keys = this.keys(this.json); // Get the keys of that object
            keys.forEach(key => {  
                this.collapsedKeys[key] = true; // Set Collapse to True
            });
        }
    }

        /**
     * Utility method to determine if a value is an array.
     * 
     * @param value - The value to check.
     * @returns True if the value is an array, otherwise false.
     */
        isArray(value: any): boolean {
            return Array.isArray(value);
        }
}