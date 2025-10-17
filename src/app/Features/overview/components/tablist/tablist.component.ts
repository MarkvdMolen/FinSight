import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TabItem {
    label: string;
    component: any;
}

@Component({
    selector: 'app-tablist',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tablist.component.html',
    styleUrl: './tablist.component.css'
})
export class Tablist {
    @Input() tabs: TabItem[] = [];
    @Input() selectedIndex = 0;
    @Output() selectedIndexChange = new EventEmitter<number>();

    select(i: number) {
        if (i !== this.selectedIndex) {
            this.selectedIndex = i;
            this.selectedIndexChange.emit(i);
        }
    }
}