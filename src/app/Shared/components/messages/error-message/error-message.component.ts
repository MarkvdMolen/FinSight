import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() status: 'success' | 'error' = 'error';
  @Input() title: string = '';
  @Input() message: string = '';
  

  handleClick() {
    if (this.status === 'success') {
      console.log('Continue button clicked.');
    } else {
      console.log('Retry button clicked.');
    }
  }
}
