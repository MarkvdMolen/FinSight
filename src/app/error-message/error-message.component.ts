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
  @Input() title: string = '';
  @Input() message: string = '';
  
  showAlert = true;

  closeAlert() {
    this.showAlert = false;
  }
}
