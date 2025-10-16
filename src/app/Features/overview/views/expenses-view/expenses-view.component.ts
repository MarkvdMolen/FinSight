import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tablist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expenses-view.component.html',
  styleUrl: './expenses-view.component.css'
})
export class ExpensesView {
}