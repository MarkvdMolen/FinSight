import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-icon',
  standalone: true,
  imports: [],
  templateUrl: './delete-icon.component.html',
  styleUrl: './delete-icon.component.css'
})
export class DeleteIconComponent {
    @Input() size: number = 24;
    @Input() color: string = 'currentColor';
}
