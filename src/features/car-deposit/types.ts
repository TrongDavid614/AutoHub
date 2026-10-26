export type CarDepositStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'RESERVED'
  | 'COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface CarDepositItem {
  id: number;
  depositCode: string;
  carModelName: string;
  carVariant: string;
  exteriorColor: string;
  colorHex: string;
  carImageUrl: string;
  depositAmount: number;
  identityCardNumber: string;
  customerName: string;
  customerPhone: string;
  showroomName: string;
  showroomAddress: string;
  status: CarDepositStatus;
  vinNumber?: string;
  vnpayTransactionId?: string;
  paidAt?: string;
  expireAt?: string; // 72 giờ tính từ paidAt
  refundReason?: string;
  createdAt: string;
}
