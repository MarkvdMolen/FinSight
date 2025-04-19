export interface Transaction {
    transactionsId: number;
    account: string;
    category: string | null;
    recipient: string;
    description: string;
    amount: number;
    date: string;
    rowHash: string;
}