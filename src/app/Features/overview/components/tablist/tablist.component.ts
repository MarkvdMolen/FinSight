import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

export interface TabItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-tablist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tablist.component.html',
  styleUrl: './tablist.component.css'
})
export class Tablist {
  constructor(public route: ActivatedRoute) {}

  @Input() tabs: TabItem[] = [];
}