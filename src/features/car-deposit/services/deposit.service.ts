import { MOCK_DEPOSIT_SHOWROOMS, type DepositShowroom } from '../mocks/deposit.mock';

export interface CreateDepositPayload {
  carVariant: string;
  exteriorColor: string;
  fullName: string;
  phoneNumber: string;
  identityCard: string;
  showroom: string;
  paymentMethod: 'VNPAY_QR' | 'ATM_CARD';
  amount: number;
}

export interface DepositResponse {
  success: boolean;
  depositCode: string;
  message: string;
}

export const depositService = {
  getShowrooms(): Promise<DepositShowroom[]> {
    return Promise.resolve(MOCK_DEPOSIT_SHOWROOMS);
  },

  submitDeposit(payload: CreateDepositPayload): Promise<DepositResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          depositCode: `DEP-${Date.now().toString().slice(-6)}`,
          message: `Đặt cọc thành công xe ${payload.carVariant}! Hợp đồng cọc điện tử đã được khởi tạo.`,
        });
      }, 800);
    });
  },
};
