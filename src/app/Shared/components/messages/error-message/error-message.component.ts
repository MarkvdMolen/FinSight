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
  @Input() img_path: string = 'mappy_sad_1.png'
  @Input() title: string = 'Error';
  @Input() message: string = 'Something went wrong';

  @Output() actionClicked = new EventEmitter<void>();

  handleClick() {
    this.actionClicked.emit();
  }
}