import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsIconComponent } from "@shared/components/settings-icon/settings-icon.component";

@Component({
  selector: 'app-control-panel-for-arrays',
  standalone: true,
  imports: [SettingsIconComponent],
  templateUrl: './control-panel-for-arrays.component.html',
  styleUrl: './control-panel-for-arrays.component.css'
})
export class ControlPanelForArraysComponent {

    @Input() data: any[] = [];
    @Output() dataChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

    addItem(): void {
        let newItem: String = ''; 
        const updatedData = [...this.data, newItem];
        this.dataChanged.emit(updatedData);
    }
}
