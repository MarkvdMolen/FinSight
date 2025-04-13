import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-panel-for-objects',
  standalone: true,
  imports: [],
  templateUrl: './control-panel-for-objects.component.html',
  styleUrl: './control-panel-for-objects.component.css'
})
export class ControlPanelForObjectsComponent {

    @Input() json: any = {};
    @Output() addCategoryClicked = new EventEmitter<string>();
    @Output() addPropertyClicked = new EventEmitter<void>();
  
    newCategoryName = '';
  
    addCategory() {
      if (!this.newCategoryName.trim()) return;
      this.addCategoryClicked.emit(this.newCategoryName);
      this.newCategoryName = '';
    }
  
    addProperty() {
      this.addPropertyClicked.emit();
    }
}
