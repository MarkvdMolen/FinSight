export interface TransactionFilterOptions {
    searchText: string;
    searchFields: string[];
    exactAmount: number | null;
    sortBy: string;
    direction: 'asc' | 'desc';
    page: number;
    size: number;
}