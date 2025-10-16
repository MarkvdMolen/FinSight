import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-card',
  standalone: true,
  imports: [CommonModule], // Import CommonModule
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'] // Corrected the typo from styleUrl to styleUrls
})
export class DisplayCardComponent {

	@Input({ required: true }) title!: string;
	@Input({ required: true }) amount!: number;
	@Input() trend: 'up' | 'down' | null = 'up';

	@Input() locale: string = 'nl-NL';
	@Input() currency: string = 'EUR';

	get formatted(): string {
		return new Intl.NumberFormat(this.locale, {
			style: 'currency',
			currency: this.currency,
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		}).format(this.amount);
	}
}