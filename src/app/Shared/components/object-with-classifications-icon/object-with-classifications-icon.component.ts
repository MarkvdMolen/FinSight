import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-object-with-classifications-icon',
  standalone: true,
  imports: [],
  templateUrl: './object-with-classifications-icon.component.html',
  styleUrl: './object-with-classifications-icon.component.css'
})
export class ObjectWithClassificationsIconComponent {
    @Input() size: number = 24;
    @Input() color: string = 'currentColor';
}
