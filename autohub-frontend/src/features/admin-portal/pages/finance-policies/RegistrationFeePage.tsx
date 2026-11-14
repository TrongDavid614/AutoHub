import React from 'react';
import {
  Info,
  Plus,
  RefreshCw,
  Landmark,
  Percent,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { cn } from '@/lib/utils';
import { useAdminFees } from '../../hooks/useAdminFees';
import { CreateOrEditFeeModal } from '../../components/CreateOrEditFeeModal';
import { CreateOrEditLoanModal } from '../../components/CreateOrEditLoanModal';

export const RegistrationFeePage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();

  const {
    activeTab,
    setActiveTab,
    fees,
    loans,
    stats,
    provinces,
    isLoading,
    error,
    toastMessage,
    toastType,
    isSubmitting,
    isFeeModalOpen,
    editingFee,
    isLoanModalOpen,
    editingLoan,
    loadAll,
    openCreateFeeModal,
    openEditFeeModal,
    closeFeeModal,
    handleSaveFee,
    handleDeleteFee,
    openCreateLoanModal,
    openEditLoanModal,
    closeLoanModal,
    handleSaveLoan,
    handleToggleLoanStatus,
    handleDeleteLoan,
  } = useAdminFees();

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-5 right-5 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 text-xs max-w-md animate-fade-in transition-all',
            toastType === 'success'
              ? isDarkMode
                ? 'bg-[#0D2818] border-emerald-500/50 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : isDarkMode
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          )}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          )}
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
              Quản Lý Biểu Phí Lăn Bánh & Lãi Suất Vay Trả Góp
            </h1>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-full font-bold',
                isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-blue-100 text-blue-700'
              )}
            >
              DR25 PRICING
            </span>
          </div>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Cấu hình tỷ lệ trước bạ, tiền biển số tỉnh thành và bảng lãi suất vay mua ô tô phục vụ công cụ Dự toán lăn bánh.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Refresh button */}
          <button
            type="button"
            onClick={loadAll}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shadow-sm',
              isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border-[#3E4850]/50 hover:bg-[#1E293B]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            <span>Làm Mới</span>
          </button>

          {/* Add button based on active tab */}
          {activeTab === 'fees' ? (
            <button
              type="button"
              onClick={openCreateFeeModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Biểu Phí Tỉnh/Thành</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateLoanModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Ngân Hàng Liên Kết</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Configured provinces */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Tỉnh/Thành Đã Cấu Hình
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono">
              {stats.configuredProvinces} / {stats.totalProvinces}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Tỉnh/thành phố toàn quốc</span>
          </div>
        </div>

        {/* Card 2: Average Registration Tax */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Trước Bạ Trung Bình
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-sky-500">
              {stats.avgRegistrationTaxRate}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Xe Xăng & Hybrid (10% - 12%)</span>
          </div>
        </div>

        {/* Card 3: EV Tax Exemption */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Trước Bạ Ô Tô Điện (EV)
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-[#10B981]">
              0.0% (Miễn 100%)
            </div>
            <span className="text-[11px] text-emerald-500 mt-1 font-medium">Theo Nghị định Bộ Tài Chính</span>
          </div>
        </div>

        {/* Card 4: Partner Banks */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all flex flex-col justify-between',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('text-xs font-semibold', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Đối Tác Ngân Hàng
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono">{stats.totalBankPartners} Ngân Hàng</div>
            <span className="text-[11px] text-slate-400 mt-1">
              Lãi suất từ {stats.lowestInterestRate}% • LTV tới {stats.maxLtv}%
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={cn('flex border-b gap-4', isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-200')}>
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={cn(
            'pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2',
            activeTab === 'fees'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
              ? 'text-[#88929B] border-transparent hover:text-white'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          )}
        >
          <Percent className="w-4 h-4" />
          <span>Biểu Phí Lăn Bánh Theo Tỉnh/Thành</span>
          <span
            className={cn(
              'px-2 py-0.2 rounded-full text-[10px] font-mono',
              isDarkMode ? 'bg-[#171F33] text-[#89CEFF]' : 'bg-blue-100 text-blue-700'
            )}
          >
            {fees.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={cn(
            'pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2',
            activeTab === 'loans'
              ? isDarkMode
                ? 'text-[#89CEFF] border-[#89CEFF]'
                : 'text-blue-600 border-blue-600'
              : isDarkMode
              ? 'text-[#88929B] border-transparent hover:text-white'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          )}
        >
          <Landmark className="w-4 h-4" />
          <span>Gói Vay Ngân Hàng Liên Kết (Lãi Suất & Kỳ Hạn)</span>
          <span
            className={cn(
              'px-2 py-0.2 rounded-full text-[10px] font-mono',
              isDarkMode ? 'bg-[#171F33] text-purple-400' : 'bg-purple-100 text-purple-700'
            )}
          >
            {loans.length}
          </span>
        </button>
      </div>

      {/* Legal Info Note */}
      <div
        className={cn(
          'p-3.5 rounded-xl border text-xs flex items-center gap-2.5',
          isDarkMode
            ? 'bg-[#0F172A] border-[#38BDF8]/40 text-[#BAE6FD]'
            : 'bg-sky-50 border-sky-200 text-sky-800'
        )}
      >
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span>
          Căn cứ Nghị định Chính phủ & Bộ Tài Chính: Ô tô thuần điện (EV) tiếp tục được miễn 100% lệ phí trước bạ; lệ phí cấp biển số Hà Nội & TP.HCM cố định 20.000.000 ₫/xe, các tỉnh thành khác 1.000.000 ₫/xe.
        </span>
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadAll}
            className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Main Table Content */}
      <div
        className={cn(
          'rounded-2xl border overflow-hidden transition-colors shadow-sm',
          isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40' : 'bg-white border-slate-200'
        )}
      >
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <p className={cn('text-xs font-medium', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
              Đang tải dữ liệu biểu phí từ hệ thống...
            </p>
          </div>
        ) : activeTab === 'fees' ? (
          /* TAB 1: REGISTRATION FEES TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={cn(
                  'font-mono uppercase text-[11px] border-b tracking-wider',
                  isDarkMode
                    ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                <tr>
                  <th className="py-3 px-4">Tỉnh / Thành Phố</th>
                  <th className="py-3 px-4 text-center">Thuế Trước Bạ (Xăng/Hybrid)</th>
                  <th className="py-3 px-4 text-center">Trước Bạ Xe Điện (EV)</th>
                  <th className="py-3 px-4 text-right">Lệ Phí Cấp Biển Số</th>
                  <th className="py-3 px-4 text-right">Phí Đăng Kiểm</th>
                  <th className="py-3 px-4 text-right">Bảo Trì Đường Bộ (1 Năm)</th>
                  <th className="py-3 px-4 text-right">Bảo Hiểm TNDS</th>
                  <th className="py-3 px-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody
                className={cn('divide-y font-sans font-medium', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}
              >
                {fees.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                    )}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                          {row.provinceName}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.2 rounded-full font-mono',
                            row.region === 'Miền Bắc'
                              ? 'bg-rose-500/10 text-rose-500'
                              : row.region === 'Miền Trung'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          )}
                        >
                          {row.region}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-blue-600 dark:text-[#89CEFF] font-bold">
                      {row.registrationTaxRate?.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-600 dark:text-[#10B981] font-bold">
                      0.0% (Miễn 100%)
                    </td>
                    <td className={cn('py-3.5 px-4 text-right font-mono font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                      {Number(row.licensePlateFee).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className={cn('py-3.5 px-4 text-right font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {Number(row.inspectionFee).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className={cn('py-3.5 px-4 text-right font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {Number(row.roadMaintenanceFee).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className={cn('py-3.5 px-4 text-right font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                      {Number(row.mandatoryInsuranceFee).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditFeeModal(row)}
                          title="Chỉnh sửa biểu phí"
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors cursor-pointer',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:text-white hover:bg-slate-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          )}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFee(row.id, row.provinceName)}
                          title="Xóa biểu phí"
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors cursor-pointer',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50'
                              : 'bg-rose-50 border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-100'
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: BANK LOAN PACKAGES TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={cn(
                  'font-mono uppercase text-[11px] border-b tracking-wider',
                  isDarkMode
                    ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                <tr>
                  <th className="py-3 px-4">Ngân Hàng Liên Kết</th>
                  <th className="py-3 px-4 text-center">Lãi Suất Ưu Đãi Năm Đầu</th>
                  <th className="py-3 px-4 text-center">Lãi Suất Thả Nổi Dự Kiến</th>
                  <th className="py-3 px-4 text-center">Kỳ Hạn Vay Tối Đa</th>
                  <th className="py-3 px-4 text-center">Hạn Mức Vay (LTV)</th>
                  <th className="py-3 px-4">Chính Sách & Ghi Chú</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody
                className={cn('divide-y font-sans font-medium', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}
              >
                {loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50/80'
                    )}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={cn('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                            {loan.bankName}
                          </span>
                          {loan.bankCode && (
                            <span className="text-[10px] font-mono text-slate-400 ml-1.5">
                              ({loan.bankCode})
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-500">
                      {loan.firstYearRate?.toFixed(2)}% / Năm
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-500">
                      {loan.floatingRate?.toFixed(2)}% / Năm
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {loan.maxTenorYears} Năm
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-500">
                      {loan.maxLtvPercent}% Giá trị xe
                    </td>
                    <td className={cn('py-3.5 px-4 text-xs max-w-xs truncate', isDarkMode ? 'text-[#88929B]' : 'text-slate-600')}>
                      {loan.note || 'Không có ghi chú'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleLoanStatus(loan.id, loan.active)}
                        className="cursor-pointer"
                        title={loan.active ? 'Đang kích hoạt (Nhấn để tạm dừng)' : 'Tạm dừng (Nhấn để kích hoạt)'}
                      >
                        {loan.active ? (
                          <span className="flex items-center justify-center gap-1 text-[11px] text-emerald-500 font-semibold">
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold">
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                            <span>Tạm dừng</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditLoanModal(loan)}
                          title="Chỉnh sửa gói vay"
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors cursor-pointer',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-slate-300 hover:text-white hover:bg-slate-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          )}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLoan(loan.id, loan.bankName)}
                          title="Xóa gói vay"
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors cursor-pointer',
                            isDarkMode
                              ? 'bg-[#171F33] border-[#3E4850]/50 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50'
                              : 'bg-rose-50 border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-100'
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateOrEditFeeModal
        isOpen={isFeeModalOpen}
        onClose={closeFeeModal}
        onSave={handleSaveFee}
        editingFee={editingFee}
        provinces={provinces}
        isSubmitting={isSubmitting}
      />

      <CreateOrEditLoanModal
        isOpen={isLoanModalOpen}
        onClose={closeLoanModal}
        onSave={handleSaveLoan}
        editingLoan={editingLoan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
