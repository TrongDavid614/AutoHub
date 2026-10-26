import React, { useState } from 'react';
import { RefreshCcw, X, Check } from 'lucide-react';
import type { CarDepositItem } from '../types';

interface CarDepositRefundModalProps {
  isOpen: boolean;
  refundTarget: CarDepositItem | null;
  onClose: () => void;
  onSubmit: (data: { reason: string; document: string; bankAccount: string }) => void;
}

export const CarDepositRefundModal: React.FC<CarDepositRefundModalProps> = ({
  isOpen,
  refundTarget,
  onClose,
  onSubmit,
}) => {
  const [refundBankReason, setRefundBankReason] = useState(
    'Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)'
  );
  const [refundBankDoc, setRefundBankDoc] = useState('');
  const [refundBankAcc, setRefundBankAcc] = useState(
    '19034567890011 - Techcombank (Nguyễn Văn A)'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !refundTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onSubmit({
        reason: refundBankReason,
        document: refundBankDoc,
        bankAccount: refundBankAcc,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-accent-primary" />
            <h3 className="text-base font-bold text-text-primary">Yêu Cầu Hoàn Tiền Cọc Xe (UC18)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <Check className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-text-primary">Đã gửi hồ sơ xin hoàn tiền cọc!</h4>
            <p className="text-xs text-text-muted">
              Hồ sơ sẽ đi qua các bước: Staff đối soát chứng từ ngân hàng (VERIFIED) và Admin phê duyệt giải ngân (APPROVED) theo quy định BR05.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
            <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-1">
              <div className="text-text-muted">Quy chế hoàn cọc AutoHub (BR05 & DR14):</div>
              <div className="text-accent-primary font-semibold leading-relaxed">
                Chỉ xét hoàn tiền cọc khi (a) Ngân hàng đối tác từ chối cấp tín dụng mua xe có văn bản xác nhận hợp lệ, hoặc (b) Quản trị viên phê duyệt ngoại lệ trước thời điểm ký hợp đồng.
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-text-muted">Lý do xin rút tiền cọc *</label>
              <select
                value={refundBankReason}
                onChange={(e) => setRefundBankReason(e.target.value)}
                className="w-full h-10 px-2.5 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:border-accent-primary focus:outline-none"
              >
                <option value="Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)">
                  Ngân hàng đối tác từ chối cấp tín dụng mua xe (kèm văn bản)
                </option>
                <option value="Ngoại lệ khách hàng đề nghị Admin xem xét">
                  Ngoại lệ khách hàng đề nghị Admin xem xét
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-text-muted">Văn bản / Thông báo từ chối cấp tín dụng của ngân hàng *</label>
              <input
                type="text"
                required
                value={refundBankDoc}
                onChange={(e) => setRefundBankDoc(e.target.value)}
                placeholder="Nhập tên tệp / đường dẫn văn bản xác nhận ngân hàng..."
                className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-muted">Tài khoản ngân hàng thụ hưởng nhận tiền hoàn *</label>
              <input
                type="text"
                required
                value={refundBankAcc}
                onChange={(e) => setRefundBankAcc(e.target.value)}
                placeholder="Số tài khoản - Tên ngân hàng - Chủ tài khoản"
                className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight rounded text-xs text-text-primary font-mono focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-highlight">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast cursor-pointer transition-colors"
              >
                Gửi Hồ Sơ Xin Hoàn Cọc
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
