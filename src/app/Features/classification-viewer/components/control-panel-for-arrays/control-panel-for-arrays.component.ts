import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-panel-for-arrays',
  standalone: true,
  imports: [],
  templateUrl: './control-panel-for-arrays.component.html',
  styleUrl: './control-panel-for-arrays.component.css'
})
export class ControlPanelForArraysComponent {

  @Input() data: any[] = [];
  @Output() dataChanged: EventEmitter<any[]> = new EventEmitter<any[]>();


  addItem(type: 'string' | 'object'): void {
    let newItem;
    if (type === 'string') {
        newItem = ''; 
    } else if (type === 'object') {
        newItem = {}; 
    }

    const updatedData = [...this.data, newItem];
    this.dataChanged.emit(updatedData);
    }
}
