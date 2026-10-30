import React, { useState, useEffect } from 'react';
import {
  Clock,
  Search,
  X,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  MOCK_STAFF_DEPOSITS,
  type StaffDepositRecord,
} from '@/features/staff-operations/mocks/staff.mock';
import { cn, formatCurrencyVND } from '@/lib/utils';

export const DepositAuditPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [deposits, setDeposits] = useState<StaffDepositRecord[]>(MOCK_STAFF_DEPOSITS);
  const [search, setSearch] = useState('');
  const [selectedDepositForVin, setSelectedDepositForVin] = useState<StaffDepositRecord | null>(null);

  // Available physical VINs in showroom warehouse inventory
  const availableVins = [
    { vin: 'VF8-VIN-2026-9921', model: 'VinFast VF8 Plus AWD', color: 'Xanh Deep Ocean', location: 'Kho Showroom Q.7 (Khu B-04)' },
    { vin: 'VF8-VIN-2026-9925', model: 'VinFast VF8 Plus AWD', color: 'Xanh Deep Ocean', location: 'Kho Showroom Q.7 (Khu B-06)' },
    { vin: 'VF9-VIN-2026-8802', model: 'VinFast VF9 Plus 6 Chỗ', color: 'Trắng Ngọc Trai', location: 'Kho Showroom Q.7 (Khu A-01)' },
    { vin: 'HMC-SAN-2026-7711', model: 'Hyundai SantaFe Calligraphy', color: 'Đen Phantom', location: 'Kho Showroom Q.7 (Khu C-02)' },
  ];

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

  const handleAssignVin = (vin: string) => {
    if (!selectedDepositForVin) return;
    setDeposits((prev) =>
      prev.map((d) =>
        d.id === selectedDepositForVin.id
          ? { ...d, assignedVin: vin, status: 'VIN_ASSIGNED' as const }
          : d
      )
    );
    alert(`Đã gán thành công số khung ${vin} cho khách hàng ${selectedDepositForVin.customerName} và gửi email xác nhận!`);
    setSelectedDepositForVin(null);
  };

  const handleSignContract = (depositId: string, customerName: string) => {
    if (confirm(`Xác nhận khách hàng ${customerName} đã đến Showroom hoàn tất ký Hợp Đồng Mua Bán xe vật lý?`)) {
      setDeposits((prev) =>
        prev.map((d) =>
          d.id === depositId
            ? { ...d, status: 'CONTRACT_SIGNED' as const }
            : d
        )
      );
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
            Kiểm tra đối soát thanh toán SePay IPN, số CCCD định danh và gán số khung VIN xe có sẵn trong kho showroom trong thời hạn 72h.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5',
              isDarkMode
                ? 'bg-amber-950/70 border-amber-800/40 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            )}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Quy Tắc Khóa Cọc: Tối đa 72 Giờ</span>
          </span>
        </div>
      </div>

      {/* 2. Search Bar & Status Legend */}
      <div
        className={cn(
          'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        <div className="relative w-full sm:w-80">
          <Search
            className={cn(
              'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2',
              isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
            )}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã cọc, CCCD 12 số, tên khách..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            )}
          />
        </div>

        <div className={cn('text-xs font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
          Tổng số: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{filteredDeposits.length}</strong> phiếu cọc
        </div>
      </div>

      {/* 3. Data Table (<Datagrid>) */}
      <div
        className={cn(
          'rounded-xl border overflow-hidden transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3 px-4">Mã Phiếu Cọc</th>
                <th className="py-3 px-4">Khách Hàng & CCCD</th>
                <th className="py-3 px-4">Dòng Xe & Màu Sơn</th>
                <th className="py-3 px-4 text-right">Số Tiền Cọc</th>
                <th className="py-3 px-4 text-center">Thời Hạn 72H</th>
                <th className="py-3 px-4 text-center">Số Khung VIN Đã Gán</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
              {filteredDeposits.map((dep) => {
                const isUrgent = dep.remainingSeconds < 3600 * 6 && dep.remainingSeconds > 0;
                return (
                  <tr
                    key={dep.id}
                    className={cn(
                      'transition-colors',
                      isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50'
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-600 dark:text-[#89CEFF]">
                        {dep.depositCode}
                      </div>
                      <div className={cn('font-mono text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                        {dep.sepayTxnRef}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                        {dep.customerName}
                      </div>
                      <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                        CCCD: {dep.identityCardNumber} • {dep.customerPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>
                        {dep.carModel} • {dep.variant}
                      </div>
                      <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>
                        Màu sơn: {dep.exteriorColor}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                      {formatCurrencyVND(dep.depositAmount)}
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      {dep.status === 'CONTRACT_SIGNED' ? (
                        <span className="text-[11px] text-emerald-500 font-bold">
                          ✓ Đã Ký Hợp Đồng
                        </span>
                      ) : (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold',
                            isUrgent
                              ? 'bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 animate-pulse'
                              : 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400'
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{formatCountdown(dep.remainingSeconds)}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      {dep.assignedVin ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#89CEFF] border border-blue-200 dark:border-blue-800/40">
                          {dep.assignedVin}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                          Chưa Gán Số VIN
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!dep.assignedVin && (
                          <button
                            type="button"
                            onClick={() => setSelectedDepositForVin(dep)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                          >
                            Gán Số VIN
                          </button>
                        )}

                        {dep.assignedVin && dep.status !== 'CONTRACT_SIGNED' && (
                          <button
                            type="button"
                            onClick={() => handleSignContract(dep.id, dep.customerName)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
                          >
                            Ký Hợp Đồng
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Ngăn kéo trượt chọn số khung VIN từ kho Showroom (<AssignVINSheet> 560px) */}
      {selectedDepositForVin && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-xl h-full overflow-y-auto border-l p-6 space-y-5 shadow-2xl transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850] text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-500 uppercase font-bold">Khóa Xe Vật Lý Vào Phiếu Cọc</span>
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

            {/* Deposit Info Card */}
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
                <span className={cn('text-[10px] uppercase font-mono block', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Yêu cầu cấu hình</span>
                <div className="font-bold">{selectedDepositForVin.carModel} • {selectedDepositForVin.variant}</div>
                <div className="text-[11px] text-blue-500">Màu sơn ngoại thất: {selectedDepositForVin.exteriorColor}</div>
              </div>
            </div>

            {/* Warehouse Physical Cars */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn('text-xs font-bold uppercase tracking-wider font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Xe Khả Dụng Trong Kho Khớp Cấu Hình:
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">2 Xe Có Sẵn</span>
              </div>

              <div className="space-y-2.5">
                {availableVins.map((item) => (
                  <div
                    key={item.vin}
                    className={cn(
                      'p-4 rounded-xl border space-y-2 transition-all flex flex-col justify-between',
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
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
                      >
                        Khóa VIN Này Cho Khách
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
