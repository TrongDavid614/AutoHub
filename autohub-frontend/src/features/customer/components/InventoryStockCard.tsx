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
    <div className="p-5 rounded-xl bg-[#131B2E] border border-cyan-500/30 shadow-lg text-[#DAE2FD] space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#3E4850]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#222A3D] text-[#89CEFF] flex items-center justify-center border border-[#3E4850]/60 shadow-sm">
            <Car className="w-4 h-4 text-[#89CEFF]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Tồn kho xe sẵn sàng bàn giao
            </h4>
            <p className="text-xs text-[#88929B]">
              Dữ liệu đối soát trực tiếp từ CSDL Showroom AutoHub
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          SẴN GIAO 72H
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-[#0B1326] border border-[#3E4850]/50 space-y-2 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white">{item.tenPhienBan}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#222A3D] text-[#89CEFF]">
                Màu: {item.mauSac}
              </span>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-[#BEC8D2]">
              <MapPin className="w-3.5 h-3.5 text-[#89CEFF] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-white">{item.tenShowroom}</span>
                <span className="text-[#88929B] block text-[11px]">{item.diaChiShowroom}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Sẵn có: <strong className="font-mono text-sm">{item.soLuongKhaDung}</strong> xe
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestDrive}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#222A3D] hover:bg-[#2D3449] text-[#89CEFF] text-[11px] font-medium border border-[#3E4850] transition-colors cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Lái thử</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeposit}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-medium transition-colors cursor-pointer"
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
