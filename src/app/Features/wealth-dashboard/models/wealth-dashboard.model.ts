export interface WealthAccount {
  id: string;
  institution: string;
  name: string;
  cash: number;
  investments: number;
  color: string;
}

export interface WealthSnapshot {
  month: string;
  label: string;
  value: number;
}

export interface WealthDashboard {
  asOf: string;
  monthLabel: string;
  income: number;
  expenses: number;
  accounts: WealthAccount[];
  history: WealthSnapshot[];
}
