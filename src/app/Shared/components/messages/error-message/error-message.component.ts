import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  @Input() status: 'success' | 'error' = 'error';
  @Input() title: string = '';
  @Input() message: string = '';

  @Output() actionClicked = new EventEmitter<void>();

  handleClick() {
    this.actionClicked.emit();
  }
}