import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tx-actions',
  standalone: true,
  imports: [],
  templateUrl: './tx-actions.component.html',
  styleUrl: './tx-actions.component.css'
})
export class TxActionsComponent {
    @Output() classify = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();
}
