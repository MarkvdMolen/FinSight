/**
 * These TypeScript interfaces are designed to mirror the DTO classes returned
 * by the Spring Boot backend under the /api/analytics endpoints.
 *
 * Any structural or field name changes in the backend DTOs should be reflected here
 * to keep the API contract synchronized between frontend and backend.
 */
export interface OverviewSummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

export interface MonthlyTrendDTO {
  month: string;
  income: number;
  expenses: number;     
}

export interface CategoryTotalDTO {
  category: string;
  total: number;
}

export interface AverageMonthlyDTO {
  avgIncome: number;
  avgExpenses: number;
  avgNet: number;
  monthsCount: number;
}