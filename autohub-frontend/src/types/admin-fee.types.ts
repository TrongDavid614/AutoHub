export interface RegistrationFee {
  id: number;
  tinhThanhId: number;
  tenTinhThanh: string;
  phanVungBienSo: string;
  tyLePhiTruocBa: number;
  phiCapBienSo: number;
  phiDangKiem: number;
  phiBaoTriDuongBo: number;
  phiBaoHiemTnds: number;
  ngayApDung?: string;
  ngayHetHieuLuc?: string | null;
}

export interface BankLoanPackage {
  id: string;
  bank: string;
  firstYearRate: number;
  floatRate: number;
  maxTenorYears: number;
  maxLtvPercent: number;
}

export interface FeeOverviewData {
  provincialFees: RegistrationFee[];
  bankLoans: BankLoanPackage[];
}

export interface UpdateRegistrationFeePayload {
  tyLePhiTruocBa: number;
  phiCapBienSo: number;
  phiDangKiem: number;
  phiBaoTriDuongBo: number;
  phiBaoHiemTnds: number;
}

export interface BatchUpdateFeePayload {
  provincialFees: RegistrationFee[];
  bankLoans: BankLoanPackage[];
}
