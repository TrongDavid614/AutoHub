export interface AdminRegistrationFee {
  id: number;
  provinceId: number;
  provinceName: string;
  region: string;
  licensePlateZone: string;
  registrationTaxRate: number;
  electricTaxRate: number;
  licensePlateFee: number;
  inspectionFee: number;
  roadMaintenanceFee: number;
  mandatoryInsuranceFee: number;
  effectiveDate: string;
  expiryDate?: string;
  active: boolean;
}

export interface AdminBankLoan {
  id: number;
  bankName: string;
  bankCode?: string;
  logoUrl?: string;
  firstYearRate: number;
  floatingRate: number;
  maxTenorYears: number;
  maxLtvPercent: number;
  note?: string;
  active: boolean;
}

export interface CreateRegistrationFeePayload {
  provinceId: number;
  registrationTaxRate: number;
  licensePlateFee: number;
  inspectionFee?: number;
  roadMaintenanceFee?: number;
  mandatoryInsuranceFee?: number;
  effectiveDate?: string;
  expiryDate?: string;
}

export interface UpdateRegistrationFeePayload {
  registrationTaxRate?: number;
  licensePlateFee?: number;
  inspectionFee?: number;
  roadMaintenanceFee?: number;
  mandatoryInsuranceFee?: number;
  effectiveDate?: string;
  expiryDate?: string;
}

export interface CreateBankLoanPayload {
  bankName: string;
  bankCode?: string;
  logoUrl?: string;
  firstYearRate: number;
  floatingRate: number;
  maxTenorYears: number;
  maxLtvPercent: number;
  note?: string;
  active?: boolean;
}

export interface UpdateBankLoanPayload {
  bankName?: string;
  bankCode?: string;
  logoUrl?: string;
  firstYearRate?: number;
  floatingRate?: number;
  maxTenorYears?: number;
  maxLtvPercent?: number;
  note?: string;
  active?: boolean;
}

export interface FeeStats {
  totalProvinces: number;
  configuredProvinces: number;
  avgRegistrationTaxRate: number;
  evTaxRate: number;
  totalBankPartners: number;
  lowestInterestRate: number;
  maxLtv: number;
}
