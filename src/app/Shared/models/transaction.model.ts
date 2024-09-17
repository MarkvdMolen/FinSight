export interface Transaction {
    transactions_id: number;
    account: string;
    category: string | null;
    recipient: string;
    description: string;
    amount: number;
    date: string;
  }