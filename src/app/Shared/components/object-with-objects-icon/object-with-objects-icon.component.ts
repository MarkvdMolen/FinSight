import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-object-with-objects-icon',
  standalone: true,
  imports: [],
  templateUrl: './object-with-objects-icon.component.html',
  styleUrl: './object-with-objects-icon.component.css'
})
export class ObjectWithObjectsIconComponent {
    @Input() size: number = 24;
    @Input() color: string = 'currentColor';
}
