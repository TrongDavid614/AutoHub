import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  Power,
  X,
  Ticket,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useAdminVoucher } from '../../hooks/useAdminVoucher';

export const VoucherMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const {
    vouchers,
    activeCount,
    totalBudget,
    appliedCount,
    loading,
    error,
    fetchVouchers,
    toggleStatus,
    createVoucher,
  } = useAdminVoucher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    maVoucher: '',
    phanTramGiam: 10,
    giamToiDa: 1000000,
    ngayHetHan: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.maVoucher.trim()) {
      alert('Vui lòng nhập mã voucher!');
      return;
    }
    setActionLoading(true);
    try {
      await createVoucher({
        maVoucher: formData.maVoucher.trim().toUpperCase(),
        phanTramGiam: Number(formData.phanTramGiam),
        giamToiDa: Number(formData.giamToiDa),
        ngayHetHan: formData.ngayHetHan,
        dangHoatDong: true,
      });
      setIsModalOpen(false);
      setFormData({
        maVoucher: '',
        phanTramGiam: 10,
        giamToiDa: 1000000,
        ngayHetHan: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } catch {
      alert('Tạo mã voucher thất bại. Mã có thể đã tồn tại!');
    } finally {
      setActionLoading(false);
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
            Chương Trình Khuyến Mại & Quản Lý Mã Giảm Giá (Vouchers)
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Cấu hình mã giảm giá, giới hạn ngân sách chiến dịch, điều kiện áp dụng cho xe ô tô hoặc đơn phụ kiện.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchVouchers}
            title="Làm mới dữ liệu"
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Mã Voucher Mới</span>
          </button>
        </div>
      </div>

      {/* Budget Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Tổng Ngân Sách Đã Giải Ngân</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalBudget}</div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'}`}>
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
          </div>
          <div className={`text-[10px] font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-400'}`}>
            Hạn mức tối đa: 1.000.000.000 ₫ (45%)
          </div>
        </div>

        <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Voucher Đang Kích Hoạt</span>
            <Ticket className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-500">{activeCount} Chiến Dịch</div>
          <div className={`text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Sẵn sàng áp dụng khi thanh toán SePay & VNPay</div>
        </div>

        <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Tổng Lượt Khách Áp Dụng</span>
            <Percent className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{appliedCount} Lượt</div>
          <div className="text-[11px] text-blue-600 dark:text-[#89CEFF]">Tỷ lệ chuyển đổi cọc thành công: 84%</div>
        </div>
      </div>

      {/* Table */}
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
                <th className="py-3 px-4 font-semibold">Mã Voucher</th>
                <th className="py-3 px-4 font-semibold">Tên Chương Trình</th>
                <th className="py-3 px-4 font-semibold text-center">Mức Giảm</th>
                <th className="py-3 px-4 font-semibold">Điều Kiện</th>
                <th className="py-3 px-4 font-semibold text-center">Tiến Trình Sử Dụng</th>
                <th className="py-3 px-4 font-semibold text-center">Hạn Sử Dụng</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
                <th className="py-3 px-4 font-semibold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Đang tải danh sách voucher từ cơ sở dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Chưa có chiến dịch voucher nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                vouchers.map((v) => (
                  <tr key={v.id} className={`transition-colors ${
                    isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                  }`}>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded border border-dashed ${
                        isDarkMode
                          ? 'bg-[#171F33] text-[#89CEFF] border-[#89CEFF]/30'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                      }`}>
                        {v.code}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{v.title}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-[#10B981]">{v.formattedDiscount}</td>
                    <td className={`py-3 px-4 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{v.minOrderFormatted}</td>
                    <td className="py-3 px-4 text-center">
                      <div className={`font-mono text-[11px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {v.usageCount} / {v.maxUsage} lượt
                      </div>
                      <div className={`w-20 mx-auto h-1 rounded-full overflow-hidden mt-1 ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full ${v.usagePercent >= 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${v.usagePercent}%` }}
                        />
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
                      {v.expiryDate || 'Vô thời hạn'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                          v.status === 'Đang chạy'
                            ? isDarkMode
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDarkMode
                              ? 'bg-red-950/70 text-red-300 border-red-800/50'
                              : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(v.id)}
                        title={v.isActive ? 'Tạm dừng chiến dịch' : 'Kích hoạt lại'}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          v.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tạo Mã Voucher Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-xl border p-6 transition-colors shadow-2xl ${
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <h3 className="text-base font-bold">Tạo Mã Voucher Khuyến Mãi Mới</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Mã Code Voucher (Viết hoa, không dấu) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: AUTOHUB500K"
                  value={formData.maVoucher}
                  onChange={(e) => setFormData({ ...formData, maVoucher: e.target.value.toUpperCase() })}
                  className={`w-full px-3 py-2 border rounded-md font-mono uppercase font-bold focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Tỷ Lệ Giảm (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.phanTramGiam}
                    onChange={(e) => setFormData({ ...formData, phanTramGiam: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Mức Giảm Tối Đa (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={formData.giamToiDa}
                    onChange={(e) => setFormData({ ...formData, giamToiDa: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                      isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Hạn Sử Dụng Chiến Dịch *</label>
                <input
                  type="date"
                  required
                  value={formData.ngayHetHan}
                  onChange={(e) => setFormData({ ...formData, ngayHetHan: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md font-mono focus:outline-none ${
                    isDarkMode ? 'bg-[#131B2E] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Đang tạo...' : 'Kích Hoạt Mã'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
