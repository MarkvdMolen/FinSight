import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditIconComponent } from '@shared/components/edit-icon/edit-icon.component';
import { DeleteIconComponent } from "@shared/components/delete-icon/delete-icon.component";
import { ControlPanelForObjectsComponent } from "../control-panel-for-objects/control-panel-for-objects.component";
import { ControlPanelForArraysComponent } from '../control-panel-for-arrays/control-panel-for-arrays.component';

@Component({
    selector: 'app-json-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, EditIconComponent, DeleteIconComponent, ControlPanelForObjectsComponent, ControlPanelForArraysComponent],
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
        if (!this.isObject(obj)) return;

        const newKey = `newProperty${Object.keys(obj).length}`;
        obj[newKey] = "";
        this.collapsedKeys[newKey] = false; // Expand the new property
        this.notifyChanges();
    }

    /**
     * Adds a new category to the JSON structure.
     *
     * @param obj - The object to add a category to.
     * @param categoryName - The name of the category to add.
     */
    addCategory(obj: any, categoryName: string): void {
        if (!this.isObject(obj) || !categoryName.trim()) return

        obj[categoryName] = {};
        this.collapsedKeys[categoryName] = false; // Expand the new category
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

    updateJsonArray(key: string, updatedArray: any[]): void {
        this.json = { ...this.json, [key]: updatedArray }; // ES6 spread-syntax
        this.notifyChanges();
    }
      
}