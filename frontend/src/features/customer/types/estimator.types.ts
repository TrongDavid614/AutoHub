export type TrimId = 'luxury' | 'grand_touring' | 'track';

export interface TrimOption {
  id: TrimId;
  name: string;
  spec: string;
  price: number;
  priceFormatted: string;
  wltp: string;
  isRecommended?: boolean;
}

export interface CityOption {
  id: string;
  name: string;
  taxRate: number;
  plateFee: number;
  displayLabel: string;
}

export interface PromoItem {
  id: string;
  title: string;
  badge: string;
  description: string;
}

export interface CostBreakdown {
  listPrice: number;
  cashDiscount: number;
  taxRate: number;
  rawRegistrationTax: number;
  finalRegistrationTax: number;
  taxSaved: number;
  plateFee: number;
  inspectionFee: number;
  insuranceFee: number;
  totalRolloutCost: number;
}
