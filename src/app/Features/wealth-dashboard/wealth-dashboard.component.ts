import { Component, input, signal, computed } from '@angular/core';
import { WealthDashboard } from './models/wealth-dashboard.model';

@Component({
  selector: 'app-wealth-dashboard',
  standalone: true,
  templateUrl: './wealth-dashboard.component.html',
  styleUrl: './wealth-dashboard.component.css',
})
export class WealthDashboardComponent {
  readonly dashboard = input.required<WealthDashboard>();
  readonly range = signal<6 | 12>(12);
  get data() { return this.dashboard(); }
  get accounts() { return this.data.accounts; }
  get cash() { return this.accounts.reduce((sum, account) => sum + account.cash, 0); }
  get investments() { return this.accounts.reduce((sum, account) => sum + account.investments, 0); }
  get total() { return this.cash + this.investments; }
  get cashPercentage() { return this.total === 0 ? 0 : this.cash / this.total * 100; }
  get monthlyGrowth(): number | null {
    const history = this.data.history;
    if (history.length < 2) return null;
    const previous = new Date(history[history.length - 2].month + '-01T00:00:00Z');
    const latest = new Date(history[history.length - 1].month + '-01T00:00:00Z');
    if ((latest.getUTCFullYear() - previous.getUTCFullYear()) * 12 + latest.getUTCMonth() - previous.getUTCMonth() !== 1) return null;
    return this.total - history[history.length - 2].value;
  }
  readonly history = computed(() => this.data.history.slice(-this.range()));
  readonly periodGrowth = computed(() => this.history().length ? this.total - this.history()[0].value : 0);
  readonly periodPercentage = computed(() => this.history()[0]?.value ? this.periodGrowth() / this.history()[0].value * 100 : 0);
  readonly chart = computed(() => {
    const history = this.history();
    const min = Math.floor(Math.min(...history.map(point => point.value)) / 5000) * 5000;
    const max = Math.max(min + 5000, Math.ceil(Math.max(...history.map(point => point.value)) / 5000) * 5000);
    const points = history.map((point, index) => ({
      ...point,
      x: 70 + index / Math.max(1, history.length - 1) * 690,
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
