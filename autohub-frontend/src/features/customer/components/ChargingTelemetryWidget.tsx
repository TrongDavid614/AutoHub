import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export interface ChargingTelemetryWidgetProps {
  hasChargingDevice?: boolean;
}

export const ChargingTelemetryWidget: React.FC<ChargingTelemetryWidgetProps> = ({
  hasChargingDevice = true,
}) => {
  return (
    <div className="rounded-lg bg-[var(--surface)] border border-[var(--line)] p-4 flex items-start gap-3">
      {hasChargingDevice ? (
        <Zap className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
      ) : (
        <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
      )}
      <div className="space-y-0.5">
        <div className="text-xs font-semibold text-[var(--text)]">
          {hasChargingDevice
            ? 'Tương thích chuẩn sạc 22kW 3 pha'
            : 'Phụ kiện chính hãng bảo đảm an toàn bảo hành'}
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          {hasChargingDevice
            ? 'Hỗ trợ khảo sát và lắp đặt tận nhà bởi kỹ thuật viên AutoHub, không ảnh hưởng điều kiện bảo hành pin.'
            : 'Sản phẩm được kiểm định đúng thông số cho từng dòng xe và giữ nguyên quyền lợi bảo hành chính hãng.'}
        </p>
      </div>
    </div>
  );
};
