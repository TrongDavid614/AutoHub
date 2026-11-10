import type { CarDepositItem, CarDepositStatus } from '../types/car-deposit.types';

const API_BASE = 'http://localhost:8080/api';

function mapDtoToDepositItem(dto: any): CarDepositItem {
  return {
    id: dto.id,
    depositCode: dto.depositCode || `#DEP-${dto.id}`,
    carModelName: dto.carModelName || 'AutoHub GT-e',
    carVariant: dto.carVariant || 'AutoHub GT-e Grand Touring',
    exteriorColor: dto.exteriorColor || 'Xanh Băng Apex Cyan',
    colorHex: dto.colorHex || '#89CEFF',
    carImageUrl: dto.carImageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
    depositAmount: Number(dto.depositAmount) || 20000000,
    identityCardNumber: dto.identityCardNumber || '079204001234',
    customerName: dto.customerName || 'Nguyễn Văn An',
    customerPhone: dto.customerPhone || '0912345678',
    showroomName: dto.showroomName || 'Showroom AutoHub Flagship Thủ Đức',
    showroomAddress: dto.showroomAddress || 'Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    status: (dto.status as CarDepositStatus) || 'PAID',
    vinNumber: dto.vinNumber,
    vnpayTransactionId: dto.vnpayTransactionId,
    paidAt: dto.paidAt,
    expireAt: dto.expireAt,
    refundReason: dto.refundReason,
    createdAt: dto.createdAt || new Date().toISOString(),
  };
}

export const depositService = {
  async getMyDeposits(customerId?: number): Promise<CarDepositItem[]> {
    try {
      const url = customerId
        ? `${API_BASE}/customer/deposits?customerId=${customerId}`
        : `${API_BASE}/customer/deposits`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map(mapDtoToDepositItem);
        }
      }
    } catch {
      // Offline fallback
    }
    return [];
  },

  async getDepositDetail(depositId: number): Promise<CarDepositItem | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/deposits/${depositId}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return mapDtoToDepositItem(json.data);
        }
      }
    } catch {
      // Offline fallback
    }
    return null;
  },

  async requestRefund(depositId: number, reason: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/deposits/${depositId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async confirmPayment(depositId: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/customer/deposits/${depositId}/pay`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

