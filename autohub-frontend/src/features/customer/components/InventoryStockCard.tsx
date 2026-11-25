import React from 'react';
import { MapPin, CheckCircle2, Car, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { InventoryStockDetail } from '@/types/ai.types';

export interface InventoryStockCardProps {
  stocks: InventoryStockDetail[];
}

export const InventoryStockCard: React.FC<InventoryStockCardProps> = ({ stocks }) => {
  const navigate = useNavigate();

  const handleTestDrive = () => {
    navigate('/customer/test-drives');
  };

  const handleDeposit = () => {
    navigate('/customer/deposit-records');
  };

  const items = stocks ?? [];

  return (
    <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">
              Tồn kho xe sẵn sàng bàn giao
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Số lượng xe thực tế tại hệ thống Showroom AutoHub
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Sẵn xe
        </span>
      </div>

      <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-lg overflow-hidden">
        {items.map((item, idx) => (
          <div key={idx} className="p-3.5 bg-[var(--surface)] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs text-[var(--text)]">{item.tenPhienBan}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text-secondary)]">
                Màu: {item.mauSac}
              </span>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[var(--text)]">{item.tenShowroom}</span>
                <span className="text-[var(--text-muted)] block text-[11px]">{item.diaChiShowroom}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="tabular-nums">
                  Sẵn có: <strong>{item.soLuongKhaDung}</strong> xe
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestDrive}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--text)] text-[11px] font-medium border border-[var(--line-strong)] transition-colors cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Lái thử</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeposit}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <span>Giữ xe</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
