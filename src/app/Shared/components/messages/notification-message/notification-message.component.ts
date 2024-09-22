import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.css']
})
export class NotificationMessageComponent {
  @Input() status: 'success' | 'error' = 'error';
  @Input() img_path: string = 'mappy_sad_1.png'
  @Input() title: string = 'Error';
  @Input() message: string = 'Something went wrong';

  @Output() actionClicked = new EventEmitter<void>();

  handleClick() {
    this.actionClicked.emit();
  }
}