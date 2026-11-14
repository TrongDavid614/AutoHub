export type TrimComparisonId = 'standard' | 'performance' | 'track' | string | number;

export interface VehicleComparisonTrim {
  id: TrimComparisonId;
  trimId?: string;
  name: string;
  modelName?: string;
  brandName?: string;
  badge?: string;
  badgeVariant?: 'primary' | 'accent' | string;
  price: number;
  priceFormatted: string;
  depositAmount?: number;
  depositFormatted?: string;
  installment?: string;
  imageUrl: string;
  tag: string;
  segment?: string;
  powertrain?: string;
  seats?: string;
  releaseYear?: number;
}

export interface SpecRow {
  id: string;
  label: string;
  sublabel?: string;
  standardVal?: string;
  standardSub?: string;
  performanceVal?: string;
  performanceSub?: string;
  trackVal?: string;
  trackSub?: string;
  unit?: string;
  isDifferent: boolean;
  isTelemetryHighlight?: boolean;
  values?: Record<string, string>;
  subValues?: Record<string, string>;
}

export interface SpecGroup {
  id: string;
  sectionNumber: string;
  title: string;
  rows: SpecRow[];
}

export interface ComparisonBenchmarkMetric {
  id: string;
  title: string;
  icon: string;
  rangeText: string;
  scores: Record<string, number>;
  labels: Record<string, string>;
}

export interface CarComparisonData {
  trims: VehicleComparisonTrim[];
  specGroups: SpecGroup[];
  benchmarkMetrics?: ComparisonBenchmarkMetric[];
}
