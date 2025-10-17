import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classification-label-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classification-label-cell.component.html',
  styleUrl: './classification-label-cell.component.css'
})
export class ClassificationLabelCellComponent {
    @Input() source: number = 0;
    readonly labels: string[] = ['Unclassified', 'Manual', 'Rule‑based', 'ML'];

    get label(): string {
        return this.labels[this.source] ?? 'Unknown';
    }

    get setCssClass(): string {
        switch (this.source) {
            case 1: return 'text-green-600';
            case 2: return 'text-yellow-600';
            case 3: return 'text-orange-600';
            default: return 'text-red-700';
        }
    }
}
