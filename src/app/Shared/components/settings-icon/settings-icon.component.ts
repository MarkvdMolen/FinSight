import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-icon',
  standalone: true,
  imports: [],
  templateUrl: './settings-icon.component.html',
  styleUrl: './settings-icon.component.css'
})
export class SettingsIconComponent {
    @Input() size: number = 24;
    @Input() color: string = 'currentColor';
}
