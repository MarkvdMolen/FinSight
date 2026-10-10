import { Component, inject, signal, computed } from '@angular/core';
import { WealthDashboardService } from './services/wealth-dashboard.service';

@Component({
  selector: 'app-wealth-dashboard',
  standalone: true,
  templateUrl: './wealth-dashboard.component.html',
  styleUrl: './wealth-dashboard.component.css',
})
export class WealthDashboardComponent {
  readonly data = inject(WealthDashboardService).getDashboard();
  readonly range = signal<6 | 12>(12);
  readonly accounts = this.data.accounts;
  readonly cash = this.accounts.reduce((sum, account) => sum + account.cash, 0);
  readonly investments = this.accounts.reduce((sum, account) => sum + account.investments, 0);
  readonly total = this.cash + this.investments;
  readonly cashPercentage = this.cash / this.total * 100;
  readonly monthlyGrowth = this.total - this.data.history[this.data.history.length - 2].value;
  readonly history = computed(() => this.data.history.slice(-this.range()));
  readonly periodGrowth = computed(() => this.total - this.history()[0].value);
  readonly periodPercentage = computed(() => this.periodGrowth() / this.history()[0].value * 100);
  readonly chart = computed(() => {
    const history = this.history();
    const min = Math.floor(Math.min(...history.map(point => point.value)) / 5000) * 5000;
    const max = Math.ceil(Math.max(...history.map(point => point.value)) / 5000) * 5000;
    const points = history.map((point, index) => ({
      ...point,
      x: 70 + index / (history.length - 1) * 690,
      y: 220 - (point.value - min) / (max - min) * 190,
    }));
    const line = points.map(point => `${point.x},${point.y}`).join(' ');
    return { points, line, area: `70,220 ${line} 760,220`, ticks: [max, (min + max) / 2, min] };
  });

  money(value: number): string {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }

  percentage(value: number): string {
    return new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value) + '%';
  }
}
