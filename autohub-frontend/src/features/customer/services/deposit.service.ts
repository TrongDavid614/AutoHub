import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { CarDepositItem, CarDepositStatus, DepositStatusResponse } from '../types/car-deposit.types';

export interface CreateDepositPayload {
  customerId?: number;
  phienBanId?: number;
  tonKhoId?: number;
  soCCCD?: string;
  hoTen?: string;
  soDienThoai?: string;
  showroom?: string;
  soTienCoc?: number;
}

export interface RefundDepositPayload {
  reason: string;
  document?: string;
  bankAccount?: string;
}

interface RawDepositDto {
  id: number;
  depositCode?: string;
  carModelName?: string;
  carVariant?: string;
  exteriorColor?: string;
  colorHex?: string;
  carImageUrl?: string;
  depositAmount?: number;
  identityCardNumber?: string;
  customerName?: string;
  customerPhone?: string;
  showroomName?: string;
  showroomAddress?: string;
  status?: string;
  vinNumber?: string;
  vnpayTransactionId?: string;
  sepayTransactionId?: string;
  paidAt?: string;
  expireAt?: string;
  paymentDeadline?: string;
  refundReason?: string;
  createdAt?: string;
  transferContent?: string;
  qrImageUrl?: string;
  bankAccountNumber?: string;
  bankBrandName?: string;
  bankAccountName?: string;
  isPaid?: boolean;
}

function mapDtoToDepositItem(dto: RawDepositDto): CarDepositItem {
  const depositCode = dto.depositCode || `#DEP-${dto.id}`;
  const cleanCode = depositCode.replace('#', '');
  const transferContent = dto.transferContent || `AH DEP ${cleanCode}`;
  const amount = Number(dto.depositAmount) || 20000000;
  const bankAcc = dto.bankAccountNumber || '5811676579';
  const qrUrl = dto.qrImageUrl || `https://img.vietqr.io/image/bidv-${bankAcc}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=CONG%20TY%20CO%20PHAN%20AUTOHUB%20VIETNAM`;

  return {
    id: dto.id,
    depositCode,
    carModelName: dto.carModelName || 'AutoHub GT-e',
    carVariant: dto.carVariant || 'AutoHub GT-e Grand Touring',
    exteriorColor: dto.exteriorColor || 'Xanh Băng Apex Cyan',
    colorHex: dto.colorHex || '#89CEFF',
    carImageUrl: dto.carImageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
    depositAmount: amount,
    identityCardNumber: dto.identityCardNumber || '079204001234',
    customerName: dto.customerName || 'Khách hàng AutoHub',
    customerPhone: dto.customerPhone || '0912345678',
    showroomName: dto.showroomName || 'Showroom AutoHub Flagship Thủ Đức',
    showroomAddress: dto.showroomAddress || 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    status: (dto.status as CarDepositStatus) || 'PENDING_PAYMENT',
    vinNumber: dto.vinNumber,
    sepayTransactionId: dto.sepayTransactionId,
    vnpayTransactionId: dto.vnpayTransactionId,
    paidAt: dto.paidAt,
    expireAt: dto.expireAt,
    refundReason: dto.refundReason,
    createdAt: dto.createdAt || new Date().toISOString(),
    transferContent,
    qrImageUrl: qrUrl,
    bankAccountNumber: bankAcc,
    bankBrandName: dto.bankBrandName || 'BIDV',
    bankAccountName: dto.bankAccountName || 'CONG TY CO PHAN AUTOHUB VIETNAM',
    isPaid: Boolean(dto.isPaid) || dto.status === 'PAID',
  };
}

export const depositService = {
  async getMyDeposits(customerId?: number): Promise<CarDepositItem[]> {
    try {
      const url = customerId
        ? `/customer/deposits?customerId=${customerId}`
        : `/customer/deposits`;
      const res = await axiosClient.get<unknown, ApiResponse<RawDepositDto[]>>(url);
      if (res?.data && Array.isArray(res.data)) {
        return res.data.map(mapDtoToDepositItem);
      }
    } catch {
      // Offline fallback
    }
    return [];
  },

  async getDepositDetail(depositId: number): Promise<CarDepositItem | null> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<RawDepositDto>>(`/customer/deposits/${depositId}`);
      if (res?.data) {
        return mapDtoToDepositItem(res.data);
      }
    } catch {
      // Offline fallback
    }
    return null;
  },

  async createDeposit(payload: CreateDepositPayload): Promise<CarDepositItem | null> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<RawDepositDto>>('/customer/deposits', payload);
      if (res?.data) {
        return mapDtoToDepositItem(res.data);
      }
    } catch {
      // Offline fallback
    }
    return null;
  },

  async requestRefund(depositId: number, data: RefundDepositPayload): Promise<boolean> {
    try {
      const res = await axiosClient.post<unknown, ApiResponse<RawDepositDto>>(`/customer/deposits/${depositId}/refund`, data);
      return Boolean(res?.data);
    } catch {
      return false;
    }
  },


  async getDepositStatus(depositId: number): Promise<DepositStatusResponse | null> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<DepositStatusResponse>>(`/customer/deposits/${depositId}/status`);
      if (res?.data) {
        return res.data;
      }
    } catch {
      // Offline fallback
    }
    return null;
  },
};
