export type CarDepositStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'EXPIRED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_REQUIRED';

export interface CarDeposit {
  id: number;
  depositCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  identityCardNumber: string;
  variantId: number;
  variantName: string;
  colorName: string;
  depositAmount: number;
  status: CarDepositStatus;
  assignedVinNumber?: string;
  assignedShowroom: string;
  expiresAt: string;
  paidAt?: string;
  paymentMethod: 'SEPAY';
  sepayTransactionId?: string;
  vnpayTransactionId?: string;
  createdAt: string;
}
