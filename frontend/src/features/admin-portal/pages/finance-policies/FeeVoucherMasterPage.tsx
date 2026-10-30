import React, { useState } from 'react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { RegistrationFeePage } from './RegistrationFeePage';
import { VoucherMasterPage } from './VoucherMasterPage';

export const FeeVoucherMasterPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [activeSection, setActiveSection] = useState<'fees' | 'vouchers'>('fees');

  return (
    <div className="space-y-6">
      <div className={`flex p-1.5 rounded-lg border w-fit gap-2 transition-colors ${
        isDarkMode
          ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <button
          type="button"
          onClick={() => setActiveSection('fees')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeSection === 'fees'
              ? isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                : 'bg-sky-50 text-blue-600 border border-sky-200'
              : isDarkMode
                ? 'text-[#88929B] hover:text-white'
                : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Biểu Phí Lăn Bánh & Lãi Suất
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('vouchers')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeSection === 'vouchers'
              ? isDarkMode
                ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30'
                : 'bg-sky-50 text-blue-600 border border-sky-200'
              : isDarkMode
                ? 'text-[#88929B] hover:text-white'
                : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Khuyến Mại & Mã Voucher
        </button>
      </div>

      {activeSection === 'fees' ? <RegistrationFeePage /> : <VoucherMasterPage />}
    </div>
  );
};
