import React from 'react';
import type { AccessoryOrderStatus } from '@/types/order.types';

export type FilterTab = 'ALL' | AccessoryOrderStatus;

interface OrderFilterTabsProps {
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  getOrderCount: (tab: FilterTab) => number;
}

const ORDER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'TẤT CẢ' },
  { key: 'PENDING_PAYMENT', label: 'CHỜ THANH TOÁN' },
  { key: 'PENDING', label: 'CHỜ DUYỆT (COD)' },
  { key: 'PAID', label: 'ĐÃ THANH TOÁN' },
  { key: 'PROCESSING', label: 'ĐANG XỬ LÝ' },
  { key: 'SHIPPING', label: 'ĐANG GIAO HÀNG' },
  { key: 'DELIVERED', label: 'ĐÃ GIAO HÀNG' },
  { key: 'CANCELLED', label: 'ĐÃ HỦY' },
  { key: 'RETURNED', label: 'ĐỔI TRẢ' },
];

export const OrderFilterTabs: React.FC<OrderFilterTabsProps> = ({
  activeTab,
  onSelectTab,
  getOrderCount,
}) => {
  return (
    <div className="bg-surface-elevated/60 p-1.5 rounded-[6px] border border-surface-highlight overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {ORDER_TABS.map((tab) => {
          const count = getOrderCount(tab.key);
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
                  isActive ? 'bg-accent-contrast text-accent-primary' : 'bg-surface-interactive text-text-muted'
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
