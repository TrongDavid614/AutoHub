import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE } from '@/mock/mockData';

interface DepositRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositRefundModal: React.FC<DepositRefundModalProps> = ({ isOpen, onClose }) => {
  const [reason, setReason] = useState('Đổi ý định mua xe / Cân nhắc phiên bản khác');
  const [bankAccount, setBankAccount] = useState('19038291029102 - Techcombank (Nguyễn Văn A)');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const deposit = MOCK_CUSTOMER_PROFILE.activeDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Yêu Cầu Hoàn Cọc Giữ Xe 72H
              </h3>
              <p className="text-xs text-slate-400">Hoàn tiền 100% tự động theo cam kết AutoHub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Số tiền hoàn cọc: <strong className="text-white">20.000.000 VNĐ</strong>.
                Sau khi gửi yêu cầu, số khung xe <span className="font-mono text-white">{deposit.vinNumber}</span> sẽ được giải phóng trở lại kho hệ thống.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lý do yêu cầu hoàn cọc</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Đổi ý định mua xe / Cân nhắc phiên bản khác">Đổi ý định mua xe / Cân nhắc phiên bản khác</option>
                <option value="Chưa sắp xếp được tài chính thanh toán đợt sau">Chưa sắp xếp được tài chính thanh toán đợt sau</option>
                <option value="Thay đổi thời gian nhận xe do đi công tác">Thay đổi thời gian nhận xe do đi công tác</option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tài khoản nhận tiền hoàn</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Tiền hoàn sẽ được chuyển về tài khoản ban đầu trong 24 giờ làm việc.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-lg shadow-rose-600/20"
              >
                Xác Nhận Yêu Cầu Hoàn Cọc
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Yêu Cầu Đã Được Tiếp Nhận!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Bộ phận Kế toán AutoHub đang xử lý lệnh hoàn 20.000.000 VNĐ qua cổng VNPay. Mã tiếp nhận: <strong className="text-cyan-400">#REF-2026-901</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
