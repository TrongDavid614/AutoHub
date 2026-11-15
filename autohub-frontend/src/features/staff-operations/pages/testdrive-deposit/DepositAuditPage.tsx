import React, { useState } from 'react';
import {
  Clock,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  Car,
  CheckCircle2,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { useStaffDepositAudit } from '@/features/staff-operations/hooks/useStaffDepositAudit';
import { DepositCountdownBadge } from '@/features/staff-operations/components/DepositCountdownBadge';
import type { StaffDepositRecord } from '@/types/staff.types';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const DepositAuditPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const {
    deposits,
    availableVins,
    isLoading,
    error,
    refetch,
    fetchAvailableVins,
    assignVin,
    signContract,
  } = useStaffDepositAudit();

  const [search, setSearch] = useState('');
  const [selectedDepositForVin, setSelectedDepositForVin] = useState<StaffDepositRecord | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmSignModal, setConfirmSignModal] = useState<{ depositId: string; customerName: string } | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAssignVin = async (deposit: StaffDepositRecord) => {
    setSelectedDepositForVin(deposit);
    await fetchAvailableVins(deposit.id);
  };

  const handleAssignVinSubmit = async (vin: string) => {
    if (!selectedDepositForVin || isAssigning) return;
    setIsAssigning(true);
    try {
      await assignVin(selectedDepositForVin.id, vin);
      showToast('success', `Đã gán thành công số khung ${vin} cho khách hàng ${selectedDepositForVin.customerName}`);
      setSelectedDepositForVin(null);
    } catch (err) {
      console.error('Lỗi gán VIN:', err);
      showToast('error', 'Không thể gán số khung VIN. Vui lòng kiểm tra lại sự tương thích phiên bản.');
    } finally {
      setIsAssigning(false);
    }
  };

  const executeSignContract = async (depositId: string) => {
    if (isSigning) return;
    setIsSigning(true);
    try {
      await signContract(depositId);
      showToast('success', 'Đã ký Hợp Đồng Mua Bán thành công và cập nhật số khung sang trạng thái ĐÃ BÁN.');
      setConfirmSignModal(null);
    } catch (err) {
      console.error('Lỗi ký hợp đồng vào CSDL:', err);
      showToast('error', 'Không thể cập nhật ký hợp đồng vào CSDL. Vui lòng thử lại!');
    } finally {
      setIsSigning(false);
    }
  };

  const filteredDeposits = deposits.filter((d) =>
    d.customerName.toLowerCase().includes(search.toLowerCase()) ||
    d.depositCode.toLowerCase().includes(search.toLowerCase()) ||
    d.identityCardNumber.includes(search) ||
    d.carModel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Đối Soát Cọc Xe 72 Giờ & Gán Số Khung VIN Xe Vật Lý
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu đồng bộ SQL Server: Đối soát thanh toán cọc SePay, đối chiếu CCCD và gán số khung VIN từ kho xe khả dụng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className={cn(
              'px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5',
              isDarkMode
                ? 'bg-amber-950/70 border-amber-800/40 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            )}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Thời hạn giữ chỗ: 72 Giờ</span>
          </span>
        </div>
      </div>

      {/* 2. Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã cọc, CCCD, tên khách hoặc mẫu xe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            )}
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span>Tổng số phiếu cọc: <strong className="text-blue-500">{deposits.length}</strong></span>
          <span className="text-slate-400">•</span>
          <span>Khớp tìm kiếm: <strong className="text-emerald-500">{filteredDeposits.length}</strong></span>
        </div>
      </div>

      {/* 3. Table / State Handling */}
      {isLoading ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40 shadow-xs">
          <div className="p-8 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded-md w-1/4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 dark:bg-[#131B2E]/60 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div
          className={cn(
            'p-8 text-center rounded-xl border space-y-4',
            isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : filteredDeposits.length === 0 ? (
        <div
          className={cn(
            'p-16 text-center rounded-xl border space-y-3',
            isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          )}
        >
          <Car className="w-10 h-10 mx-auto text-slate-400/60" />
          <p className="text-sm font-medium">Không tìm thấy phiếu cọc nào cần đối soát.</p>
          <p className="text-xs text-slate-400">
            {search ? 'Vui lòng thử tìm kiếm với từ khóa khác.' : 'Tất cả các phiếu cọc hiện tại đã được gán VIN hoặc đã ký hợp đồng.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã Phiếu Cọc</th>
                <th className="py-3.5 px-4 font-semibold">Khách Hàng</th>
                <th className="py-3.5 px-4 font-semibold">Số CCCD</th>
                <th className="py-3.5 px-4 font-semibold">Mẫu Xe Yêu Cầu</th>
                <th className="py-3.5 px-4 font-semibold">Số Tiền Cọc</th>
                <th className="py-3.5 px-4 font-semibold">Thời Hạn Giữ Xe</th>
                <th className="py-3.5 px-4 font-semibold">Số Khung VIN Gán</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#3E4850]/30">
              {filteredDeposits.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-slate-50/50 dark:hover:bg-[#131B2E]/50 transition-colors',
                    isDarkMode ? 'bg-[#0B1326]' : 'bg-white'
                  )}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                    {item.depositCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{item.identityCardNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{item.carModel}</div>
                    <div className="text-[11px] text-slate-400">{item.variant}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyVND(item.depositAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <DepositCountdownBadge
                      initialSeconds={item.remainingSeconds}
                      status={item.status}
                    />
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {item.assignedVin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        {item.assignedVin}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Chưa gán VIN</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!item.assignedVin && (
                        <button
                          type="button"
                          onClick={() => handleOpenAssignVin(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                        >
                          Gán VIN Kho
                        </button>
                      )}
                      {item.assignedVin && item.status !== 'CONTRACT_SIGNED' && item.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={() => setConfirmSignModal({ depositId: item.id, customerName: item.customerName })}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        >
                          Ký Hợp Đồng
                        </button>
                      )}
                      {(item.status === 'CONTRACT_SIGNED' || item.status === 'COMPLETED') && (
                        <span className="text-[11px] font-mono text-emerald-500 font-bold">✓ Đã Hoàn Tất</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Gán VIN */}
      {selectedDepositForVin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={cn(
              'w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <div>
                <span className="text-[10px] uppercase font-mono text-blue-500 font-bold block">Thao Tác Gán Số Khung</span>
                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Gán Số Khung VIN Cho {selectedDepositForVin.depositCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDepositForVin(null)}
                className="p-1.5 rounded-lg border cursor-pointer border-slate-200 dark:border-[#3E4850]/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className={cn(
                'p-4 rounded-xl border space-y-2 text-xs',
                isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Khách hàng</span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedDepositForVin.customerName}</strong>
                  <div className="text-[11px] font-mono">CCCD: {selectedDepositForVin.identityCardNumber}</div>
                </div>
                <div>
                  <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Tiền cọc</span>
                  <span className="font-mono font-bold text-emerald-500 text-sm">
                    {formatCurrencyVND(selectedDepositForVin.depositAmount)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#3E4850]/40">
                <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Mẫu xe đặt cọc</span>
                <div className="font-bold">{selectedDepositForVin.carModel} • {selectedDepositForVin.variant}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn('text-xs font-bold uppercase tracking-wider font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Xe Khả Dụng Trong Kho Khớp Cấu Hình:
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">{availableVins.length} Xe Có Sẵn</span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {availableVins.length === 0 ? (
                  <div
                    className={cn(
                      'p-6 text-center rounded-xl border text-xs font-mono',
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                    )}
                  >
                    Hiện không còn số khung VIN nào ở trạng thái CO_SAN phù hợp với phiên bản xe cọc.
                  </div>
                ) : (
                  availableVins.map((item) => (
                    <div
                      key={item.vin}
                      className={cn(
                        'p-3.5 rounded-xl border space-y-2 transition-all flex flex-col justify-between',
                        isDarkMode
                          ? 'bg-[#131B2E] border-[#3E4850]/50 hover:border-blue-500'
                          : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-blue-600 dark:text-[#89CEFF]">
                          VIN: {item.vin}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-bold">
                          CÓ SẴN
                        </span>
                      </div>

                      <div className="text-xs space-y-0.5">
                        <div className="font-semibold">{item.model}</div>
                        <div className={cn('text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                          Màu: {item.color} • {item.location}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={isAssigning}
                          onClick={() => handleAssignVinSubmit(item.vin)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {isAssigning ? 'Đang gán...' : 'Khóa VIN Này Cho Khách'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Sign Contract Modal */}
      {confirmSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={cn(
              'w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4',
              isDarkMode ? 'bg-[#171F33] border-[#3E4850]/60 text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-sm">Xác Nhận Ký Hợp Đồng Mua Bán</h3>
              <button
                type="button"
                onClick={() => setConfirmSignModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Xác nhận khách hàng <strong className="text-white">{confirmSignModal.customerName}</strong> đã đến Showroom hoàn tất ký Hợp Đồng Mua Bán xe vật lý? Trạng thái phiếu cọc sẽ được chuyển sang <strong className="text-emerald-400">COMPLETED</strong> và số VIN sẽ chuyển sang <strong className="text-emerald-400">ĐÃ BÁN</strong>.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSignModal(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isSigning}
                onClick={() => executeSignContract(confirmSignModal.depositId)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSigning ? 'Đang cập nhật...' : 'Xác Nhận Ký HĐMB'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200',
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          )}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
