import React, { useState, useEffect } from 'react';
import {
  Clock,
  Search,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { AvailableVinOption, StaffDepositRecord } from '@/types/staff.types';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const DepositAuditPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [deposits, setDeposits] = useState<StaffDepositRecord[]>([]);
  const [availableVins, setAvailableVins] = useState<AvailableVinOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDepositForVin, setSelectedDepositForVin] = useState<StaffDepositRecord | null>(null);

  // Load real deposits and physical VINs from database via API
  const fetchDeposits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [depositsData, vinsData] = await Promise.all([
        staffService.getStaffDeposits(),
        staffService.getAvailableVins(),
      ]);
      setDeposits(depositsData);
      setAvailableVins(vinsData);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu phiếu cọc hoặc VIN kho từ database:', err);
      setError('Không thể nạp dữ liệu phiếu cọc và số khung VIN từ SQL Server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // 1-second countdown ticking timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDeposits((prev) =>
        prev.map((d) => ({
          ...d,
          remainingSeconds: Math.max(0, d.remainingSeconds - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    if (secs <= 0) return 'Đã hết hạn 72h';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `Còn ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAssignVin = async (vin: string) => {
    if (!selectedDepositForVin) return;
    try {
      await staffService.assignVinToDeposit(selectedDepositForVin.id, vin);
      await fetchDeposits();
      alert(`Đã gán thành công số khung ${vin} cho khách hàng ${selectedDepositForVin.customerName} và lưu vào database!`);
      setSelectedDepositForVin(null);
    } catch (err) {
      console.error('Lỗi gán VIN:', err);
      alert('Không thể gán số khung VIN. Vui lòng thử lại.');
    }
  };

  const handleSignContract = async (depositId: string, customerName: string) => {
    if (confirm(`Xác nhận khách hàng ${customerName} đã đến Showroom hoàn tất ký Hợp Đồng Mua Bán xe vật lý?`)) {
      try {
        await staffService.signContract(depositId);
        setDeposits((prev) =>
          prev.map((d) =>
            d.id === depositId
              ? { ...d, status: 'COMPLETED' as const }
              : d
          )
        );
      } catch (err) {
        console.error('Lỗi ký hợp đồng vào CSDL:', err);
        alert('Không thể cập nhật ký hợp đồng vào CSDL. Vui lòng thử lại!');
      }
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
            Dữ liệu trực tiếp từ SQL Server: Kiểm tra đối soát thanh toán SePay, số CCCD và gán số khung VIN trong kho xe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDeposits}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
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
        </div>
      </div>

      {/* 3. Table / Card List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách phiếu cọc từ cơ sở dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={cn('p-10 text-center rounded-xl border space-y-3', isDarkMode ? 'bg-[#0B1326] border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700')}>
          <p className="text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchDeposits}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : filteredDeposits.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không tìm thấy phiếu cọc nào trong cơ sở dữ liệu.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3E4850]/40 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className={cn('font-mono uppercase text-[11px] border-b', isDarkMode ? 'bg-[#131B2E] text-slate-400 border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200')}>
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã Phiếu Cọc</th>
                <th className="py-3.5 px-4 font-semibold">Khách Hàng</th>
                <th className="py-3.5 px-4 font-semibold">Số CCCD</th>
                <th className="py-3.5 px-4 font-semibold">Mẫu Xe Yêu Cầu</th>
                <th className="py-3.5 px-4 font-semibold">Số Tiền Cọc</th>
                <th className="py-3.5 px-4 font-semibold">Đếm Ngược 72h</th>
                <th className="py-3.5 px-4 font-semibold">Số Khung VIN Gán</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#3E4850]/30">
              {filteredDeposits.map((item) => (
                <tr key={item.id} className={cn('hover:bg-slate-50/50 dark:hover:bg-[#131B2E]/50 transition-colors', isDarkMode ? 'bg-[#0B1326]' : 'bg-white')}>
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
                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-500">
                    {formatCountdown(item.remainingSeconds)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {item.assignedVin ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
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
                          onClick={() => setSelectedDepositForVin(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                        >
                          Gán VIN Kho
                        </button>
                      )}
                      {item.assignedVin && item.status !== 'CONTRACT_SIGNED' && item.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={() => handleSignContract(item.id, item.customerName)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        >
                          Ký Hợp Đồng
                        </button>
                      )}
                      {(item.status === 'CONTRACT_SIGNED' || item.status === 'COMPLETED') && (
                        <span className="text-[11px] font-mono text-emerald-500 font-bold">Đã ký HĐMB</span>
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
          <div className={cn('w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
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

            <div className={cn('p-4 rounded-xl border space-y-2 text-xs', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
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
                  <div className={cn('p-6 text-center rounded-xl border text-xs font-mono', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')}>
                    Hiện không còn số khung VIN nào ở trạng thái CO_SAN trong cơ sở dữ liệu.
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
                          onClick={() => handleAssignVin(item.vin)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                        >
                          Khóa VIN Này Cho Khách
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
    </div>
  );
};
