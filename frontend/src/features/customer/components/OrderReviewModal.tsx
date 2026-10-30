import React, { useState } from 'react';
import { Star, Check, X } from 'lucide-react';
import type { AccessoryOrder } from '@/types/order.types';

interface OrderReviewModalProps {
  order: AccessoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (orderId: number, rating: number, comment: string) => void;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      onSubmitReview(order.id, reviewRating, reviewComment);
      setReviewComment('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-text-primary">Đánh giá chất lượng phụ kiện</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {reviewSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <Check className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-text-primary">Cảm ơn bạn đã gửi đánh giá!</h4>
            <p className="text-xs text-text-muted">
              Nhận xét của bạn đang được hệ thống tiếp nhận và chuyển sang Admin kiểm duyệt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Sản phẩm trong đơn hàng:</label>
              <div className="p-2.5 rounded bg-canvas-deep border border-surface-highlight text-xs font-semibold text-text-primary">
                {order.orderItems.map((i) => i.accessory.name).join(' + ')}
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-2">Đánh giá mức độ hài lòng (Sao):</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-border-subtle'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                  {reviewRating}/5 Sao ({reviewRating === 5 ? 'Cực kỳ hài lòng' : reviewRating >= 4 ? 'Hài lòng' : 'Tạm ổn'})
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Nội dung nhận xét chi tiết:</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chất lượng lắp ráp, độ tương thích xe, đóng gói cách âm..."
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
                className="px-4 py-2 rounded bg-accent-action hover:bg-accent-primary text-xs font-bold text-accent-contrast cursor-pointer transition-colors"
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
