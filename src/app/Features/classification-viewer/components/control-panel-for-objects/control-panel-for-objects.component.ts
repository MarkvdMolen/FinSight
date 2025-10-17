import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsIconComponent } from "@shared/components/settings-icon/settings-icon.component";

@Component({
  selector: 'app-control-panel-for-objects',
  standalone: true,
  imports: [CommonModule, SettingsIconComponent],
  templateUrl: './control-panel-for-objects.component.html',
  styleUrl: './control-panel-for-objects.component.css'
})
export class ControlPanelForObjectsComponent {
    
    @Input() json: any; 
    @Output() addCategoryClicked = new EventEmitter<void>();
    @Output() addPropertyClicked = new EventEmitter<void>();
    
    /**
     * Emits the event to add a new category (sub-object).
     */
    addCategory(): void {
      this.addCategoryClicked.emit();
    }
  
    /**
     * Emits the event to add a new item (classification).
     */
    addProperty(): void {
      this.addPropertyClicked.emit();
    }
  }
