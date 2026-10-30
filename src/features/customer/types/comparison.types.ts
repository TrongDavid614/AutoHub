export type TrimComparisonId = 'standard' | 'performance' | 'track';

export interface VehicleComparisonTrim {
  id: TrimComparisonId;
  name: string;
  badge?: string;
  badgeVariant?: 'primary' | 'accent';
  price: number;
  priceFormatted: string;
  installment?: string;
  imageUrl: string;
  tag: string;
}

export interface SpecRow {
  id: string;
  label: string;
  sublabel?: string;
  standardVal: string;
  standardSub?: string;
  performanceVal: string;
  performanceSub?: string;
  trackVal: string;
  trackSub?: string;
  unit?: string;
  isDifferent: boolean;
  isTelemetryHighlight?: boolean;
}

export interface SpecGroup {
  id: string;
  sectionNumber: string;
  title: string;
  rows: SpecRow[];
}
