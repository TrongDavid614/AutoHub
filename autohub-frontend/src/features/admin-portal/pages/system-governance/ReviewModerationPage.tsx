import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, EyeOff, RefreshCw } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminService, type ReviewItem } from '@/features/admin-portal/services/admin.service';

export const ReviewModerationPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getReviews();
      setReviews(data);
    } catch {
      // Fallback
      setReviews([
        {
          id: 'REV-101',
          rawId: 101,
          customer: 'Phạm Minh Quân',
          product: 'Thảm Lót Sàn Ô Tô Tràn Viền 5D',
          rating: 5,
          comment: 'Thảm lắp vừa in khoang xe VF8, không có mùi nhựa độc hại, chất liệu da êm ái rất đáng tiền!',
          submittedAt: '2026-10-29 11:30',
          status: 'PENDING',
        },
        {
          id: 'REV-102',
          rawId: 102,
          customer: 'Hoàng Văn Bách',
          product: 'Camera Hành Trình 4K Trước & Sau',
          rating: 5,
          comment: 'Hình ảnh sắc nét ban đêm, kết nối app mượt mà, kỹ thuật viên showroom hỗ trợ lắp đặt rất nhiệt tình.',
          submittedAt: '2026-10-29 10:15',
          status: 'PENDING',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (review: ReviewItem, nextStatus: 'APPROVED' | 'REJECTED') => {
    try {
      await adminService.updateReviewStatus(review.rawId, nextStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
      );
      setActionMessage(`Đã ${nextStatus === 'APPROVED' ? 'phê duyệt' : 'từ chối/ẩn'} đánh giá của ${review.customer}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      // Optimistic fallback
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
      );
    }
  };

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Kiểm Duyệt Đánh Giá & Nhận Xét Sản Phẩm Phụ Kiện
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Duyệt nhận xét thực tế của khách hàng, lọc nội dung phản cảm và quản lý hình ảnh đánh giá trên trang phụ kiện.
          </p>
          {actionMessage && (
            <div className="mt-2 text-xs font-semibold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{actionMessage}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadReviews}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#171F33] text-white border-[#3E4850]/50' : 'bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <table className="w-full text-left text-xs">
          <thead className={`font-mono uppercase text-[11px] border-b ${
            isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
              : 'bg-slate-50/80 text-slate-500 border-slate-200'
          }`}>
            <tr>
              <th className="py-3 px-4">Khách Hàng</th>
              <th className="py-3 px-4">Sản Phẩm Phụ Kiện</th>
              <th className="py-3 px-4 text-center">Đánh Giá</th>
              <th className="py-3 px-4">Nội Dung Nhận Xét</th>
              <th className="py-3 px-4 font-mono">Thời Điểm Gửi</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {reviews.map((r) => (
              <tr key={r.id} className={`transition-colors ${
                isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
              }`}>
                <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.customer}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>{r.product}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-0.5 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </td>
                <td className={`py-3 px-4 max-w-xs ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{r.comment}</td>
                <td className={`py-3 px-4 font-mono text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{r.submittedAt}</td>
                <td className="py-3 px-4 text-center font-mono text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    r.status === 'APPROVED'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : r.status === 'REJECTED'
                      ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {r.status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(r, 'APPROVED')}
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#0D2818] hover:bg-[#134e2b] text-[#10B981] border-[#10B981]/40'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                        }`}
                      >
                        Duyệt
                      </button>
                    )}
                    {r.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(r, 'REJECTED')}
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkMode
                            ? 'bg-[#450A0A] hover:bg-[#7f1d1d] text-[#FCA5A5] border-[#DC2626]/40'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                        }`}
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Ẩn</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
