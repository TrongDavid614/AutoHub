import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  CheckCircle,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  Check,
  Filter,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminReviewService } from '../../services/admin-review.service';
import type { AdminReview, ReviewStatus } from '@/types/admin-review.types';

export const ReviewModerationPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReviewStatus | 'FLAGGED'>('ALL');
  const [actionInProgressId, setActionInProgressId] = useState<number | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminReviewService.getReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Không thể tải danh sách đánh giá từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleUpdateStatus = async (review: AdminReview, newStatus: ReviewStatus) => {
    try {
      setActionInProgressId(review.id);
      const updated = await adminReviewService.updateStatus(review.id, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: updated.status } : r))
      );
      setActionSuccessMessage(
        newStatus === 'APPROVED'
          ? `Đã phê duyệt đánh giá ${review.displayId} thành công.`
          : `Đã ẩn đánh giá ${review.displayId}.`
      );
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update review status:', err);
      alert('Thao tác cập nhật trạng thái đánh giá thất bại. Vui lòng thử lại!');
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleBatchApprove = async () => {
    const pendingReviews = reviews.filter((r) => r.status === 'PENDING');
    if (pendingReviews.length === 0) {
      alert('Không có đánh giá nào đang ở trạng thái Chờ duyệt!');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn phê duyệt đồng loạt ${pendingReviews.length} đánh giá chờ duyệt không?`)) {
      return;
    }

    try {
      setLoading(true);
      await adminReviewService.batchApprove(pendingReviews.map((r) => r.id));
      await fetchReviews();
      setActionSuccessMessage(`Đã phê duyệt thành công toàn bộ ${pendingReviews.length} đánh giá chờ duyệt.`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed batch approval:', err);
      alert('Phê duyệt hàng loạt thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'FLAGGED') return r.flaggedToxic === true;
    return r.status === statusFilter;
  });

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const flaggedCount = reviews.filter((r) => r.flaggedToxic).length;

  return (
    <div className={`space-y-6 antialiased transition-colors ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            Kiểm Duyệt Đánh Giá & Nhận Xét Phụ Kiện (F23)
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Kiểm tra nhận xét khách hàng, phát hiện nội dung độc hại/từ khóa cấm và kích hoạt hiển thị công khai trên gian hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            title="Làm mới danh sách"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleBatchApprove}
            disabled={loading || pendingCount === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm ${
              pendingCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Duyệt Hàng Loạt ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-semibold mr-1 flex items-center gap-1 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
          <Filter className="w-3.5 h-3.5" />
          Lọc trạng thái:
        </span>

        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40 hover:text-white'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất Cả ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40 hover:text-white'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Chờ Duyệt ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40 hover:text-white'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Đã Duyệt ({reviews.filter((r) => r.status === 'APPROVED').length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : isDarkMode
              ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40 hover:text-white'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Đã Ẩn ({reviews.filter((r) => r.status === 'REJECTED').length})
        </button>

        {flaggedCount > 0 && (
          <button
            type="button"
            onClick={() => setStatusFilter('FLAGGED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'FLAGGED'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : isDarkMode
                ? 'bg-red-950/40 text-red-400 border-red-800/40 hover:bg-red-900/40'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Nghi Vấn Vi Phạm ({flaggedCount})</span>
          </button>
        )}
      </div>

      {/* 3 Trạng thái cốt lõi: Loading / Error / Empty */}
      {loading ? (
        <div className={`p-8 rounded-xl border space-y-4 ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
              <div className="space-y-2 w-1/4">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={`p-8 rounded-xl border text-center space-y-4 ${
          isDarkMode ? 'bg-[#0B1326] border-red-900/40' : 'bg-white border-red-200'
        }`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400">Không thể tải dữ liệu đánh giá</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchReviews}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className={`p-12 rounded-xl border text-center space-y-3 ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Không có đánh giá nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Hệ thống không tìm thấy nhận xét nào với bộ lọc đã chọn. Hãy thử chọn tab bộ lọc khác hoặc kiểm tra lại sau.
          </p>
        </div>
      ) : (
        /* Reviews Table */
        <div className={`rounded-xl border overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`font-mono uppercase text-[11px] border-b ${
                isDarkMode
                  ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                  : 'bg-slate-50/80 text-slate-500 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4">Mã / Khách Hàng</th>
                  <th className="py-3 px-4">Sản Phẩm Phụ Kiện</th>
                  <th className="py-3 px-4 text-center">Đánh Giá</th>
                  <th className="py-3 px-4">Nội Dung Nhận Xét</th>
                  <th className="py-3 px-4 font-mono">Thời Điểm</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-sans ${
                isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
              }`}>
                {filteredReviews.map((r) => (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      r.flaggedToxic
                        ? isDarkMode
                          ? 'bg-red-950/15 hover:bg-red-950/25'
                          : 'bg-red-50/50 hover:bg-red-50/80'
                        : isDarkMode
                        ? 'hover:bg-[#131B2E]/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-blue-500 font-bold">{r.displayId}</div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.customer}</div>
                    </td>
                    <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>
                      {r.product}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className={`${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{r.comment}</div>
                      {r.flaggedToxic && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{r.moderationNote}</span>
                        </div>
                      )}
                    </td>
                    <td className={`py-3 px-4 font-mono text-[11px] whitespace-nowrap ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
                      {r.submittedAt ? r.submittedAt.replace('T', ' ').substring(0, 16) : '---'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold inline-block ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : r.status === 'REJECTED'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}>
                        {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Đã ẩn' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {r.status !== 'APPROVED' && (
                          <button
                            type="button"
                            disabled={actionInProgressId === r.id}
                            onClick={() => handleUpdateStatus(r, 'APPROVED')}
                            className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer ${
                              isDarkMode
                                ? 'bg-[#0D2818] hover:bg-[#134e2b] text-[#10B981] border-[#10B981]/40'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            {actionInProgressId === r.id ? '...' : 'Duyệt'}
                          </button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button
                            type="button"
                            disabled={actionInProgressId === r.id}
                            onClick={() => handleUpdateStatus(r, 'REJECTED')}
                            className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${
                              isDarkMode
                                ? 'bg-[#450A0A] hover:bg-[#7f1d1d] text-[#FCA5A5] border-[#DC2626]/40'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                            }`}
                          >
                            <EyeOff className="w-3 h-3" />
                            <span>{actionInProgressId === r.id ? '...' : 'Ẩn'}</span>
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
      )}
    </div>
  );
};
