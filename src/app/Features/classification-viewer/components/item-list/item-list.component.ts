import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteIconComponent } from "../../../../Shared/components/delete-icon/delete-icon.component";
import { ClassificationIconComponent } from "../../../../Shared/components/classification-icon/classification-icon.component";
import { ControlPanelForArraysComponent } from "../control-panel-for-arrays/control-panel-for-arrays.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [FormsModule, CommonModule, DeleteIconComponent, ClassificationIconComponent, ControlPanelForArraysComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
    @Input() data: any[] = [];
    @Output() dataChanged = new EventEmitter<any[]>();
  
    /**
     * Emits updated array after removing an item.
     */
    removeItem(index: number): void {
      const updated = [...this.data];
      updated.splice(index, 1);
      this.dataChanged.emit(updated);
    }
  
    /**
     * Emits updated array after editing an item.
     */
    updateItem(index: number, value: any): void {
      const updated = [...this.data];
      updated[index] = value;
      this.dataChanged.emit(updated);
    }

    trackByIndex(index: number, item: any): number {
        return index;
      }
      
}
