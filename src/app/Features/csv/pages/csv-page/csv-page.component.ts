import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';

@Component({
  selector: 'app-csv-page',
  standalone: true,
  imports: [CommonModule, DefaultButtonComponent], // Import CommonModule
  templateUrl: './csv-page.component.html',
  styleUrls: ['./csv-page.component.css']
})
export class CsvPageComponent implements OnInit {

  transactions = [
    {
      iban: 'NL25RABO0347258441',
      currency: 'EUR',
      bic: 'RABONL2U',
      volgnr: 3555,
      date: '2024-08-13',
      rentedatum: '2024-08-13',
      amount: '-12,79',
      balance: '+1578,76',
      tegenrekeningIban: 'NL65ADYB2006011162',
      tegenpartij: 'NENT Group International AB',
      omschrijving: 'NENT Group International AB Viaplay d633096a-be9a-490f-9598-3d8e9545f0b4',
      omschrijving2: '',
      omschrijving3: ''
    },
    {
      iban: 'NL25RABO0347258441',
      currency: 'EUR',
      bic: 'RABONL2U',
      volgnr: 3556,
      date: '2024-08-13',
      rentedatum: '2024-08-13',
      amount: '-9,95',
      balance: '+1568,81',
      tegenrekeningIban: 'DE86210700200123010101',
      tegenpartij: 'Zalando Payments GmbH',
      omschrijving: 'Zalando Plus abonnement 10202166945984 ZB 011518875948',
      omschrijving2: '',
      omschrijving3: ''
    }
  ];

  ngOnInit() {
    // Herhaal de transacties 30 keer
    const repeatedTransactions = [];
    for (let i = 0; i < 30; i++) {
      repeatedTransactions.push(...this.transactions);  // Voeg alle transacties toe
    }
    this.transactions = repeatedTransactions;  // Update de originele array
  }
}
