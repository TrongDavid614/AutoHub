export interface CarDwellItem {
  car: string;
  time: string;
  pct: string;
  color: string;
  favColor: string;
}

export interface AiTrendItem {
  topic: string;
  queries: number;
  pct: string;
}

export interface AnalyticsOverviewData {
  avgDwellTimeSeconds: number;
  interact360Percentage: string;
  calculatorLoanPercentage: string;
  aiConsultantQueries: number;
  aiAverageLatencyMs: number;
  dwellByCar: CarDwellItem[];
  aiTrends: AiTrendItem[];
}
