import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableHeader {
    key: string;
    label: string;
}

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css',
  host: { 'style': 'display: table-row;' }
})
export class TableHeaderComponent {
    @Input() headers: TableHeader[] = [];
    @Input() sortedBy: string = '';
    @Input() sortDirection: 'asc' | 'desc' | '' = '';
    @Output() sort = new EventEmitter<string>();

    onHeaderClick(key: string): void {
        this.sort.emit(key);
    }
  }
