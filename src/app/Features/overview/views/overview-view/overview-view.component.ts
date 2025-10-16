import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

export interface TabItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview-view.component.html',
  styleUrl: './overview-view.component.css'
})
export class OverviewView {

}