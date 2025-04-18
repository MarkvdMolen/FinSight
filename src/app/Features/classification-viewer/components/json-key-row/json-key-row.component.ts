import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteIconComponent } from "../../../../Shared/components/delete-icon/delete-icon.component";
import { EditIconComponent } from "../../../../Shared/components/edit-icon/edit-icon.component";
import { ToggleCollapseButtonComponent } from "../../../../Shared/components/toggle-collapse-button/toggle-collapse-button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-key-row',
  standalone: true,
  imports: [CommonModule, DeleteIconComponent, EditIconComponent, ToggleCollapseButtonComponent],
  templateUrl: './json-key-row.component.html',
  styleUrl: './json-key-row.component.css'
})
export class JsonKeyRowComponent {
    @Input() keyName: string = '';
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
  }