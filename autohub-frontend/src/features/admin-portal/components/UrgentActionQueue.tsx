import React, { useState, useEffect } from 'react';
import { Clock, BellRing, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_URGENT_DEPOSITS, type UrgentDeposit } from '../mocks/dashboard.mock';
import { formatCurrencyVND } from '@/lib/utils';

export interface UrgentActionQueueProps {
  deposits?: UrgentDeposit[];
}

export const UrgentActionQueue: React.FC<UrgentActionQueueProps> = ({
  deposits = MOCK_URGENT_DEPOSITS,
}) => {
  const { isDarkMode } = useAdminTheme();
  const [items, setItems] = useState<UrgentDeposit[]>(deposits);
  const [nudgedIds, setNudgedIds] = useState<string[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<UrgentDeposit | null>(null);

  // Live countdown timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          remainingSeconds: Math.max(0, item.remainingSeconds - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `Còn ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleNudgeStaff = (id: string, staffName: string) => {
    setNudgedIds((prev) => [...prev, id]);
    alert(`Đã gửi thông báo đẩy khẩn cấp & SMS tới ${staffName} để đốc thúc hoàn tất hợp đồng cho khách!`);
  };

  return (
    <div className={`rounded-xl border p-6 transition-colors ${
      isDarkMode
        ? 'bg-[#131B2E] border-[#3E4850]/50 shadow-xl'
        : 'bg-white border-slate-200 shadow-sm'
    } space-y-4`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
        isDarkMode ? 'border-[#3E4850]/40' : 'border-slate-100'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h2 className={`text-base font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Hàng Đợi Tác Vụ Khẩn Cấp (Cọc Xe 72 Giờ)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 text-[10px] font-mono font-bold animate-pulse">
              4 SUẤT SẮP HẾT HẠN
            </span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}`}>
            Cảnh báo các phiếu cọc xe sắp chạm mốc 72h (&lt; 6 tiếng) cần lãnh đạo kiểm tra đốc thúc Staff xử lý
          </p>
        </div>

        <div className={`flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-lg border ${
          isDarkMode
            ? 'text-[#88929B] bg-[#0B1326] border-[#3E4850]/40'
            : 'text-slate-600 bg-slate-50 border-slate-200'
        }`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Cron Job quét cọc:</span>
          <span className="text-emerald-500 font-bold">Mỗi 60s</span>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
              isDarkMode
                ? 'border-[#3E4850]/60 text-[#88929B]'
                : 'border-slate-200 text-slate-500 bg-slate-50/70'
            }`}>
              <th className="py-3 px-3">Mã Phiếu Cọc</th>
              <th className="py-3 px-3">Khách Hàng & SĐT</th>
              <th className="py-3 px-3">Dòng Xe Đặt Cọc</th>
              <th className="py-3 px-3">Số Tiền Cọc</th>
              <th className="py-3 px-3">Thời Hạn 72H</th>
              <th className="py-3 px-3">Staff Phụ Trách</th>
              <th className="py-3 px-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100'
          }`}>
            {items.map((item) => {
              const isUrgent = item.remainingSeconds < 3600 * 3; // dưới 3 tiếng
              const hasNudged = nudgedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className={`transition-colors group ${
                    isDarkMode ? 'hover:bg-[#171F33]/70' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Mã cọc */}
                  <td className="py-3 px-3">
                    <span className={`font-mono font-bold group-hover:underline cursor-pointer ${
                      isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                    }`}>
                      {item.depositCode}
                    </span>
                    <div className={`text-[10px] font-mono ${
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                    }`}>
                      {item.sepayTxnRef || item.vnpayTxnRef}
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="py-3 px-3">
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {item.customerName}
                    </div>
                    <div className={`text-[11px] font-mono ${
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                    }`}>
                      {item.customerPhone}
                    </div>
                  </td>

                  {/* Dòng xe */}
                  <td className="py-3 px-3">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
                    }`}>
                      {item.carModel}
                    </div>
                    <div className={`text-[10px] ${
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                    }`}>
                      {item.variant} • {item.color}
                    </div>
                  </td>

                  {/* Tiền cọc */}
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                    {formatCurrencyVND(item.depositAmount)}
                  </td>

                  {/* Countdown Timer */}
                  <td className="py-3 px-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                        isUrgent
                          ? 'bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 animate-pulse'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{formatCountdown(item.remainingSeconds)}</span>
                    </div>
                  </td>

                  {/* Staff & Showroom */}
                  <td className="py-3 px-3">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {item.assignedStaff}
                    </div>
                    <div className={`text-[10px] ${
                      isDarkMode ? 'text-[#88929B]' : 'text-slate-500'
                    }`}>
                      {item.assignedShowroom}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleNudgeStaff(item.id, item.assignedStaff)}
                        disabled={hasNudged}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          hasNudged
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : isDarkMode
                              ? 'bg-[#0B1326] hover:bg-amber-500 text-amber-400 hover:text-[#060E20] border border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                              : 'bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300'
                        }`}
                      >
                        {hasNudged ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Đã Nhắc</span>
                          </>
                        ) : (
                          <>
                            <BellRing className="w-3 h-3" />
                            <span>Đốc Thúc</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveModalItem(item)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#0B1326] text-[#88929B] hover:text-[#89CEFF] border-[#3E4850]/60 hover:border-[#89CEFF]/50'
                            : 'bg-slate-50 text-slate-500 hover:text-blue-600 border-slate-200 hover:border-blue-400'
                        }`}
                        title="Xem chi tiết phiếu cọc"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Quick View */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg rounded-xl border p-6 shadow-2xl space-y-4 ${
            isDarkMode
              ? 'bg-[#131B2E] border-[#3E4850]'
              : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDarkMode ? 'border-[#3E4850]/60' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className={`font-bold text-sm ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Chi Tiết Phiếu Cọc {activeModalItem.depositCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className={`font-mono text-sm cursor-pointer ${
                  isDarkMode ? 'text-[#88929B] hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-[#0B1326] border-[#3E4850]/40'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`block text-[10px] uppercase font-mono ${
                    isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                  }`}>
                    Khách hàng
                  </span>
                  <span className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {activeModalItem.customerName}
                  </span>
                  <div className={`font-mono ${
                    isDarkMode ? 'text-[#89CEFF]' : 'text-blue-600'
                  }`}>
                    {activeModalItem.customerPhone}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-[#0B1326] border-[#3E4850]/40'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`block text-[10px] uppercase font-mono ${
                    isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                  }`}>
                    Tiền cọc giữ xe
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-[#10B981] text-sm">
                    {formatCurrencyVND(activeModalItem.depositAmount)}
                  </span>
                  <div className={`text-[10px] ${
                    isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                  }`}>
                    Cổng SePay IPN
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border space-y-1 ${
                isDarkMode
                  ? 'bg-[#0B1326] border-[#3E4850]/40'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`block text-[10px] uppercase font-mono ${
                  isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
                }`}>
                  Dòng xe đặt cọc
                </span>
                <span className={`font-bold text-sm ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeModalItem.carModel} • {activeModalItem.variant}
                </span>
                <div className={`text-[11px] ${
                  isDarkMode ? 'text-[#BEC8D2]' : 'text-slate-600'
                }`}>
                  Màu ngoại thất: {activeModalItem.color}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div>
                  <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>
                    Staff phụ trách:
                  </span>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeModalItem.assignedStaff}
                  </div>
                </div>
                <div>
                  <span className={isDarkMode ? 'text-[#88929B]' : 'text-slate-500'}>
                    Chi nhánh:
                  </span>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeModalItem.assignedShowroom}
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex justify-end gap-3 pt-3 border-t ${
              isDarkMode ? 'border-[#3E4850]/60' : 'border-slate-100'
            }`}>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#171F33] hover:bg-[#222A3D] text-[#DAE2FD]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNudgeStaff(activeModalItem.id, activeModalItem.assignedStaff);
                  setActiveModalItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Đốc Thúc Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
