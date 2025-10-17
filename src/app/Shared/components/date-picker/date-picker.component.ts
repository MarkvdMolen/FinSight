import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith } from 'rxjs';

@Component({
	selector: 'app-date-picker',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule, 
		CommonModule, 
	],
	templateUrl: './date-picker.component.html',
	styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements OnChanges {
	@Input() start!: string;
	@Input() end!: string;
	@Output() startChange = new EventEmitter<string>();
	@Output() endChange   = new EventEmitter<string>();

	startCtrl = new FormControl<Date | null>(null, { nonNullable: false });
	endCtrl   = new FormControl<Date | null>(null, { nonNullable: false });

	ngOnInit(): void {
		// Emit updates naar parent wanneer gebruiker kiest
		combineLatest([
			this.startCtrl.valueChanges.pipe(startWith(this.startCtrl.value)),
			this.endCtrl.valueChanges.pipe(startWith(this.endCtrl.value))
		]).subscribe(([s, e]) => {
			if (s) this.startChange.emit(this.fmtISO(s));
			if (e) this.endChange.emit(this.fmtISO(e));
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		// Sync init/extern gewijzigde waarden naar controls, maar zonder extra events
		if (changes['start']) this.startCtrl.setValue(this.parseISO(this.start), { emitEvent: false });
		if (changes['end'])   this.endCtrl.setValue(this.parseISO(this.end),     { emitEvent: false });
	}

	private fmtISO(d: Date): string {
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	}

	private parseISO(s?: string): Date | null {
		if (!s) return null;
		const [y, m, d] = s.split('-').map(Number);
		return new Date(y, (m ?? 1) - 1, d ?? 1);
	}
}
