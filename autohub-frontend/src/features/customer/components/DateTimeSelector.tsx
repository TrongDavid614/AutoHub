import React, { useMemo, useEffect } from 'react';
import { Clock, Info, Check } from 'lucide-react';

export interface DateItem {
  id: string; // YYYY-MM-DD
  dayLabel: string;
  dateStr: string;
  badge?: string;
  badgeVariant?: 'primary' | 'emerald' | 'amber';
}

export interface TimeSlotItem {
  id: string;
  timeRange: string;
  isBooked?: boolean;
  isUnder24h?: boolean;
}

export const BASE_TIME_SLOTS: string[] = [
  '09:00 - 10:00',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '14:00 - 15:00',
  '15:30 - 16:30',
  '17:00 - 18:00',
];

export function isSlotAvailable24h(dateStr: string, slotStr: string): boolean {
  try {
    const startTime = slotStr.split(' - ')[0] || '09:00';
    const slotDate = new Date(`${dateStr}T${startTime}:00`);
    const now = new Date();
    // Bắt buộc cách thời điểm hiện tại tối thiểu 24 giờ + 5 phút theo quy định hệ thống CK_lh_24h
    return slotDate.getTime() >= now.getTime() + 24 * 60 * 60 * 1000 + 5 * 60 * 1000;
  } catch {
    return false;
  }
}

export function generateUpcomingDates(): DateItem[] {
  const dates: DateItem[] = [];
  const dayNames = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];

  const now = new Date();

  // Kiểm tra xem ngày mai có khung giờ nào còn đủ 24h không (khung giờ muộn nhất 17:00)
  const tomorrowLatest = new Date(now);
  tomorrowLatest.setDate(tomorrowLatest.getDate() + 1);
  tomorrowLatest.setHours(17, 0, 0, 0);

  // Nếu ngày mai không còn khung giờ nào đủ 24h, bắt đầu từ ngày mốt (offset 2)
  const startOffset = tomorrowLatest.getTime() >= now.getTime() + 24 * 60 * 60 * 1000 ? 1 : 2;

  for (let i = 0; i < 6; i++) {
    const offset = startOffset + i;
    const d = new Date(now);
    d.setDate(d.getDate() + offset);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    const dateStr = `${day}/${month}`;
    const dayLabel = offset === 1 ? 'NGÀY MAI' : offset === 2 ? (startOffset === 2 ? 'GẦN NHẤT (>=24H)' : dayNames[d.getDay()]) : dayNames[d.getDay()];

    dates.push({
      id: isoDate,
      dayLabel,
      dateStr,
      badge: i === 0 ? 'Khuyên dùng' : i === 1 ? 'Còn chỗ' : undefined,
      badgeVariant: i === 0 ? 'primary' : 'emerald',
    });
  }
  return dates;
}

export function getFirstValidBookingDateAndSlot(bookedSlots: string[] = []): { date: string; slot: string } {
  const dates = generateUpcomingDates();
  for (const d of dates) {
    for (const slot of BASE_TIME_SLOTS) {
      if (isSlotAvailable24h(d.id, slot) && !bookedSlots.includes(slot)) {
        return { date: d.id, slot };
      }
    }
  }
  return { date: dates[0]?.id || '2026-11-12', slot: '09:00 - 10:00' };
}

interface DateTimeSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  bookedSlots?: string[];
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  bookedSlots = [],
}) => {
  const availableDates = useMemo(() => generateUpcomingDates(), []);

  const timeSlots = useMemo(() => {
    return BASE_TIME_SLOTS.map((slotRange) => {
      const isBooked = bookedSlots.includes(slotRange);
      const isUnder24h = !isSlotAvailable24h(selectedDate, slotRange);
      return {
        id: slotRange,
        timeRange: slotRange,
        isBooked,
        isUnder24h,
      };
    });
  }, [bookedSlots, selectedDate]);

  // Tự động chuyển slot hợp lệ nếu slot hiện tại bị khóa (do trùng lịch hoặc dưới 24h)
  useEffect(() => {
    const currentSlotObj = timeSlots.find((s) => s.id === selectedSlot);
    if (!currentSlotObj || currentSlotObj.isBooked || currentSlotObj.isUnder24h) {
      const firstValid = timeSlots.find((s) => !s.isBooked && !s.isUnder24h);
      if (firstValid) {
        onSelectSlot(firstValid.id);
      }
    }
  }, [selectedDate, timeSlots, selectedSlot, onSelectSlot]);

  return (
    <div className="p-4 sm:p-5 rounded bg-surface-container/60 border border-surface-highlight space-y-4">
      {/* Notice Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded bg-canvas-deep/70 border border-surface-highlight/70 text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <Info className="w-4 h-4 text-accent-primary shrink-0" />
          <span>
            <strong className="text-text-primary">Quy định đặt lịch:</strong> Bắt buộc đặt trước tối thiểu 24 giờ để kiểm tra kỹ thuật & sạc pin 100%.
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-action/15 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold shrink-0 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>THỜI GIAN LÁI THỬ: 60 PHÚT/LƯỢT</span>
        </div>
      </div>

      {/* 1. Date Selector Tabs */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block">
          CHỌN NGÀY TRẢI NGHIỆM
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {availableDates.map((date) => {
            const isSelected = selectedDate === date.id;
            return (
              <button
                key={date.id}
                type="button"
                onClick={() => onSelectDate(date.id)}
                className={`p-3 rounded text-center border transition-all cursor-pointer relative flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-accent-action text-accent-contrast border-accent-primary shadow-[0_0_15px_rgba(14,165,233,0.3)] font-bold'
                    : 'bg-surface-elevated/70 text-text-secondary border-surface-highlight hover:border-surface-interactive hover:text-text-primary'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isSelected ? 'text-accent-contrast/90' : 'text-text-muted'
                }`}>
                  {date.dayLabel}
                </span>

                <span className="text-base font-bold font-mono tracking-tight">
                  {date.dateStr}
                </span>

                {date.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected
                      ? 'bg-canvas-deep/30 text-accent-contrast font-bold'
                      : date.badgeVariant === 'emerald'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                  }`}>
                    {date.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Time Slots Grid */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block">
          CHỌN KHUNG GIỜ LÁI THỬ
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isDisabled = slot.isBooked || slot.isUnder24h;

            if (isDisabled) {
              const label = slot.isBooked ? 'ĐÃ KÍN' : '< 24H';
              const tooltip = slot.isBooked ? 'Khung giờ này đã có khách đăng ký' : 'Cần đặt trước ít nhất 24 giờ';
              return (
                <div
                  key={slot.id}
                  title={tooltip}
                  className="p-3 rounded bg-canvas-deep/50 border border-surface-highlight/40 opacity-50 flex items-center justify-between text-xs cursor-not-allowed select-none"
                >
                  <span className="font-mono text-text-muted line-through">{slot.timeRange}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-surface-highlight">
                    {label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                className={`p-3 rounded border text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-accent-action text-accent-contrast border-accent-primary shadow-[0_0_15px_rgba(14,165,233,0.3)] font-bold'
                    : 'bg-surface-elevated text-text-primary border-surface-highlight hover:border-accent-primary/50'
                }`}
              >
                <span>{slot.timeRange}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-accent-contrast stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
