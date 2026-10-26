import React, { useState } from 'react';
import { RefreshCcw, Check, X } from 'lucide-react';
import type { AccessoryOrder } from '@/types/order.types';

interface OrderReturnModalProps {
  order: AccessoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReturn: (orderId: number, reason: string, note: string) => void;
}

export const OrderReturnModal: React.FC<OrderReturnModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitReturn,
}) => {
  const [returnReason, setReturnReason] = useState('Lỗi kỹ thuật phần cứng nhà sản xuất');
  const [returnNote, setReturnNote] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    setTimeout(() => {
      setReturnSubmitted(false);
      onSubmitReturn(order.id, returnReason, returnNote);
      setReturnNote('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-text-primary">Yêu cầu đổi trả phụ kiện (UC25)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {returnSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <Check className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-text-primary">Đã tiếp nhận yêu cầu đổi trả!</h4>
            <p className="text-xs text-text-muted">
              Hồ sơ đổi trả đã được chuyển sang bộ phận kho vận & kinh doanh (Staff) thẩm định theo quy chế.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-1">
              <div className="text-xs text-text-muted">Chính sách AutoHub:</div>
              <div className="text-xs font-semibold text-accent-primary">
                ✓ 1 Đổi 1 trong 30 ngày đối với lỗi phần cứng hoặc không tương thích dòng xe.
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Lý do yêu cầu đổi trả:</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-2.5 bg-canvas-deep border border-surface-highlight text-xs text-text-primary rounded focus:border-accent-primary focus:outline-none"
              >
                <option value="Lỗi kỹ thuật phần cứng nhà sản xuất">Lỗi kỹ thuật phần cứng nhà sản xuất</option>
                <option value="Không tương thích giắc cắm/đời xe thực tế">Không tương thích giắc cắm/đời xe thực tế</option>
                <option value="Móp méo/hư hỏng trong quá trình vận chuyển">Móp méo/hư hỏng trong quá trình vận chuyển</option>
                <option value="Khác">Khác (Nêu rõ bên dưới)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Mô tả chi tiết tình trạng sản phẩm:</label>
              <textarea
                rows={3}
                required
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="Mô tả cụ thể hiện tượng lỗi, đèn báo trên bộ sạc hoặc vấn đề lắp đặt..."
                className="w-full p-2.5 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none"
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
                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-400 text-xs font-bold text-canvas-deep cursor-pointer transition-colors"
              >
                Xác nhận gửi hồ sơ đổi trả
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
