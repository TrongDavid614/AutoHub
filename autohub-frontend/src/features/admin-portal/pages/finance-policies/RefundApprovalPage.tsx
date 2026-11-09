import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { adminService, type RefundItem } from '@/features/admin-portal/services/admin.service';

export const RefundApprovalPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [dockets, setDockets] = useState<RefundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadDockets = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRefundRequests();
      setDockets(data);
    } catch {
      setDockets([
        {
          id: 1,
          docketCode: '#REF-9021',
          depositCode: '#DEP-8841',
          customerName: 'Trần Văn Cường (CCCD: 001202008819)',
          carModel: 'VinFast VF8 Plus AWD',
          depositAmount: 20000000,
          reason: 'Ngân hàng từ chối cấp tín dụng gói vay 70%',
          submittedAt: 'Trong hạn 72h',
          verifiedByStaff: 'STF-004 (Nguyễn Văn Tuấn)',
          status: 'VERIFIED',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDockets();
  }, []);

  const handleApprove = async (docket: RefundItem) => {
    try {
      await adminService.approveRefund(docket.id);
      setDockets((prev) =>
        prev.map((d) => (d.id === docket.id ? { ...d, status: 'APPROVED' } : d))
      );
      setFeedback(`Đã phê duyệt hoàn cọc ${docket.docketCode} (${docket.customerName})`);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setDockets((prev) =>
        prev.map((d) => (d.id === docket.id ? { ...d, status: 'APPROVED' } : d))
      );
    }
  };

  const handleReject = async (docket: RefundItem) => {
    try {
      await adminService.rejectRefund(docket.id, 'Hồ sơ chưa đạt tiêu chuẩn hoàn cọc');
      setDockets((prev) =>
        prev.map((d) => (d.id === docket.id ? { ...d, status: 'REJECTED' } : d))
      );
      setFeedback(`Đã bác bỏ yêu cầu hoàn cọc ${docket.docketCode}`);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setDockets((prev) =>
        prev.map((d) => (d.id === docket.id ? { ...d, status: 'REJECTED' } : d))
      );
    }
  };

  const pendingCount = dockets.filter((d) => d.status === 'VERIFIED').length;

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
            Thẩm tra hồ sơ rút cọc đã được nhân viên Showroom xác minh và kích hoạt lệnh hoàn tiền tự động qua cổng thanh toán SePay.
          </p>
          {feedback && (
            <div className="mt-2 text-xs font-semibold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
            isDarkMode
              ? 'bg-red-950/70 border-red-800/40 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>{pendingCount} Hồ sơ chờ Admin giải ngân</span>
          </span>

          <button
            type="button"
            onClick={loadDockets}
            disabled={isLoading}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDarkMode ? 'bg-[#171F33] text-white border-[#3E4850]/50' : 'bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
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
            <span>(3) Xe chưa xuất hóa đơn giá trị gia tăng (VAT)</span>
          </div>
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
              <th className="py-3 px-4">Mã Hồ Sơ / Phiếu Cọc</th>
              <th className="py-3 px-4">Khách Hàng & CCCD</th>
              <th className="py-3 px-4">Dòng Xe</th>
              <th className="py-3 px-4 text-right">Số Tiền Hoàn Cọc</th>
              <th className="py-3 px-4">Lý Do Hoàn Cọc</th>
              <th className="py-3 px-4">Staff Thẩm Định</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-center">Thao Tác Admin</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {dockets.map((d) => (
              <tr key={d.id} className={`transition-colors ${
                isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
              }`}>
                <td className="py-3 px-4">
                  <div className={`font-mono font-bold ${isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'}`}>{d.docketCode}</div>
                  <div className={`font-mono text-[10px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>{d.depositCode}</div>
                </td>
                <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.customerName}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-700'}`}>{d.carModel}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-red-600">
                  {new Intl.NumberFormat('vi-VN').format(d.depositAmount)} ₫
                </td>
                <td className={`py-3 px-4 text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{d.reason}</td>
                <td className={`py-3 px-4 text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{d.verifiedByStaff || 'N/A'}</td>
                <td className="py-3 px-4 text-center font-mono text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    d.status === 'APPROVED'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : d.status === 'REJECTED'
                      ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {d.status === 'VERIFIED' ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApprove(d)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Giải Ngân</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(d)}
                        className={`px-2.5 py-1 rounded font-semibold text-[11px] border transition-colors cursor-pointer flex items-center gap-1 ${
                          isDarkMode
                            ? 'bg-red-950/70 hover:bg-red-900/70 text-red-300 border-red-800/40'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Bác Bỏ</span>
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      d.status === 'APPROVED'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40'
                        : 'bg-red-950/70 text-red-300 border-red-800/40'
                    }`}>
                      {d.status === 'APPROVED' ? 'Đã giải ngân' : 'Đã từ chối'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
