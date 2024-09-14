import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Account {
  name: string;
  balance: number;
}

@Component({
  selector: 'app-display-card',
  standalone: true,
  imports: [CommonModule], // Import CommonModule
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'] // Corrected the typo from styleUrl to styleUrls
})
export class DisplayCardComponent {
  accounts: Account[] = [
    { name: 'Bank Account', balance: 23826 },
    { name: 'Safes', balance: 34109 },
    { name: 'Cash Funds', balance: 10320 }
  ];

  get totalBalance(): number {
    return this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }
}