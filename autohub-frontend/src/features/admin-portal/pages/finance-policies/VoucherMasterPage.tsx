import React from 'react';
import { Plus } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const VoucherMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const vouchers = [
    {
      code: 'AUTOHUB2026',
      title: 'Ưu đãi đặt cọc xe khai xuân 2026',
      discount: 'Giảm 10.000.000 ₫',
      minOrder: 'Cọc xe từ 20 triệu',
      usage: '85 / 100 lượt',
      pct: 85,
      validTo: '2026-12-31',
      status: 'Đang chạy',
    },
    {
      code: 'ACC500K',
      title: 'Voucher mua phụ kiện chính hãng',
      discount: 'Giảm 500.000 ₫',
      minOrder: 'Đơn từ 2.000.000 ₫',
      usage: '240 / 500 lượt',
      pct: 48,
      validTo: '2026-11-30',
      status: 'Đang chạy',
    },
    {
      code: 'EVCHARGE1M',
      title: 'Hỗ trợ lắp đặt sạc xe điện tại nhà',
      discount: 'Giảm 1.000.000 ₫',
      minOrder: 'Mua sạc 7.4kW',
      usage: '50 / 50 lượt',
      pct: 100,
      validTo: '2026-10-25',
      status: 'Đã hết lượt',
    },
  ];

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

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Voucher Mới</span>
        </button>
      </div>

      {/* Budget Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Tổng Ngân Sách Đã Giải Ngân</div>
          <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>450.000.000 ₫</div>
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
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Voucher Đang Kích Hoạt</div>
          <div className="text-xl font-bold font-mono text-emerald-500">2 Chiến Dịch</div>
          <div className={`text-[11px] ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Sẵn sàng áp dụng khi thanh toán SePay</div>
        </div>

        <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40'
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>Tổng Lượt Khách Áp Dụng</div>
          <div className={`text-xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>375 Lượt</div>
          <div className="text-[11px] text-blue-600 dark:text-[#89CEFF]">Tỷ lệ chuyển đổi cọc thành công: 84%</div>
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
              <th className="py-3 px-4">Mã Voucher</th>
              <th className="py-3 px-4">Tên Chương Trình</th>
              <th className="py-3 px-4 text-center">Mức Giảm</th>
              <th className="py-3 px-4">Đơn Tối Thiểu</th>
              <th className="py-3 px-4 text-center">Tiến Trình Sử Dụng</th>
              <th className="py-3 px-4 text-center">Hạn Sử Dụng</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {vouchers.map((v) => (
              <tr key={v.code} className={`transition-colors ${
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
                <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-[#10B981]">{v.discount}</td>
                <td className={`py-3 px-4 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{v.minOrder}</td>
                <td className="py-3 px-4 text-center">
                  <div className={`font-mono text-[11px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{v.usage}</div>
                  <div className={`w-20 mx-auto h-1 rounded-full overflow-hidden mt-1 ${isDarkMode ? 'bg-[#131B2E]' : 'bg-slate-100'}`}>
                    <div
                      className={`h-full rounded-full ${v.pct >= 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${v.pct}%` }}
                    />
                  </div>
                </td>
                <td className={`py-3 px-4 text-center font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{v.validTo}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
