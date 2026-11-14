import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Inbox,
  FileText,
  Clock,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminRefundService, type RefundItem } from '../../services/admin-refund.service';

export const RefundApprovalPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const [dockets, setDockets] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal từ chối
  const [rejectItem, setRejectItem] = useState<RefundItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const fetchDockets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminRefundService.getRefundRequests();
      setDockets(data);
    } catch (err) {
      console.error('Failed to fetch refund requests:', err);
      setError('Không thể kết nối đến máy chủ để tải danh sách hồ sơ hoàn cọc.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDockets();
  }, [fetchDockets]);

  // Phê duyệt giải ngân
  const handleApprove = async (id: number, docketCode: string) => {
    const confirmed = window.confirm(
      `Xác nhận phê duyệt giải ngân hồ sơ ${docketCode}?\n\nHệ thống sẽ cập nhật trạng thái phiếu cọc sang REFUNDED và tự động giải phóng suất xe trong kho về CO_SAN để khách khác có thể đặt cọc.`
    );
    if (!confirmed) return;

    setProcessingId(id);
    try {
      await adminRefundService.approveRefund(id);
      // Chỉ cập nhật UI sang APPROVED khi API thực sự thành công
      setDockets((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'APPROVED' } : d))
      );
      alert(`Đã phê duyệt giải ngân thành công hồ sơ ${docketCode}!`);
    } catch (err) {
      console.error('Approve refund failed:', err);
      // Tuyệt đối không tự đổi status sang APPROVED trong block catch khi có lỗi
      alert('Phê duyệt giải ngân thất bại. Vui lòng kiểm tra kết nối API hoặc quyền tài khoản!');
    } finally {
      setProcessingId(null);
    }
  };

  // Mở modal từ chối
  const handleOpenReject = (item: RefundItem) => {
    setRejectItem(item);
    setRejectReason('Hồ sơ không đáp ứng điều kiện hoàn cọc 72h theo quy định hợp đồng.');
  };

  // Xác nhận từ chối
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem) return;
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối giải ngân!');
      return;
    }

    setProcessingId(rejectItem.id);
    try {
      await adminRefundService.rejectRefund(rejectItem.id, rejectReason);
      setDockets((prev) =>
        prev.map((d) =>
          d.id === rejectItem.id
            ? { ...d, status: 'REJECTED', rejectionReason: rejectReason }
            : d
        )
      );
      alert(`Đã từ chối hồ sơ hoàn cọc ${rejectItem.docketCode}!`);
      setRejectItem(null);
    } catch (err) {
      console.error('Reject refund failed:', err);
      alert('Không thể từ chối hồ sơ. Vui lòng thử lại!');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = (dockets ?? []).filter(
    (d) => d.status === 'VERIFIED' || d.status === 'PENDING'
  ).length;

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
            Phê Duyệt Giải Ngân Hồ Sơ Hoàn Tiền Cọc Xe 72 Giờ
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Thẩm tra hồ sơ rút cọc đã được nhân viên Showroom xác minh, giải ngân qua cổng thanh toán và giải phóng suất xe trong kho về CO_SAN.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDockets}
            title="Làm mới danh sách"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/40 text-[#88929B] hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <span className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
            pendingCount > 0
              ? isDarkMode
                ? 'bg-red-950/70 border-red-800/40 text-red-300'
                : 'bg-red-50 border-red-200 text-red-700'
              : isDarkMode
                ? 'bg-emerald-950/70 border-emerald-800/40 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <ShieldAlert className={`w-4 h-4 ${pendingCount > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
            <span>{pendingCount} Hồ sơ chờ Admin giải ngân</span>
          </span>
        </div>
      </div>

      {/* Checklist 3 Điều Kiện Giải Ngân */}
      <div className={`p-4 rounded-xl border space-y-2 text-xs ${
        isDarkMode
          ? 'bg-[#0F172A] border-[#38BDF8]/40'
          : 'bg-sky-50 border-sky-200 shadow-xs'
      }`}>
        <div className={`font-bold uppercase font-mono tracking-wider ${
          isDarkMode ? 'text-[#89CEFF]' : 'text-blue-700'
        }`}>
          Checklist 3 Điều Kiện Bắt Buộc Trước Khi Phê Duyệt Giải Ngân (Căn Cứ Hợp Đồng):
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 ${
          isDarkMode ? 'text-[#BAE6FD]' : 'text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(1) Gửi đơn trong thời hạn 72h kể từ lúc cọc</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(2) Có văn bản từ chối hợp lệ từ ngân hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 font-bold">✓</span>
            <span>(3) Tự động giải phóng xe tồn kho về trạng thái CO_SAN</span>
          </div>
        </div>
      </div>

      {/* Main Content: 3 Trạng thái Loading / Error / Empty hoặc Table */}
      {loading ? (
        <div className={`p-12 rounded-xl border text-center transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs text-slate-500 dark:text-[#88929B]">
              Đang tải danh sách hồ sơ hoàn tiền cọc từ máy chủ...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className={`p-8 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors ${
          isDarkMode ? 'bg-[#2C1810] border-red-500/40 text-red-300' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div className="text-sm font-semibold">{error}</div>
          <p className="text-xs text-slate-400">Vui lòng kiểm tra lại dịch vụ Backend hoặc mạng nội bộ.</p>
          <button
            type="button"
            onClick={fetchDockets}
            className="flex items-center gap-1.5 px-4 py-2 mt-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại (Retry)</span>
          </button>
        </div>
      ) : dockets.length === 0 ? (
        <div className={`p-16 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-colors ${
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Không có hồ sơ hoàn cọc nào
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Hiện tại tất cả các phiếu đặt cọc xe ô tô đều đang trong vòng đời hợp lệ hoặc đã được giải ngân hoàn tất.
          </p>
          <button
            type="button"
            onClick={fetchDockets}
            className="flex items-center gap-1.5 px-3.5 py-1.5 mt-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      ) : (
        /* Docket Cards List */
        <div className="space-y-4">
          {(dockets ?? []).map((docket) => {
            const isPending = docket.status === 'VERIFIED' || docket.status === 'PENDING';
            const isApproved = docket.status === 'APPROVED' || docket.status === 'REFUNDED';
            const isRejected = docket.status === 'REJECTED';
            const isProcessing = processingId === docket.id;

            return (
              <div
                key={docket.id}
                className={`p-5 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-[#89CEFF]/50 shadow-lg'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    {/* Docket Code & Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded border border-dashed ${
                        isDarkMode
                          ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/30'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                      }`}>
                        {docket.docketCode}
                      </span>
                      <span className={`text-xs font-mono font-medium ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                        Mã cọc gốc: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{docket.depositCode}</strong>
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : isRejected
                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}
                      >
                        {isApproved ? 'ĐÃ PHÊ DUYỆT HOÀN TIỀN' : isRejected ? 'ĐÃ TỪ CHỐI' : 'CHỜ ADMIN DUYỆT GIẢI NGÂN'}
                      </span>
                    </div>

                    {/* Customer & Car Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Khách hàng: </span>
                        <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{docket.customerName}</strong>
                        {docket.identityCardNumber && (
                          <span className="text-[11px] text-slate-400"> (CCCD: {docket.identityCardNumber})</span>
                        )}
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Dòng xe đặt: </span>
                        <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{docket.car}</strong>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Lý do rút cọc: </span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">{docket.reason}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>Hiệu lực 72h: </span>
                        <span className="font-mono font-medium">{docket.deadlineStatus}</span>
                      </div>
                    </div>

                    {/* Staff Verifier */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>Nhân viên thẩm định hồ sơ: <strong>{docket.staffVerifier}</strong></span>
                      {docket.rejectionReason && (
                        <span className="text-red-500 ml-2">• Lý do từ chối: {docket.rejectionReason}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Amount */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                    <div className="text-left lg:text-right">
                      <div className={`text-[10px] uppercase font-mono tracking-wider ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                        Số Tiền Cọc Hoàn Trả
                      </div>
                      <div className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {docket.amount}
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleOpenReject(docket)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                            isDarkMode
                              ? 'border-red-800/40 text-red-300 hover:bg-red-950/40'
                              : 'border-red-200 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Từ Chối</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleApprove(docket.id, docket.docketCode)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Phê Duyệt Giải Ngân</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Từ Chối Hoàn Cọc */}
      {rejectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-xl border p-6 transition-colors shadow-2xl ${
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Từ Chối Hồ Sơ Hoàn Cọc</span>
              </h3>
              <button
                type="button"
                onClick={() => setRejectItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 mt-4 text-xs">
              <div>
                <span className="text-slate-400">Hồ sơ: </span>
                <strong>{rejectItem.docketCode}</strong> - Khách hàng: <strong>{rejectItem.customerName}</strong>
              </div>

              <div>
                <label className="block font-medium mb-1">Lý Do Từ Chối Giải Ngân *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do không chấp thuận hoàn cọc..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Lý do này sẽ được lưu vào lịch sử đối soát và gửi thông báo phản hồi cho khách hàng.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setRejectItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={processingId === rejectItem.id}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
                >
                  {processingId === rejectItem.id ? 'Đang lưu...' : 'Xác Nhận Từ Chối'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
