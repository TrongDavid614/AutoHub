import React from 'react';
import type { TestDriveStatus, TestDriveItem } from '../types';

interface TestDriveFilterTabsProps {
  activeTab: 'ALL' | TestDriveStatus;
  testDrives: TestDriveItem[];
  onSelectTab: (tab: 'ALL' | TestDriveStatus) => void;
}

const TABS: { key: 'ALL' | TestDriveStatus; label: string }[] = [
  { key: 'ALL', label: 'TẤT CẢ' },
  { key: 'PENDING', label: 'CHỜ DUYỆT' },
  { key: 'CONFIRMED', label: 'ĐÃ XÁC NHẬN' },
  { key: 'COMPLETED', label: 'HOÀN THÀNH' },
  { key: 'CANCELLED', label: 'ĐÃ HỦY' },
  { key: 'EXPIRED', label: 'HẾT HẠN' },
];

export const TestDriveFilterTabs: React.FC<TestDriveFilterTabsProps> = ({
  activeTab,
  testDrives,
  onSelectTab,
}) => {
  return (
    <div className="bg-surface-elevated/60 p-1.5 rounded-[6px] border border-surface-highlight overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const count =
            tab.key === 'ALL'
              ? testDrives.length
              : testDrives.filter((t) => t.status === tab.key).length;
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
