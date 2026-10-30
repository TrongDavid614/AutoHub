import React from 'react';
import type { CarDepositStatus, CarDepositItem } from '@/features/customer/types/car-deposit.types';

interface CarDepositFilterTabsProps {
  activeTab: 'ALL' | CarDepositStatus;
  deposits: CarDepositItem[];
  onSelectTab: (tab: 'ALL' | CarDepositStatus) => void;
}

const TABS: { key: 'ALL' | CarDepositStatus; label: string }[] = [
  { key: 'ALL', label: 'TẤT CẢ' },
  { key: 'PAID', label: 'ĐÃ ĐẶT CỌC (72H)' },
  { key: 'RESERVED', label: 'ĐÃ GÁN SỐ VIN' },
  { key: 'COMPLETED', label: 'HOÀN TẤT HỢP ĐỒNG' },
  { key: 'PENDING_PAYMENT', label: 'CHỜ THANH TOÁN' },
  { key: 'REFUND_REQUESTED', label: 'XIN HOÀN CỌC' },
  { key: 'REFUNDED', label: 'ĐÃ HOÀN TIỀN' },
  { key: 'EXPIRED', label: 'HẾT HẠN' },
];

export const CarDepositFilterTabs: React.FC<CarDepositFilterTabsProps> = ({
  activeTab,
  deposits,
  onSelectTab,
}) => {
  return (
    <div className="bg-surface-elevated/60 p-1.5 rounded-[6px] border border-surface-highlight overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const count =
            tab.key === 'ALL'
              ? deposits.length
              : deposits.filter((d) => d.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-accent-action text-accent-contrast shadow-[0_0_15px_rgba(14,165,233,0.35)]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-container'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-accent-contrast text-accent-primary font-bold' : 'bg-surface-interactive text-text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
