import React from 'react';
import { Clock, Info, Check } from 'lucide-react';

export interface DateItem {
  id: string;
  dayLabel: string;
  dateStr: string;
  badge?: string;
  badgeVariant?: 'primary' | 'emerald' | 'amber';
}

export interface TimeSlotItem {
  id: string;
  timeRange: string;
  isBooked?: boolean;
}

const AVAILABLE_DATES: DateItem[] = [
  { id: '25/10', dayLabel: 'NGÀY MAI', dateStr: '25/10', badge: 'Được chọn', badgeVariant: 'primary' },
  { id: '26/10', dayLabel: 'THỨ BẢY', dateStr: '26/10', badge: 'Còn chỗ', badgeVariant: 'emerald' },
  { id: '27/10', dayLabel: 'CHỦ NHẬT', dateStr: '27/10', badge: 'Sắp kín', badgeVariant: 'primary' },
  { id: '28/10', dayLabel: 'THỨ HAI', dateStr: '28/10' },
  { id: '29/10', dayLabel: 'THỨ BA', dateStr: '29/10' },
  { id: '30/10', dayLabel: 'THỨ TƯ', dateStr: '30/10' },
];

const TIME_SLOTS: TimeSlotItem[] = [
  { id: '09:00 - 10:00', timeRange: '09:00 - 10:00' },
  { id: '10:30 - 11:30', timeRange: '10:30 - 11:30' },
  { id: '11:30 - 12:30', timeRange: '11:30 - 12:30', isBooked: true },
  { id: '14:00 - 15:00', timeRange: '14:00 - 15:00' },
  { id: '15:30 - 16:30', timeRange: '15:30 - 16:30' },
];

interface DateTimeSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
}) => {
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
          {AVAILABLE_DATES.map((date) => {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isBooked = !!slot.isBooked;

            if (isBooked) {
              return (
                <div
                  key={slot.id}
                  className="p-3 rounded bg-canvas-deep/50 border border-surface-highlight/40 opacity-50 flex items-center justify-between text-xs cursor-not-allowed select-none"
                >
                  <span className="font-mono text-text-muted line-through">{slot.timeRange}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-surface-highlight">
                    ĐÃ KÍN
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
