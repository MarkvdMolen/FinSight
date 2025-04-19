import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteIconComponent } from "@shared/components/delete-icon/delete-icon.component";
import { EditIconComponent } from "@shared/components/edit-icon/edit-icon.component";
import { ToggleCollapseButtonComponent } from "@shared/components/toggle-collapse-button/toggle-collapse-button.component";
import { ObjectWithObjectsIconComponent } from "@shared/components/object-with-objects-icon/object-with-objects-icon.component";
import { ObjectWithClassificationsIconComponent } from "@shared/components/object-with-classifications-icon/object-with-classifications-icon.component";

@Component({
  selector: 'app-json-key-row',
  standalone: true,
  imports: [CommonModule, DeleteIconComponent, EditIconComponent, ToggleCollapseButtonComponent, ObjectWithObjectsIconComponent, ObjectWithClassificationsIconComponent],
  templateUrl: './json-key-row.component.html',
  styleUrl: './json-key-row.component.css'
})
export class JsonKeyRowComponent {
    @Input() keyName: string = '';
    @Input() value: string = '';
    @Input() collapsed: boolean = false;
    @Input() editing: boolean = false;
    @Input() canSwitch: boolean = false;

    @Output() action = new EventEmitter<{ type: string, payload?: any }>();

    onToggleCollapse() {
        this.action.emit({ type: 'toggle' });
    }

    onRename(newName: string) {
        this.action.emit({ type: 'rename', payload: newName });
    }

    onStartEdit() {
        this.action.emit({ type: 'edit' });
    }

    onDelete() {
        this.action.emit({ type: 'delete' });
    }

    onSwitchType() {
        this.action.emit({ type: 'switch' });
    }

    getObjectType(value: any): 'object' | 'array' {
        if (Array.isArray(value)) {
            return 'array';
        }
            return 'object';
    }
}