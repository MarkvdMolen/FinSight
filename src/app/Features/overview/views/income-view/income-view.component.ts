import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-income-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './income-view.component.html',
  styleUrl: './income-view.component.css'
})
export class IncomeView {

}