import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeleteIconComponent } from "@shared/components/delete-icon/delete-icon.component";
import { ControlPanelForObjectsComponent } from "../control-panel-for-objects/control-panel-for-objects.component";
import { ControlPanelForArraysComponent } from '../control-panel-for-arrays/control-panel-for-arrays.component';
import { ClassificationIconComponent } from "@shared/components/classification-icon/classification-icon.component";
import { JsonKeyRowComponent } from "../json-key-row/json-key-row.component";
import { ItemListComponent } from "../item-list/item-list.component";

@Component({
    selector: 'app-json-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, ControlPanelForObjectsComponent, JsonKeyRowComponent, ItemListComponent],
    templateUrl: './json-editor.component.html',
    styleUrl: './json-editor.component.css'
})

export class JsonEditorComponent implements OnInit {
    @Input() json: any;
    @Output() jsonChanged = new EventEmitter<any>();

    collapsedKeys: { [path: string]: boolean } = {};
    editingKeys: Record<string, boolean> = {};


    ngOnInit() {
        this.autoCollapseObjects();
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
        const keys = this.keys(this.json); // Get the keys of that object
        keys.forEach((key) => {
            this.collapsedKeys[key] = true; // Set Collapse to True
        })
    }
  
    /**
     * Removes an item from an array in the JSON.
     *
     * @param array - The array to remove an item from.
     * @param index - The index of the item to remove.
     */
    removeItemFromArray(array: any[], index: number): void {
        if (!Array.isArray(array) || index < 0 || index >= array.length) return;
    
        array.splice(index, 1);
        this.notifyChanges(); 
    }
  
    /**
     * Adds a new property to an object in the JSON.
     *
     * @param obj - The object to add a property to.
     */
    addPropertyToObject(obj: any): void {
        if (!this.isArray(obj)) return;
      
        obj.push('New Item');
        this.notifyChanges();
      }

    
    /**
     * Adds a new category to the JSON structure.
     *
     * @param obj - The object to add a category to.
     * @param categoryName - The name of the category to add.
     */
    addCategory(obj: any): void {
        if (!this.isObject(obj)) return;
      
        const baseName = 'New Category';
        const newKey = this.generateUniqueKey(obj, baseName);
      
        obj[newKey] = {};
        this.collapsedKeys[newKey] = false; // Expand the new category
        this.notifyChanges();
      }
      

    /**
     * Removes a property from an object in the JSON.
     *
     * @param obj - The object to remove a property from.
     * @param key - The key of the property to remove.
     */
    removePropertyFromObject(obj: any, key: string): void {
        if (!this.isObject(obj) || !(key in obj)) return

        delete obj[key];
        delete this.collapsedKeys[key];
        this.notifyChanges();
    }

    /**
     * Updates a property key in an object.
     *
     * @param obj - The object containing the property.
     * @param oldKey - The current key name.
     * @param newKey - The new key name.
     */
    updatePropertyKey(obj: any, oldKey: string, newKey: string): void {
        if (!this.isObject(obj) || !(oldKey in obj) || !newKey.trim() || oldKey === newKey) return;

        // Check if the new key already exists
        if (newKey in obj) {
            alert(`Property "${newKey}" already exists!`)
            return;
        }

        // Create a new object with the updated key
        const value = obj[oldKey];
        delete obj[oldKey];
        obj[newKey] = value;

        // Update collapsed state
        const isCollapsed = this.collapsedKeys[oldKey];
        delete this.collapsedKeys[oldKey];
        this.collapsedKeys[newKey] = isCollapsed;

        this.notifyChanges();
    }

    /**
     * Notifies parent components that the JSON has changed.
     */
    notifyChanges(): void {
        this.jsonChanged.emit(this.json);
    }

    onChildJsonChanged(key: string, updatedValue: any) {
        this.json[key] = updatedValue;
        this.notifyChanges(); 
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    isEditing(key: string): boolean {
        return !!this.editingKeys[key];
      }
      
    changeEditing(key: string): void {
        this.editingKeys[key] = !this.editingKeys[key];
    }

    updateJsonArray(key: string | null, newArray: any[]): void {
        if (key === null) {
          this.json = newArray;
        } else {
          this.json[key] = newArray;
        }
        this.notifyChanges();
      }

    /**
     * Determines the type of a JSON node.
     * @param value - The value to inspect.
     * @returns 'object' | 'array' | 'primitive'
     */
    getObjectType(value: any): 'object' | 'array' | 'primitive' {
        if (Array.isArray(value)) {
        return 'array';
        }
        if (value !== null && typeof value === 'object') {
        return 'object';
        }
        return 'primitive';
    }

    switchType(key: string): void {
        const value = this.json[key];

        if (this.isObject(value) && !this.isArray(value)) {
            if (Object.keys(value).length === 0) {
                this.json[key] = [];
                this.notifyChanges();
            } 
            else {
                console.warn('Cannot switch: object is not empty.');
            }
        } else if (this.isArray(value)) {
            if (value.length === 0) {
                this.json[key] = {};
                this.notifyChanges();
            } 
            else {
                console.warn('Cannot switch: array is not empty.');
            }
        } else {
            console.warn('Cannot switch: value is neither object nor array.');
        }
    }

      canSwitchType(value: any): boolean {
        if (this.isObject(value) && !this.isArray(value)) {
          return Object.keys(value).length === 0;
        } else if (this.isArray(value)) {
          return value.length === 0;
        }
        return false;
      }

    switchTypeOfParent(obj: any): void {
        if (this.isObject(obj)) {
            if (Object.keys(obj).length === 0) {
                for (const key in obj) { // Object is empty → switch to array
                    if (obj.hasOwnProperty(key)) {
                        delete obj[key];
                    }
                }
                Object.assign(obj, []); // Reassign to empty array
            }
        } 
        else if (this.isArray(obj)) {
            if (obj.length === 0) { // Array is empty → switch to object
                obj.length = 0; // Clear array if needed
                Object.assign(obj, {});
            }
        }
        this.notifyChanges();
    }

    /**
     * Generates a unique key based on the base name and existing keys in the object.
     *
     * @param obj - The object to check for existing keys.
     * @param baseName - The desired base name for the new key.
     * @returns A unique key that does not conflict with existing keys.
     */
    generateUniqueKey(obj: any, baseName: string): string {
        let counter = 1;
        let newKey = baseName;
        while (obj.hasOwnProperty(newKey)) {
            newKey = `${baseName} (${counter})`;
            counter++;
        }
        return newKey;
    }

    handleKeyAction(key: string, event: { type: string, payload?: any }): void {
        switch (event.type) {
            case 'toggle':
                this.toggleCollapse(key);
                break;
            case 'edit':
                this.changeEditing(key);
                break;
            case 'rename':
                this.updatePropertyKey(this.json, key, event.payload);
                this.editingKeys[key] = false;
                break;
            case 'delete':
                this.removePropertyFromObject(this.json, key);
                break;
            case 'switch':
                this.switchType(key);
                break;
        }
    }
}