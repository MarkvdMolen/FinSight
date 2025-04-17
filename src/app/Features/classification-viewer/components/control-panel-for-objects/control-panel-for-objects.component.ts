import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-panel-for-objects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './control-panel-for-objects.component.html',
  styleUrl: './control-panel-for-objects.component.css'
})
export class ControlPanelForObjectsComponent {

    @Input() json: any = {};
    @Output() addCategoryClicked = new EventEmitter<string>();
    @Output() addPropertyClicked = new EventEmitter<void>();
  
    category = '';
  
    addCategory() {
        console.log(this.category.trim())
        if (!this.category.trim()) return;
        this.addCategoryClicked.emit(this.category);
        this.category = '';
    }
  
    addProperty() {
        this.addPropertyClicked.emit();
    }
}
