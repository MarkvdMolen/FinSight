import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classification-icon',
  standalone: true,
  imports: [],
  templateUrl: './classification-icon.component.html',
  styleUrl: './classification-icon.component.css'
})
export class ClassificationIconComponent {
    @Input() size: number = 24;
    @Input() color: string = 'currentColor';
}
