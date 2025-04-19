export interface Transaction {
    transactionsId: number;
    account: string;
    category: string | null;
    recipient: string;
    description: string;
    amount: number;
    date: string;
    rowHash: string;
    classificationSource: 0 | 1 | 2 | 3; // 0=unclassified, 1=manueel, 2=rule‑based, 3=ML
  }
  