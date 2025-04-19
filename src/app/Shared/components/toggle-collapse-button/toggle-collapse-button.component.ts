import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-collapse-button',
  standalone: true,
  imports: [],
  templateUrl: './toggle-collapse-button.component.html',
  styleUrl: './toggle-collapse-button.component.css'
})
export class ToggleCollapseButtonComponent {
    @Input() collapsed: boolean = false;
    @Output() toggleClicked = new EventEmitter<void>();

    /**
     * Emits an event when the button is clicked.
     */
    onToggleClick(): void {
        this.toggleClicked.emit();
    }
}
