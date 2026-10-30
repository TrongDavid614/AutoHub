import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';

export const RegistrationFeePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'fees' | 'loans'>('fees');

  const provincialFees = [
    { province: 'Hà Nội', taxRate: '12.0%', plateFee: '20.000.000 ₫', inspectionFee: '90.000 ₫', roadFee: '1.560.000 ₫', insurance: '480.700 ₫' },
    { province: 'TP. Hồ Chí Minh', taxRate: '10.0%', plateFee: '20.000.000 ₫', inspectionFee: '90.000 ₫', roadFee: '1.560.000 ₫', insurance: '480.700 ₫' },
    { province: 'Đà Nẵng', taxRate: '10.0%', plateFee: '1.000.000 ₫', inspectionFee: '90.000 ₫', roadFee: '1.560.000 ₫', insurance: '480.700 ₫' },
    { province: 'Bình Dương / Đồng Nai', taxRate: '10.0%', plateFee: '1.000.000 ₫', inspectionFee: '90.000 ₫', roadFee: '1.560.000 ₫', insurance: '480.700 ₫' },
  ];

  const bankLoans = [
    { bank: 'Vietcombank', firstYearRate: '6.99%', floatRate: '10.5%', maxTenor: '8 Năm', maxLtv: '80%' },
    { bank: 'Techcombank', firstYearRate: '7.49%', floatRate: '11.2%', maxTenor: '8 Năm', maxLtv: '85%' },
    { bank: 'VPBank', firstYearRate: '7.99%', floatRate: '11.8%', maxTenor: '7 Năm', maxLtv: '80%' },
    { bank: 'Shinhan Bank', firstYearRate: '6.80%', floatRate: '10.2%', maxTenor: '8 Năm', maxLtv: '75%' },
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
            Quản Lý Biểu Phí Lăn Bánh & Trần Lãi Suất Vay Trả Góp
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Cấu hình tỷ lệ trước bạ, tiền biển số tỉnh thành và bảng lãi suất vay mua ô tô phục vụ công cụ Dự toán lăn bánh.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cấu Hình Mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex border-b gap-4 ${isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'fees'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
                ? 'text-[#88929B] border-transparent hover:text-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Biểu Phí Lăn Bánh Theo Tỉnh/Thành
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'loans'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
                ? 'text-[#88929B] border-transparent hover:text-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          Gói Vay Ngân Hàng Liên Kết (Lãi Suất & Kỳ Hạn)
        </button>
      </div>

      {/* Legal Info Note */}
      <div className={`p-3.5 rounded-lg border text-xs flex items-center gap-2.5 ${
        isDarkMode
          ? 'bg-[#0F172A] border-[#38BDF8]/40 text-[#BAE6FD]'
          : 'bg-sky-50 border-sky-200 text-sky-800'
      }`}>
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span>
          Căn cứ Nghị định Bộ Tài Chính: Ô tô thuần điện (EV) tiếp tục được miễn 100% lệ phí trước bạ; phí biển số Hà Nội & TP.HCM cố định 20.000.000 ₫/xe.
        </span>
      </div>

      {/* Table Content */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {activeTab === 'fees' ? (
          <table className="w-full text-left text-xs">
            <thead className={`font-mono uppercase text-[11px] border-b ${
              isDarkMode
                ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                : 'bg-slate-50/80 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Tỉnh / Thành Phố</th>
                <th className="py-3 px-4 text-center">Thuế Trước Bạ (Xăng/Hybrid)</th>
                <th className="py-3 px-4 text-center">Trước Bạ Xe Điện (EV)</th>
                <th className="py-3 px-4 text-right">Lệ Phí Cấp Biển Số</th>
                <th className="py-3 px-4 text-right">Bảo Trì Đường Bộ (1 Năm)</th>
                <th className="py-3 px-4 text-right">Bảo Hiểm TNDS Bắt Buộc</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {provincialFees.map((row) => (
                <tr key={row.province} className={`transition-colors ${
                  isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                }`}>
                  <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row.province}</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600 dark:text-[#89CEFF] font-semibold">{row.taxRate}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-[#10B981] font-bold">0.0% (Miễn phí)</td>
                  <td className={`py-3 px-4 text-right font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row.plateFee}</td>
                  <td className={`py-3 px-4 text-right font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{row.roadFee}</td>
                  <td className={`py-3 px-4 text-right font-mono ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>{row.insurance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className={`font-mono uppercase text-[11px] border-b ${
              isDarkMode
                ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                : 'bg-slate-50/80 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Ngân Hàng Liên Kết</th>
                <th className="py-3 px-4 text-center">Lãi Suất Ưu Đãi Năm Đầu</th>
                <th className="py-3 px-4 text-center">Lãi Suất Thả Nổi Dự Kiến</th>
                <th className="py-3 px-4 text-center">Kỳ Hạn Vay Tối Đa</th>
                <th className="py-3 px-4 text-center">Hạn Mức Cho Vay (LTV)</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-sans ${
              isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
            }`}>
              {bankLoans.map((b) => (
                <tr key={b.bank} className={`transition-colors ${
                  isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                }`}>
                  <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{b.bank}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-600 dark:text-[#10B981] font-bold">{b.firstYearRate}</td>
                  <td className="py-3 px-4 text-center font-mono text-amber-600 dark:text-[#F59E0B] font-semibold">{b.floatRate}</td>
                  <td className={`py-3 px-4 text-center font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{b.maxTenor}</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600 dark:text-[#89CEFF] font-bold">Tối đa {b.maxLtv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
