import React, { useState, useEffect } from 'react';
import { Clock, BellRing, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import type { UrgentDeposit } from '@/types/admin-dashboard.types';
import { MOCK_URGENT_DEPOSITS } from '../mocks/dashboard.mock';
import { formatCurrencyVND } from '@/lib/utils';
import { adminDashboardService } from '../services/admin-dashboard.service';

export interface UrgentActionQueueProps {
  deposits?: UrgentDeposit[];
}

export const UrgentActionQueue: React.FC<UrgentActionQueueProps> = ({
  deposits = MOCK_URGENT_DEPOSITS,
}) => {
  const [items, setItems] = useState<UrgentDeposit[]>(deposits);
  const [nudgedIds, setNudgedIds] = useState<string[]>([]);
  const [nudgingId, setNudgingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<UrgentDeposit | null>(null);

  // Sync items when deposits prop updates
  useEffect(() => {
    setItems(deposits);
  }, [deposits]);

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

  const handleNudgeStaff = async (id: string, staffName: string) => {
    if (nudgingId || nudgedIds.includes(id)) return;
    setNudgingId(id);
    try {
      const msg = await adminDashboardService.nudgeStaff(id);
      setNudgedIds((prev) => [...prev, id]);
      setToastMessage(msg || `Đã gửi thông báo ưu tiên cao tới ${staffName}!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: unknown) {
      console.error('Nudge staff error:', err);
      setToastMessage(`Không thể gửi thông báo tới ${staffName}. Vui lòng thử lại!`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setNudgingId(null);
    }
  };

  const urgentCount = items.filter((i) => i.remainingSeconds < 3600 * 6).length;

  return (
    <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-5 space-y-4 text-[var(--text)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-semibold text-[var(--text)]">
              Phiếu cọc xe sắp hết hạn 72 giờ
            </h2>
            {urgentCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium tabular-nums">
                {urgentCount} suất cần xử lý
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Danh sách các phiếu cọc còn dưới 6 giờ để nhân viên liên hệ và xác nhận hợp đồng.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] shrink-0">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Tự động kiểm tra mỗi 60 giây</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 ml-2 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Table Data */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-semibold">
              <th className="py-2.5 px-3">Mã phiếu cọc</th>
              <th className="py-2.5 px-3">Khách hàng</th>
              <th className="py-2.5 px-3">Mẫu xe</th>
              <th className="py-2.5 px-3">Số tiền cọc</th>
              <th className="py-2.5 px-3">Thời hạn 72h</th>
              <th className="py-2.5 px-3">Nhân viên phụ trách</th>
              <th className="py-2.5 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  Không có phiếu cọc nào sắp hết hạn cần xử lý.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isUrgent = item.remainingSeconds < 3600 * 3;
                const hasNudged = nudgedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--surface-subtle)] transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        {item.depositCode}
                      </span>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        {item.sepayTxnRef || item.vnpayTxnRef}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-[var(--text)]">{item.customerName}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                        {item.customerPhone}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-[var(--text)]">{item.carModel}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {item.variant} · {item.color}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-[var(--text)] tabular-nums">
                      {formatCurrencyVND(item.depositAmount)}
                    </td>

                    <td className="py-3 px-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tabular-nums border ${
                          isUrgent
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatCountdown(item.remainingSeconds)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-[var(--text)]">{item.assignedStaff}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{item.assignedShowroom}</div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleNudgeStaff(item.id, item.assignedStaff)}
                          disabled={hasNudged || nudgingId === item.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                            hasNudged
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] border-[var(--line-strong)]'
                          }`}
                        >
                          {nudgingId === item.id ? (
                            <>
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>Đang gửi...</span>
                            </>
                          ) : hasNudged ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Đã nhắc</span>
                            </>
                          ) : (
                            <>
                              <BellRing className="w-3 h-3 text-amber-600" />
                              <span>Nhắc xử lý</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveModalItem(item)}
                          className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
                          title="Xem chi tiết phiếu cọc"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Quick View (flat divider layout) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45">
          <div className="w-full max-w-lg rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-lg space-y-4 text-[var(--text)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-semibold text-sm">
                  Chi tiết phiếu cọc <span className="font-mono">{activeModalItem.depositCode}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs divide-y divide-[var(--line)]">
              <div className="pt-2 border-t-0">
                <dt className="text-[var(--text-muted)]">Khách hàng</dt>
                <dd className="font-semibold mt-0.5">{activeModalItem.customerName}</dd>
                <dd className="text-[var(--text-secondary)] tabular-nums">{activeModalItem.customerPhone}</dd>
              </div>
              <div className="pt-2 border-t-0">
                <dt className="text-[var(--text-muted)]">Tiền cọc giữ xe</dt>
                <dd className="font-bold text-emerald-700 text-sm tabular-nums mt-0.5">
                  {formatCurrencyVND(activeModalItem.depositAmount)}
                </dd>
                <dd className="text-[11px] text-[var(--text-muted)]">Thanh toán IPN</dd>
              </div>
              <div className="col-span-2 pt-3">
                <dt className="text-[var(--text-muted)]">Dòng xe đặt cọc</dt>
                <dd className="font-semibold text-sm mt-0.5">
                  {activeModalItem.carModel} · {activeModalItem.variant}
                </dd>
                <dd className="text-[var(--text-secondary)] mt-0.5">
                  Màu ngoại thất: {activeModalItem.color}
                </dd>
              </div>
              <div className="pt-3">
                <dt className="text-[var(--text-muted)]">Nhân viên phụ trách</dt>
                <dd className="font-medium mt-0.5">{activeModalItem.assignedStaff}</dd>
              </div>
              <div className="pt-3">
                <dt className="text-[var(--text-muted)]">Chi nhánh</dt>
                <dd className="font-medium mt-0.5">{activeModalItem.assignedShowroom}</dd>
              </div>
            </dl>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--surface-subtle)] hover:bg-[var(--line)] text-[var(--text)] cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNudgeStaff(activeModalItem.id, activeModalItem.assignedStaff);
                  setActiveModalItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium cursor-pointer transition-colors"
              >
                Nhắc nhân viên ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
