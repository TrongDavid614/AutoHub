import React from 'react';
import { FileCheck2, X, Download } from 'lucide-react';
import type { CarDepositItem } from '@/features/customer/types/car-deposit.types';

interface CarDepositReceiptModalProps {
  receipt: CarDepositItem | null;
  onClose: () => void;
}

export const CarDepositReceiptModal: React.FC<CarDepositReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-accent-primary" />
            <h3 className="text-base font-bold text-text-primary">Biên Nhận Đặt Cọc Xe Ô Tô Điện Tử</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="p-4 rounded bg-canvas-deep border border-surface-highlight space-y-2">
            <div className="flex justify-between items-center text-text-muted">
              <span>MÃ PHIẾU CỌC:</span>
              <span className="font-mono font-bold text-accent-primary text-sm">{receipt.depositCode}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span>MÃ ĐỐI SOÁT SEPAY:</span>
              <span className="font-mono text-accent-primary">{receipt.sepayTransactionId || receipt.vnpayTransactionId || 'SEP-DEP-88992'}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span>NGƯỜI ĐỨNG TÊN:</span>
              <span className="font-bold text-text-primary">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span>ĐỊNH DANH CCCD:</span>
              <span className="font-mono text-text-primary">{receipt.identityCardNumber}</span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span>DÒNG XE & PHIÊN BẢN:</span>
              <span className="font-bold text-text-primary">{receipt.carModelName} - {receipt.carVariant}</span>
            </div>
            {receipt.vinNumber && (
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>SỐ KHUNG (VIN):</span>
                <span className="font-mono text-sm">{receipt.vinNumber}</span>
              </div>
            )}
            <div className="pt-2 border-t border-surface-highlight flex justify-between items-baseline">
              <span className="text-text-primary font-bold">TIỀN CỌC ĐÃ THANH TOÁN:</span>
              <span className="font-mono text-lg font-bold text-accent-primary">
                {receipt.depositAmount.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-surface-elevated border border-surface-highlight text-[11px] text-text-muted leading-relaxed">
            Biên nhận có giá trị pháp lý tạm khóa suất xe trong thời hạn 72 giờ liên tục. Tiền cọc sẽ được khấu trừ trực tiếp vào hợp đồng mua bán chính thức tại showroom AutoHub.
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-highlight">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>In Biên Nhận (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-primary hover:bg-surface-interactive cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
